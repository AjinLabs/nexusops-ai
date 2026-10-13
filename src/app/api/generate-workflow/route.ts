import { NextResponse } from 'next/server';
import { Workflow, WorkflowNode, WorkflowEdge, RiskTier } from '@/types';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A prompt description is required' }, { status: 400 });
    }

    const lower = prompt.toLowerCase();
    const nodes: WorkflowNode[] = [];
    const edges: WorkflowEdge[] = [];
    let xOffset = 60;
    const yOffset = 200;
    const stepGap = 280;

    let risk: RiskTier = 'low';
    if (lower.includes('payment') || lower.includes('invoice') || lower.includes('disburse') || lower.includes('payout') || lower.includes('delete') || lower.includes('iam')) {
      risk = 'critical';
    } else if (lower.includes('approval') || lower.includes('approve') || lower.includes('crm') || lower.includes('slack') || lower.includes('email') || lower.includes('ticket')) {
      risk = 'high';
    } else if (lower.includes('triage') || lower.includes('classify')) {
      risk = 'medium';
    }

    // 1. Trigger Node
    const triggerType = lower.includes('schedule') || lower.includes('nightly') || lower.includes('hourly')
      ? 'schedule'
      : lower.includes('email')
      ? 'email'
      : 'webhook';

    const triggerNodeId = 'gen_node_trigger';
    nodes.push({
      id: triggerNodeId,
      type: 'triggerNode',
      position: { x: xOffset, y: yOffset },
      data: {
        label: triggerType === 'schedule' ? 'Scheduled Cron Trigger' : 'Inbound Webhook Stimulus',
        category: 'trigger',
        subType: triggerType,
        description: `Initiates workflow upon inbound ${triggerType} payload validation`,
        config: { triggerType },
        status: 'idle',
      },
    });

    let lastNodeId = triggerNodeId;

    // 2. Extraction / Ingestion Node if mentioned
    if (lower.includes('extract') || lower.includes('parse') || lower.includes('invoice') || lower.includes('resume') || lower.includes('document')) {
      xOffset += stepGap;
      const extractNodeId = 'gen_node_extract';
      nodes.push({
        id: extractNodeId,
        type: 'aiNode',
        position: { x: xOffset, y: yOffset },
        data: {
          label: 'Schema Field Extractor',
          category: 'ai',
          subType: 'extraction',
          description: 'Extracts validated structured JSON schema from raw input document',
          config: { agentId: 'agent_extractor', schemaValidation: true },
          status: 'idle',
        },
      });
      edges.push({ id: `e-${lastNodeId}-${extractNodeId}`, source: lastNodeId, target: extractNodeId, animated: true });
      lastNodeId = extractNodeId;
    }

    // 3. Classification / Triage Node
    if (lower.includes('classify') || lower.includes('triage') || lower.includes('categorize') || lower.includes('sentiment') || lower.includes('priority')) {
      xOffset += stepGap;
      const classNodeId = 'gen_node_classifier';
      nodes.push({
        id: classNodeId,
        type: 'aiNode',
        position: { x: xOffset, y: yOffset },
        data: {
          label: 'Semantic Intent & Priority Classifier',
          category: 'ai',
          subType: 'classification',
          description: 'Classifies urgency level and domain routing using Analyst Agent',
          config: { agentId: 'agent_analyst' },
          status: 'idle',
        },
      });
      edges.push({ id: `e-${lastNodeId}-${classNodeId}`, source: lastNodeId, target: classNodeId, animated: true });
      lastNodeId = classNodeId;
    }

    // 4. RAG / Knowledge retrieval Node
    if (lower.includes('search') || lower.includes('knowledge') || lower.includes('rag') || lower.includes('policy') || lower.includes('docs') || lower.includes('playbook')) {
      xOffset += stepGap;
      const ragNodeId = 'gen_node_rag';
      nodes.push({
        id: ragNodeId,
        type: 'aiNode',
        position: { x: xOffset, y: yOffset },
        data: {
          label: 'Enterprise RAG Semantic Retrieval',
          category: 'ai',
          subType: 'rag',
          description: 'Searches authorized workspace document index with citation groundings',
          config: { agentId: 'agent_researcher', topK: 3 },
          status: 'idle',
        },
      });
      edges.push({ id: `e-${lastNodeId}-${ragNodeId}`, source: lastNodeId, target: ragNodeId, animated: true });
      lastNodeId = ragNodeId;
    }

    // 5. Synthesis / Generation Node
    xOffset += stepGap;
    const synthNodeId = 'gen_node_synthesis';
    nodes.push({
      id: synthNodeId,
      type: 'aiNode',
      position: { x: xOffset, y: yOffset },
      data: {
        label: 'Contextual Action & Draft Synthesizer',
        category: 'ai',
        subType: 'completion',
        description: 'Generates grounded business response based on extracted telemetry and citations',
        config: { agentId: 'agent_planner' },
        status: 'idle',
      },
    });
    edges.push({ id: `e-${lastNodeId}-${synthNodeId}`, source: lastNodeId, target: synthNodeId, animated: true });
    lastNodeId = synthNodeId;

    // 6. Human Approval Gate if requested or high risk
    if (lower.includes('approve') || lower.includes('approval') || lower.includes('manager') || risk === 'critical' || risk === 'high') {
      xOffset += stepGap;
      const approvalNodeId = 'gen_node_approval';
      nodes.push({
        id: approvalNodeId,
        type: 'logicNode',
        position: { x: xOffset, y: yOffset },
        data: {
          label: 'Human Governance Approval Gate',
          category: 'logic',
          subType: 'approval_gate',
          description: 'Enforces human review before triggering downstream side effects',
          config: { requiredRole: 'approver', timeoutHours: 24, riskLevel: risk },
          requiresApproval: true,
          riskLevel: risk,
          status: 'idle',
        },
      });
      edges.push({
        id: `e-${lastNodeId}-${approvalNodeId}`,
        source: lastNodeId,
        target: approvalNodeId,
        label: 'Requires Sign-Off',
        animated: true,
      });
      lastNodeId = approvalNodeId;
    }

    // 7. Action / Notification Node
    xOffset += stepGap;
    const actionNodeId = 'gen_node_dispatch';
    nodes.push({
      id: actionNodeId,
      type: 'outputNode',
      position: { x: xOffset, y: yOffset },
      data: {
        label: lower.includes('slack') ? 'Dispatch Slack Message' : 'Disburse Execution Artifact',
        category: 'output',
        subType: lower.includes('slack') ? 'slack' : 'api_response',
        description: 'Dispatches finalized result to target system with idempotency key',
        config: { destination: lower.includes('slack') ? '#operations-hub' : 'Webhook Callback' },
        status: 'idle',
      },
    });
    edges.push({ id: `e-${lastNodeId}-${actionNodeId}`, source: lastNodeId, target: actionNodeId, label: 'Verified & Dispatched' });

    const slug = prompt.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const generatedWorkflow: Workflow = {
      id: `wf_gen_${Date.now()}`,
      name: prompt.length > 50 ? `${prompt.slice(0, 48)}...` : prompt,
      slug: `autogen-${slug}`,
      description: `Synthesized from natural-language specification: "${prompt}"`,
      category: lower.includes('finance') ? 'finance' : lower.includes('hr') ? 'hr' : lower.includes('support') ? 'support' : 'engineering',
      version: '1.0.0-draft',
      status: 'draft',
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      nodes,
      edges,
      triggerType: triggerType === 'schedule' ? 'schedule' : 'webhook',
      riskClassification: risk,
      runCount: 0,
      successRate: 100.0,
      avgDurationMs: 0,
      estimatedCostPerRun: 0.045,
      author: 'Alex Mercer (AI Architect)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      workflow: generatedWorkflow,
      summary: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        riskTier: risk,
        requiresHumanApproval: nodes.some((n) => n.data.requiresApproval),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
