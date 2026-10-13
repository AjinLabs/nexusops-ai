import { NextResponse } from 'next/server';
import { getDatabase, workflowsRepo, approvalsRepo, workflowRunsRepo, agentsRepo } from '@/server/db';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lower = message.toLowerCase();
    const db = getDatabase();

    let responseText = '';
    let toolInvoked = '';
    let citations: string[] = [];
    let suggestedFollowUps: string[] = [];
    let actionCard: any = null;

    if (lower.includes('failed') || lower.includes('failure')) {
      toolInvoked = 'query_execution_traces(filter: status="failed")';
      const failedRuns = db.workflowRuns.filter((r) => r.status === 'failed');
      if (failedRuns.length === 0) {
        responseText = `### System Health Report: Zero Failures in Active Window
All active workflows across workspace **Production Operations (ws_prod)** are operating within normal parameters. 

**Summary Metrics:**
- **24-Hour Success Rate:** 98.6%
- **Recent Executions Analyzed:** ${db.workflowRuns.length}
- **Current Awaiting Approvals:** ${db.approvals.filter((a) => a.status === 'pending').length}

The latest automated run \`run_991823\` for *AP Invoice Extraction & 2-Way Match* did not fail—it safely entered the **Waiting for Approval** state as designed by your governance policy because the invoice amount ($14,850.00) exceeds the $5,000 threshold.`;
      } else {
        responseText = `Found ${failedRuns.length} failed execution(s). Investigation revealed execution ID \`${failedRuns[0].id}\` terminated due to: *${failedRuns[0].errorDetails || 'Rate limit threshold exceeded'}*.`;
      }
      suggestedFollowUps = [
        'Inspect pending approval for the invoice workflow',
        'Show latency percentiles for the last 24 hours',
        'Check integration status for Slack and PostgreSQL',
      ];
    } else if (lower.includes('expensive') || lower.includes('cost') || lower.includes('budget')) {
      toolInvoked = 'query_cost_telemetry(groupBy: "agent", window: "30d")';
      const agents = agentsRepo.list();
      const sorted = [...agents].sort((a, b) => b.usageCost - a.usageCost);
      const top3 = sorted.slice(0, 3);

      responseText = `### Cost Intelligence Breakdown (Current Billing Cycle)
Total AI compute spend to date is **$${db.budget.currentSpend.toFixed(2)} USD** against the monthly organization cap of **$${db.budget.monthlyLimit.toLocaleString()} USD** (${((db.budget.currentSpend / db.budget.monthlyLimit) * 100).toFixed(1)}% utilization).

**Top 3 Most Resource-Intensive Agents:**
1. **${top3[0]?.name}** (${top3[0]?.modelName}): **$${top3[0]?.usageCost.toFixed(2)}** (${top3[0]?.totalRuns} runs)
2. **${top3[1]?.name}** (${top3[1]?.modelName}): **$${top3[1]?.usageCost.toFixed(2)}** (${top3[1]?.totalRuns} runs)
3. **${top3[2]?.name}** (${top3[2]?.modelName}): **$${top3[2]?.usageCost.toFixed(2)}** (${top3[2]?.totalRuns} runs)

*Note: Safe Tool Executor accounts for the highest run volume, while Claude 3.5 Sonnet researcher invocations dominate per-query token consumption due to document context chunking.*`;
      suggestedFollowUps = [
        'Adjust monthly budget alert threshold',
        'Enable model fallback to GPT-4o-mini for routine triage',
        'Audit token usage per workflow',
      ];
    } else if (lower.includes('approval') || lower.includes('pending') || lower.includes('why')) {
      toolInvoked = 'query_approvals(filter: status="pending")';
      const pending = approvalsRepo.list('pending');
      if (pending.length > 0) {
        const top = pending[0];
        responseText = `### Pending Approval Analysis: Request \`${top.id}\`
- **Workflow:** ${top.workflowName}
- **Target Action:** \`${top.actionType}\` on system *${top.targetSystem}*
- **Risk Classification:** **CRITICAL RISK**
- **Triggered By:** ${top.requestorName}

**Policy Trigger Reason:**
${top.reason}

**Supporting Evidence:**
${top.supportingEvidence}

**Parameters:**
\`\`\`json
${JSON.stringify(top.parameters, null, 2)}
\`\`\`

Organizational policy prohibits auto-settlement above $5,000 without an authorized governance sign-off. Marcus Vance or Sarah Chen must review and authorize this action before funds are staged.`;
        actionCard = {
          type: 'approval_preview',
          approvalId: top.id,
          workflowId: top.workflowId,
          amount: top.parameters.amountUsd,
          vendor: top.parameters.vendor,
        };
      } else {
        responseText = 'No pending approvals in the current queue. All governance gates are currently satisfied.';
      }
      suggestedFollowUps = [
        'Authorize Datadog invoice payment',
        'View audit logs for this workflow',
        'Open Visual Workflow Studio for AP Invoice Reconciliation',
      ];
    } else if (lower.includes('disconnected') || lower.includes('integration')) {
      toolInvoked = 'inspect_integrations_health()';
      const disconnected = db.integrations.filter((i) => !i.isConnected);
      responseText = `### Integration Connectivity Audit
Currently, **${disconnected.length}** integration(s) are in an unconfigured or disconnected state:
${disconnected.map((i) => `- **${i.name}** (\`${i.key}\`): Auth mode ${i.authType.toUpperCase()} — Required scopes: \`${i.scopes.join(', ')}\``).join('\n')}

Workflows attempting to dispatch actions to these targets will automatically fail pre-flight validation until credentials are provided.`;
      suggestedFollowUps = [
        'Configure Atlassian Jira credentials',
        'Setup Salesforce OAuth connection',
        'Test active Slack Enterprise webhook',
      ];
    } else {
      toolInvoked = 'rag_semantic_search(query: "' + message.slice(0, 40) + '")';
      citations = [
        'Acme Enterprise Security Standard 2026 (Section 4.2)',
        'Global Vendor Procurement Policy v5',
      ];
      responseText = `I have analyzed your operational telemetry and indexed enterprise governance policies.

NexusOps provides autonomous execution with strict human oversight:
- **Active Agents:** 10 registered specialized agents with bounded tools
- **Workflows:** 3 published enterprise automations running with live DAG tracing
- **Governance:** RBAC-enforced approval queues for all critical risk tiers

How would you like to proceed? You can ask me to draft a new workflow, analyze cost metrics, inspect pending approvals, or query execution run traces.`;
      suggestedFollowUps = [
        'Which workflows failed today?',
        'Show me the most expensive agents this month',
        'Explain why an approval is pending',
        'Generate a draft automation for employee onboarding',
      ];
    }

    return NextResponse.json({
      success: true,
      message: responseText,
      toolInvoked,
      citations,
      suggestedFollowUps,
      actionCard,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Copilot query failed' }, { status: 500 });
  }
}
