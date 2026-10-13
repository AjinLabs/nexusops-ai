'use client';

import React from 'react';
import {
  X,
  ShieldAlert,
  Bot,
  Wrench,
  Clock,
  Layers,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { WorkflowNode, RiskTier } from '@/types';
import { INITIAL_AGENTS } from '@/server/db/mock-seed';

interface NodeInspectorProps {
  selectedNode: WorkflowNode | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode['data']>) => void;
}

export function NodeInspector({
  selectedNode,
  onClose,
  onUpdateNode,
}: NodeInspectorProps) {
  if (!selectedNode) return null;

  const { data } = selectedNode;

  return (
    <aside className="w-80 h-full border-l border-[#E8E3D8] bg-[#FFFFFF] p-4 flex flex-col justify-between overflow-y-auto select-none shadow-human z-30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
              INSPECTOR: {selectedNode.id}
            </span>
            <h3 className="text-sm font-bold text-[#0E1E38] truncate">{data.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7E8FA4] hover:text-[#0E1E38] hover:bg-[#FAF8F3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Basic Fields */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-[#4A5B73] uppercase">Node Label</label>
            <input
              type="text"
              value={data.label}
              onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#0E1E38] focus:border-[#0B5497] focus:ring-1 focus:ring-[#0B5497] focus:outline-none text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4A5B73] uppercase">Description</label>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => onUpdateNode(selectedNode.id, { description: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#0E1E38] focus:border-[#0B5497] focus:ring-1 focus:ring-[#0B5497] focus:outline-none text-xs"
            />
          </div>

          {/* AI Specific Config */}
          {data.category === 'ai' && (
            <div>
              <label className="text-[11px] font-semibold text-[#4A5B73] uppercase flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-[#0B5497]" />
                Assigned Agent
              </label>
              <select
                value={data.config?.agentId || 'agent_planner'}
                onChange={(e) =>
                  onUpdateNode(selectedNode.id, {
                    config: { ...data.config, agentId: e.target.value },
                  })
                }
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#0E1E38] focus:border-[#0B5497] focus:ring-1 focus:ring-[#0B5497] focus:outline-none text-xs"
              >
                {INITIAL_AGENTS.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.role.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Risk Classification */}
          <div>
            <label className="text-[11px] font-semibold text-[#4A5B73] uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
              Risk Classification
            </label>
            <select
              value={data.riskLevel || 'low'}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, { riskLevel: e.target.value as RiskTier })
              }
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#0E1E38] focus:border-[#0B5497] focus:ring-1 focus:ring-[#0B5497] focus:outline-none text-xs font-semibold"
            >
              <option value="low">Low Risk (Read-only)</option>
              <option value="medium">Medium Risk (Internal updates)</option>
              <option value="high">High Risk (External communications)</option>
              <option value="critical">Critical Risk (Financial / IAM actions)</option>
            </select>
          </div>

          {/* Requires Human Approval Gate */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]">
            <div>
              <div className="font-semibold text-[#0E1E38]">Governance Sign-off</div>
              <div className="text-[10px] text-[#7E8FA4]">Pause workflow for human sign-off</div>
            </div>
            <input
              type="checkbox"
              checked={data.requiresApproval || data.subType === 'approval_gate'}
              onChange={(e) =>
                onUpdateNode(selectedNode.id, { requiresApproval: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#0B5497] focus:ring-[#0B5497] bg-white border-[#E8E3D8]"
            />
          </div>

          {/* Execution Telemetry if run */}
          {data.status && data.status !== 'idle' && (
            <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] space-y-1.5">
              <div className="text-[11px] font-bold text-[#0E1E38] flex items-center justify-between">
                <span>Latest Node Output</span>
                <span className="font-mono text-[10px] uppercase text-[#0B5497] font-semibold">
                  {data.status}
                </span>
              </div>
              <pre className="text-[10px] font-mono text-[#4A5B73] bg-[#FFFFFF] border border-[#E8E3D8] p-2.5 rounded-lg max-h-36 overflow-auto">
                {JSON.stringify(data.executionOutput || { status: data.status }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[#E8E3D8] text-[10px] text-[#7E8FA4] flex items-center justify-between font-mono">
        <span>Category: {data.category.toUpperCase()}</span>
        <span>Standard: HUMAN-GOVERNED</span>
      </div>
    </aside>
  );
}
