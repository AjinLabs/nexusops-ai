'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldAlert,
  PlayCircle,
  FileCode,
  DollarSign,
  Activity,
  ArrowRight,
  Zap,
  Loader2,
} from 'lucide-react';
import { INITIAL_WORKFLOW_RUNS } from '@/server/db/mock-seed';

function RunTraceDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const run =
    INITIAL_WORKFLOW_RUNS.find((r) => r.id === id) || INITIAL_WORKFLOW_RUNS[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* Back link */}
      <Link
        href="/runs"
        className="inline-flex items-center gap-1.5 text-xs text-[#4A5B73] hover:text-[#0B5497] transition-colors font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Runs Overview
      </Link>

      {/* Run Header */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-human">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#0B5497]">{run.id}</span>
            <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20">
              {run.mode.toUpperCase()} MODE
            </span>
            {run.status === 'waiting_approval' && (
              <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25 animate-pulse font-bold">
                AWAITING GOVERNANCE SIGN-OFF
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-[#0E1E38] mt-1.5">{run.workflowName}</h1>
          <p className="text-xs text-[#4A5B73] mt-0.5">
            Trigger: {run.triggerSource} • Initiated by: {run.initiatedBy}
          </p>
        </div>

        {run.status === 'waiting_approval' && (
          <Link
            href="/approvals"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <ShieldAlert className="w-4 h-4" /> Open Approval Decision
          </Link>
        )}
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-xl bg-white border border-[#E8E3D8] shadow-sm">
          <span className="text-[10px] text-[#7E8FA4]">START TIME</span>
          <div className="text-sm font-bold text-[#0E1E38] mt-1">
            {new Date(run.startTime).toLocaleTimeString()}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E8E3D8] shadow-sm">
          <span className="text-[10px] text-[#7E8FA4]">DURATION</span>
          <div className="text-sm font-bold text-[#0B5497] mt-1">
            {run.durationMs ? `${(run.durationMs / 1000).toFixed(2)}s` : 'Paused at Gate'}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E8E3D8] shadow-sm">
          <span className="text-[10px] text-[#7E8FA4]">TOTAL TOKENS</span>
          <div className="text-sm font-bold text-[#0B5497] mt-1">
            {run.tokensUsed.toLocaleString()}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E8E3D8] shadow-sm">
          <span className="text-[10px] text-[#7E8FA4]">ESTIMATED COST</span>
          <div className="text-sm font-bold text-[#16803C] mt-1">
            ${run.estimatedCost.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Node-by-Node Execution Step Timeline */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider">
          Node-Level Execution Timeline & Payloads
        </h2>

        <div className="space-y-3">
          {run.nodeRuns.map((nr, idx) => (
            <div
              key={nr.id}
              className={`p-4 rounded-xl border transition-all ${
                nr.status === 'waiting_approval'
                  ? 'bg-white border-[#C53030]/60 shadow-human'
                  : 'bg-white border-[#E8E3D8] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3D8]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF2FA] border border-[#0B5497]/20 text-[11px] font-mono font-bold text-[#0B5497] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#0E1E38] flex items-center gap-2">
                      {nr.nodeLabel}
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#FAF8F3] text-[#4A5B73] font-mono border border-[#E8E3D8]">
                        {nr.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {nr.durationMs && (
                    <span className="text-[11px] font-mono text-[#7E8FA4]">
                      {nr.durationMs}ms
                    </span>
                  )}
                  {nr.status === 'completed' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#16803C]" /> COMPLETED
                    </span>
                  )}
                  {nr.status === 'waiting_approval' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25 flex items-center gap-1 animate-pulse">
                      <ShieldAlert className="w-3 h-3 text-[#C53030]" /> AWAITING SIGN-OFF
                    </span>
                  )}
                  {nr.status === 'pending' && (
                    <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#FAF8F3] text-[#7E8FA4] border border-[#E8E3D8]">
                      PENDING
                    </span>
                  )}
                </div>
              </div>

              {/* Payload Inspection Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                {nr.inputPayload && (
                  <div>
                    <span className="text-[10px] text-[#7E8FA4] uppercase font-bold">Input Payload</span>
                    <pre className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#4A5B73] mt-1 overflow-x-auto max-h-36">
                      {JSON.stringify(nr.inputPayload, null, 2)}
                    </pre>
                  </div>
                )}
                {nr.outputPayload && (
                  <div>
                    <span className="text-[10px] text-[#7E8FA4] uppercase font-bold">Output Payload</span>
                    <pre className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#16803C] mt-1 overflow-x-auto max-h-36">
                      {JSON.stringify(nr.outputPayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RunTraceDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-xs text-[#4A5B73] gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#0B5497]" />
          <span>Loading execution trace...</span>
        </div>
      }
    >
      <RunTraceDetailContent />
    </Suspense>
  );
}
