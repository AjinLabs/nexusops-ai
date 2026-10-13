'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PlayCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter,
  Activity,
  Layers,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { WorkflowRun } from '@/types';

export default function WorkflowRunsPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // High-fidelity display data
  const mockRuns: WorkflowRun[] = [
    {
      id: 'run_991823',
      workflowId: 'wf_invoice_proc',
      workflowName: 'AP Invoice Extraction & Line-Item Reconciliation',
      workflowVersion: '1.4.0',
      triggerSource: 'webhook',
      status: 'waiting_approval',
      mode: 'production',
      startTime: '2026-10-13T06:12:00Z',
      initiatedBy: 'Inbound S3 Invoice Event (#EVT-4819)',
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      tokensUsed: 4280,
      estimatedCost: 0.084,
      currentStepIndex: 4,
      totalSteps: 7,
      nodeRuns: [],
    },
    {
      id: 'run_991815',
      workflowId: 'wf_support_triage',
      workflowName: 'Customer Support SLA Triage & Resolution',
      workflowVersion: '2.1.0',
      triggerSource: 'webhook',
      status: 'completed',
      mode: 'production',
      startTime: '2026-10-13T05:40:00Z',
      endTime: '2026-10-13T05:40:02Z',
      durationMs: 1820,
      initiatedBy: 'Zendesk Webhook (#TKT-99124)',
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      tokensUsed: 2190,
      estimatedCost: 0.038,
      currentStepIndex: 5,
      totalSteps: 5,
      nodeRuns: [],
    },
    {
      id: 'run_991800',
      workflowId: 'wf_incident_postmortem',
      workflowName: 'SecOps Critical Incident Auto-Containment',
      workflowVersion: '1.1.0',
      triggerSource: 'event',
      status: 'completed',
      mode: 'production',
      startTime: '2026-10-12T22:30:00Z',
      endTime: '2026-10-12T22:30:04Z',
      durationMs: 4120,
      initiatedBy: 'AWS GuardDuty Event',
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      tokensUsed: 6240,
      estimatedCost: 0.12,
      currentStepIndex: 6,
      totalSteps: 6,
      nodeRuns: [],
    },
    {
      id: 'run_991790',
      workflowId: 'wf_invoice_proc',
      workflowName: 'AP Invoice Extraction & Line-Item Reconciliation',
      workflowVersion: '1.4.0',
      triggerSource: 'simulation',
      status: 'completed',
      mode: 'simulation',
      startTime: '2026-10-12T18:15:00Z',
      endTime: '2026-10-12T18:15:02Z',
      durationMs: 2100,
      initiatedBy: 'Alex Mercer (Sandbox Test)',
      orgId: 'org_acme',
      workspaceId: 'ws_prod',
      tokensUsed: 3100,
      estimatedCost: 0.052,
      currentStepIndex: 7,
      totalSteps: 7,
      nodeRuns: [],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#16803C]" /> COMPLETED
          </span>
        );
      case 'waiting_approval':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25 flex items-center gap-1 animate-pulse">
            <ShieldAlert className="w-3 h-3 text-[#C53030]" /> WAITING APPROVAL
          </span>
        );
      case 'running':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin text-[#0B5497]" /> RUNNING
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#FAF8F3] text-[#4A5B73] border border-[#E8E3D8]">
            {status.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">Workflow Runs & Traces</h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              LIVE RUNTIME
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Durable execution logs, node-level step progression, and token consumption audits.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7E8FA4] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search run ID, workflow, or trigger..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto">
          {['all', 'completed', 'waiting_approval', 'running'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1 rounded-full uppercase font-medium tracking-wider transition-all ${
                statusFilter === s
                  ? 'bg-[#0B5497] text-white font-semibold shadow-sm'
                  : 'text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#FAF8F3]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Runs Table */}
      <div className="rounded-2xl bg-white border border-[#E8E3D8] overflow-hidden shadow-human">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E8E3D8] bg-[#FAF8F3] text-[#7E8FA4] text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Run Identifier</th>
              <th className="py-3 px-4">Workflow</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Triggered By</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Tokens / Cost</th>
              <th className="py-3 px-4 text-right">Trace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3D8]">
            {mockRuns.map((run) => (
              <tr key={run.id} className="hover:bg-[#FAF8F3] transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-[#0E1E38]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#0B5497]">{run.id}</span>
                    {run.mode === 'simulation' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] text-[9px] uppercase font-bold border border-[#B45309]/25">
                        SIM
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#0E1E38]">{run.workflowName}</div>
                  <div className="text-[10px] text-[#7E8FA4] font-mono">v{run.workflowVersion}</div>
                </td>
                <td className="py-3.5 px-4">{getStatusBadge(run.status)}</td>
                <td className="py-3.5 px-4 text-[#4A5B73] truncate max-w-[200px]">
                  {run.initiatedBy}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#4A5B73]">
                  {run.durationMs ? `${(run.durationMs / 1000).toFixed(2)}s` : 'Active'}
                </td>
                <td className="py-3.5 px-4 font-mono text-[#4A5B73]">
                  <div>{run.tokensUsed.toLocaleString()} tokens</div>
                  <div className="text-[#16803C] text-[10px] font-bold">${run.estimatedCost.toFixed(3)}</div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/runs/${run.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EAF2FA] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-[#0B5497] font-semibold text-[11px] transition-all shadow-sm"
                  >
                    Inspect <ArrowRight className="w-3 h-3 text-[#0B5497]" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
