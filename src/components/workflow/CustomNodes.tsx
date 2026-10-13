'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Zap,
  Bot,
  GitBranch,
  Database,
  Plug,
  Send,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { WorkflowNodeData } from '@/types';

interface NodeProps {
  data: WorkflowNodeData;
  selected?: boolean;
}

export function TriggerNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`min-w-[210px] rounded-2xl bg-[#FFFFFF] border p-3.5 shadow-human transition-all ${
        selected
          ? 'border-[#0B5497] ring-2 ring-[#0B5497]/30 shadow-human-lg'
          : 'border-[#E8E3D8] hover:border-[#0B5497]/40'
      }`}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3D8]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
              TRIGGER
            </span>
            <div className="text-xs font-bold text-[#0E1E38]">{data.label}</div>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-[#57687C] leading-relaxed">{data.description}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
    </div>
  );
}

export function AINode({ data, selected }: NodeProps) {
  const getStatusBadge = () => {
    if (data.status === 'running') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#EAF2FA] text-[#0B5497] animate-pulse flex items-center gap-1 border border-[#0B5497]/20">
          <Clock className="w-2.5 h-2.5" /> RUNNING
        </span>
      );
    }
    if (data.status === 'completed') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#EBF8F0] text-[#16803C] flex items-center gap-1 border border-[#16803C]/20">
          <CheckCircle2 className="w-2.5 h-2.5" /> DONE
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`min-w-[230px] rounded-2xl bg-[#FFFFFF] border p-3.5 shadow-human transition-all ${
        selected
          ? 'border-[#0B5497] ring-2 ring-[#0B5497]/30 shadow-human-lg'
          : 'border-[#E8E3D8] hover:border-[#0B5497]/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3D8]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
              AI AGENT
            </span>
            <div className="text-xs font-bold text-[#0E1E38]">{data.label}</div>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      <p className="text-[11px] text-[#57687C] leading-relaxed">{data.description}</p>
      {data.config?.agentId && (
        <div className="mt-2 text-[10px] text-[#7E8FA4] font-mono truncate">
          Agent: <span className="text-[#0B5497] font-semibold">{data.config.agentId}</span>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
    </div>
  );
}

export function LogicNode({ data, selected }: NodeProps) {
  const isApprovalGate = data.subType === 'approval_gate' || data.requiresApproval;

  return (
    <div
      className={`min-w-[230px] rounded-2xl bg-[#FFFFFF] border p-3.5 shadow-human transition-all ${
        isApprovalGate
          ? 'border-[#C53030]/60 ring-1 ring-[#C53030]/30'
          : selected
          ? 'border-[#0B5497] ring-2 ring-[#0B5497]/30'
          : 'border-[#E8E3D8] hover:border-[#0B5497]/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E3D8]">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-xl ${
              isApprovalGate
                ? 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/30'
                : 'bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20'
            }`}
          >
            {isApprovalGate ? <ShieldAlert className="w-4 h-4" /> : <GitBranch className="w-4 h-4" />}
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                isApprovalGate ? 'text-[#C53030]' : 'text-[#0B5497]'
              }`}
            >
              {isApprovalGate ? 'APPROVAL GATE' : 'LOGIC BRANCH'}
            </span>
            <div className="text-xs font-bold text-[#0E1E38]">{data.label}</div>
          </div>
        </div>
        {data.status === 'waiting_approval' && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/30 animate-pulse">
            PAUSED
          </span>
        )}
      </div>
      <p className="text-[11px] text-[#57687C] leading-relaxed">{data.description}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
    </div>
  );
}

export function DataNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`min-w-[210px] rounded-2xl bg-[#FFFFFF] border p-3.5 shadow-human transition-all ${
        selected
          ? 'border-[#16803C] ring-2 ring-[#16803C]/30'
          : 'border-[#E8E3D8] hover:border-[#16803C]/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-[#16803C] border-2 border-[#FFFEF9]"
      />
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#E8E3D8]">
        <div className="p-1.5 rounded-xl bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20">
          <Database className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16803C] font-mono">
            DATA / WAREHOUSE
          </span>
          <div className="text-xs font-bold text-[#0E1E38]">{data.label}</div>
        </div>
      </div>
      <p className="text-[11px] text-[#57687C] leading-relaxed">{data.description}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
    </div>
  );
}

export function IntegrationNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`min-w-[210px] rounded-2xl bg-[#FFFFFF] border p-3.5 shadow-human transition-all ${
        selected
          ? 'border-[#0B5497] ring-2 ring-[#0B5497]/30'
          : 'border-[#E8E3D8] hover:border-[#0B5497]/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#E8E3D8]">
        <div className="p-1.5 rounded-xl bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
          <Plug className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
            TOOL / INTEGRATION
          </span>
          <div className="text-xs font-bold text-[#0E1E38]">{data.label}</div>
        </div>
      </div>
      <p className="text-[11px] text-[#57687C] leading-relaxed">{data.description}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
    </div>
  );
}

export function OutputNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`min-w-[210px] rounded-2xl bg-[#FFFFFF] border p-3.5 shadow-human transition-all ${
        selected
          ? 'border-[#0B5497] ring-2 ring-[#0B5497]/30'
          : 'border-[#E8E3D8] hover:border-[#0B5497]/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-[#0B5497] border-2 border-[#FFFEF9]"
      />
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#E8E3D8]">
        <div className="p-1.5 rounded-xl bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
          <Send className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
            OUTPUT / DISPATCH
          </span>
          <div className="text-xs font-bold text-[#0E1E38]">{data.label}</div>
        </div>
      </div>
      <p className="text-[11px] text-[#57687C] leading-relaxed">{data.description}</p>
    </div>
  );
}

export const nodeTypes = {
  triggerNode: TriggerNode,
  aiNode: AINode,
  logicNode: LogicNode,
  dataNode: DataNode,
  integrationNode: IntegrationNode,
  outputNode: OutputNode,
};
