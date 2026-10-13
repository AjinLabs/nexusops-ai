import {
  Workflow,
  WorkflowRun,
  NodeRunRecord,
  WorkflowNode,
  ApprovalRequest,
  User,
} from '@/types';
import { workflowRunsRepo, workflowsRepo, approvalsRepo, createAuditEntry } from '@/server/db';

export interface ExecutionOptions {
  triggerSource?: 'manual' | 'schedule' | 'webhook' | 'event' | 'simulation';
  mode?: 'production' | 'simulation';
  initiatedBy?: string;
  initialPayload?: Record<string, any>;
  actor?: User;
}

export async function executeWorkflow(
  workflow: Workflow,
  options: ExecutionOptions = {}
): Promise<WorkflowRun> {
  const mode = options.mode || 'production';
  const triggerSource = options.triggerSource || 'manual';
  const initiatedBy = options.initiatedBy || options.actor?.name || 'Authorized Operator';

  const runId = `run_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const startTime = new Date().toISOString();

  // Create initial run record
  const initialRun: WorkflowRun = {
    id: runId,
    workflowId: workflow.id,
    workflowName: workflow.name,
    workflowVersion: workflow.version,
    triggerSource,
    status: 'running',
    mode,
    startTime,
    initiatedBy,
    orgId: workflow.orgId,
    workspaceId: workflow.workspaceId,
    nodeRuns: [],
    tokensUsed: 0,
    estimatedCost: 0,
    currentStepIndex: 0,
    totalSteps: workflow.nodes.length,
  };

  workflowRunsRepo.create(initialRun);

  let accumulatedTokens = 0;
  let accumulatedCost = 0;
  let hasPendingApproval = false;
  let currentRun = initialRun;

  // Topological / Sequential walk through nodes
  const nodes = workflow.nodes;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nodeStartTime = new Date().toISOString();
    const nodeRunId = `nrun_${runId}_${i}`;

    // Record pending node start
    const nodeRecord: NodeRunRecord = {
      id: nodeRunId,
      nodeId: node.id,
      nodeLabel: node.data.label,
      category: node.data.category,
      status: 'running',
      startedAt: nodeStartTime,
      inputPayload: i === 0 ? options.initialPayload || { source: triggerSource } : undefined,
    };

    currentRun.nodeRuns.push(nodeRecord);
    currentRun.currentStepIndex = i + 1;
    workflowRunsRepo.update(runId, {
      nodeRuns: currentRun.nodeRuns,
      currentStepIndex: i + 1,
    });

    // Check if this node is an approval gate
    if (
      node.data.subType === 'approval_gate' ||
      node.data.requiresApproval ||
      node.data.riskLevel === 'critical' ||
      node.data.riskLevel === 'high'
    ) {
      // Create Approval Request
      const approvalId = `appr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const approvalReq: ApprovalRequest = {
        id: approvalId,
        runId: runId,
        workflowId: workflow.id,
        workflowName: workflow.name,
        nodeId: node.id,
        requestorName: `NexusOps Engine (${mode.toUpperCase()})`,
        riskLevel: node.data.riskLevel || 'high',
        targetSystem: (node.data.config && node.data.config.targetSystem) || 'Enterprise ERP / API Gateway',
        actionType: (node.data.config && node.data.config.actionType) || 'HIGH_RISK_TOOL_EXECUTION',
        parameters: {
          nodeLabel: node.data.label,
          category: node.data.category,
          config: node.data.config,
          mode,
        },
        reason: `Operation classified as ${node.data.riskLevel || 'high'} risk. Organizational governance requires human validation.`,
        supportingEvidence: `Preceding nodes [1 to ${i}] completed successfully with 100% schema compliance.`,
        expectedSideEffects:
          mode === 'simulation'
            ? 'Simulated execution only. No live external endpoints called.'
            : 'Live external system invocation with authorized API credentials.',
        status: 'pending',
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      };

      approvalsRepo.create(approvalReq);

      nodeRecord.status = 'waiting_approval';
      nodeRecord.outputPayload = {
        approvalRequestId: approvalId,
        riskLevel: approvalReq.riskLevel,
        message: 'Workflow paused at governance gate awaiting authorized review.',
      };

      hasPendingApproval = true;

      // Update run status to waiting_approval
      currentRun = workflowRunsRepo.update(runId, {
        status: 'waiting_approval',
        nodeRuns: currentRun.nodeRuns,
      })!;

      if (options.actor) {
        createAuditEntry(
          options.actor,
          'WORKFLOW_PAUSED_FOR_APPROVAL',
          'workflow',
          workflow.id,
          workflow.name,
          'warning',
          { runId, approvalId, nodeId: node.id }
        );
      }

      // Exit loop here until human approves
      break;
    }

    // Simulate node execution latency and output
    const stepDuration = Math.floor(Math.random() * 400) + 150;
    const nodeTokens = node.data.category === 'ai' ? Math.floor(Math.random() * 800) + 400 : 0;
    const nodeCost = parseFloat(((nodeTokens / 1000) * 0.015).toFixed(4));

    accumulatedTokens += nodeTokens;
    accumulatedCost += nodeCost;

    nodeRecord.status = 'completed';
    nodeRecord.endedAt = new Date().toISOString();
    nodeRecord.durationMs = stepDuration;
    nodeRecord.outputPayload = generateNodeMockOutput(node, mode);

    workflowRunsRepo.update(runId, {
      nodeRuns: currentRun.nodeRuns,
      tokensUsed: accumulatedTokens,
      estimatedCost: parseFloat(accumulatedCost.toFixed(4)),
    });
  }

  if (!hasPendingApproval) {
    const endTime = new Date().toISOString();
    const totalDuration = new Date(endTime).getTime() - new Date(startTime).getTime();

    currentRun = workflowRunsRepo.update(runId, {
      status: 'completed',
      endTime,
      durationMs: totalDuration,
      tokensUsed: accumulatedTokens,
      estimatedCost: parseFloat(accumulatedCost.toFixed(4)),
    })!;

    // Update workflow stats
    const currentWf = workflowsRepo.getById(workflow.id);
    if (currentWf) {
      workflowsRepo.save({
        ...currentWf,
        runCount: currentWf.runCount + 1,
        lastRunAt: endTime,
      });
    }

    if (options.actor) {
      createAuditEntry(
        options.actor,
        'WORKFLOW_EXECUTION_COMPLETED',
        'workflow',
        workflow.id,
        workflow.name,
        'success',
        { runId, durationMs: totalDuration, mode }
      );
    }
  }

  return currentRun;
}

