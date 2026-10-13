'use client';

import React, { useState } from 'react';
import {
  Wrench,
  ShieldAlert,
  Search,
  Code2,
  Clock,
  CheckCircle2,
  Lock,
  Filter,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_TOOLS } from '@/server/db/mock-seed';
import { ToolDefinition, RiskTier } from '@/types';

export default function ToolRegistryPage() {
  const [tools] = useState<ToolDefinition[]>(INITIAL_TOOLS);
  const [search] = useState('');
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Tool Registry & Safe Execution Contracts
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              {tools.length} REGISTERED TOOLS
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Registered tool interfaces with typed JSON schemas, risk tiering, rate limits, and mandatory human sign-off flags.
          </p>
        </div>
      </div>

      {/* Tools List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tool) => {
          const isCritical = tool.riskLevel === 'critical';
          const isHigh = tool.riskLevel === 'high';
          return (
            <div
              key={tool.id}
              className="rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 p-5 flex flex-col justify-between transition-all shadow-human hover:shadow-human-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono text-[#0B5497] uppercase">
                    {tool.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase ${
                      isCritical
                        ? 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                        : isHigh
                        ? 'bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25'
                        : 'bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20'
                    }`}
                  >
                    {tool.riskLevel} RISK
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0E1E38] mt-3 font-mono">
                  {tool.slug}
                </h3>
                <div className="text-xs font-semibold text-[#4A5B73] mt-0.5">{tool.name}</div>
                <p className="text-xs text-[#4A5B73] mt-2 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                {/* Constraints */}
                <div className="mt-4 pt-3 border-t border-[#E8E3D8] space-y-1.5 text-[11px] font-mono text-[#4A5B73]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7E8FA4]">Timeout:</span>
                    <span className="text-[#0E1E38] font-semibold">{tool.timeoutMs / 1000}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7E8FA4]">Rate Limit:</span>
                    <span className="text-[#0E1E38] font-semibold">{tool.rateLimitPerMin} req/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7E8FA4]">Approval Gate:</span>
                    <span className={tool.requiresApproval ? 'text-[#C53030] font-bold' : 'text-[#16803C] font-semibold'}>
                      {tool.requiresApproval ? 'HUMAN REQUIRED' : 'AUTO-PERMITTED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E3D8] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#7E8FA4] truncate max-w-[150px]">
                  Roles: {tool.allowedAgentRoles?.join(', ')}
                </span>
                <button
                  onClick={() => setSelectedTool(tool)}
                  className="px-3.5 py-1.5 rounded-full bg-[#FAF8F3] hover:bg-[#EAF2FA] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-[#0B5497] font-semibold text-[11px] transition-all shadow-sm"
                >
                  Inspect Schema
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schema Inspection Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E8E3D8] p-6 shadow-human-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8]">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#0B5497] uppercase">
                  TOOL CONTRACT SPECIFICATION
                </span>
                <h3 className="text-sm font-bold text-[#0E1E38] mt-0.5 font-mono">
                  {selectedTool.slug}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-[#7E8FA4] hover:text-[#0E1E38]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#7E8FA4] font-semibold uppercase text-[10px]">Side Effect:</span>
                <p className="text-xs text-[#0E1E38] mt-1">{selectedTool.sideEffectDescription}</p>
              </div>

              <div>
                <span className="text-[#7E8FA4] font-semibold uppercase text-[10px]">Input Schema:</span>
                <pre className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#0B5497] font-mono text-[11px] mt-1 overflow-auto max-h-32">
                  {JSON.stringify(selectedTool.inputSchema, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-[#7E8FA4] font-semibold uppercase text-[10px]">Output Schema:</span>
                <pre className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#16803C] font-mono text-[11px] mt-1 overflow-auto max-h-32">
                  {JSON.stringify(selectedTool.outputSchema, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E3D8] flex justify-end">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-xs font-semibold text-white shadow-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