export async function resumeWorkflowAfterApproval(
  runId: string,
  approval: ApprovalRequest,
  decidedBy: User
): Promise<WorkflowRun | undefined> {
  const run = workflowRunsRepo.getById(runId);
  if (!run) return undefined;

  const workflow = workflowsRepo.getById(run.workflowId);
  if (!workflow) return undefined;

  // Mark the waiting node as completed
  const updatedNodes = run.nodeRuns.map((nr) => {
    if (nr.status === 'waiting_approval') {
      return {
        ...nr,
        status: 'completed' as const,
        endedAt: new Date().toISOString(),
        outputPayload: {
          ...nr.outputPayload,
          approvalStatus: 'approved',
          authorizedBy: decidedBy.name,
          authorizationTimestamp: new Date().toISOString(),
        },
      };
    }
    return nr;
  });

  // Finish remaining nodes
  const startIndex = run.currentStepIndex || 0;
  for (let i = startIndex; i < workflow.nodes.length; i++) {
    const node = workflow.nodes[i];
    const nodeRecord: NodeRunRecord = {
      id: `nrun_${runId}_${i}`,
      nodeId: node.id,
      nodeLabel: node.data.label,
      category: node.data.category,
      status: 'completed',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationMs: 250,
      outputPayload: generateNodeMockOutput(node, run.mode),
    };
    updatedNodes.push(nodeRecord);
  }

  const endTime = new Date().toISOString();
  const finalRun = workflowRunsRepo.update(runId, {
    status: 'completed',
    endTime,
    nodeRuns: updatedNodes,
    currentStepIndex: workflow.nodes.length,
  });

  createAuditEntry(
    decidedBy,
    'WORKFLOW_RESUMED_AND_COMPLETED',
    'workflow',
    workflow.id,
    workflow.name,
    'success',
    { runId, approvalId: approval.id }
  );

  return finalRun;
}

function generateNodeMockOutput(node: WorkflowNode, mode: 'production' | 'simulation'): any {
  if (node.data.category === 'trigger') {
    return {
      event: 'Received inbound stimulus',
      source: node.data.subType,
      timestamp: new Date().toISOString(),
      payloadDigest: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    };
  }

  if (node.data.category === 'ai') {
    return {
      agent: node.data.config?.agentId || 'Specialized Agent',
      verdict: 'Extraction & classification verified',
      confidence: 0.992,
      schemaValid: true,
      citationsFound: 3,
      mode,
    };
  }

  if (node.data.category === 'data') {
    return {
      rowsEvaluated: 124,
      varianceDiscrepancy: 0.0,
      matchedPrimaryRecord: true,
      checksumValid: true,
    };
  }

  if (node.data.category === 'logic') {
    return {
      branchSelected: 'primary_route',
      expressionEvaluated: true,
      conditionResult: 'PASS',
    };
  }

  if (node.data.category === 'integration') {
    return {
      targetSystem: node.data.subType || 'API Gateway',
      status: mode === 'simulation' ? 'SIMULATED_SUCCESS_200' : 'HTTP_201_CREATED',
      responseHeaders: { 'x-nexusops-idempotency': 'enforced' },
    };
  }

  return {
    status: 'success',
    dispatchedAt: new Date().toISOString(),
    recipient: '#operations-feed',
  };
}
