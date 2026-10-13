'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  Search,
  BarChart3,
  FileSpreadsheet,
  Terminal,
  ShieldAlert,
  Lock,
  Code2,
  Network,
  FileText,
  CheckCircle2,
  Sliders,
  DollarSign,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Agent, AgentRoleType } from '@/types';

export default function AgentRegistryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => {
        if (data.agents) setAgents(data.agents);
      });
  }, []);

  const getRoleIcon = (role: AgentRoleType) => {
    switch (role) {
      case 'planner':
        return BrainCircuit;
      case 'researcher':
        return Search;
      case 'analyst':
        return BarChart3;
      case 'extractor':
        return FileSpreadsheet;
      case 'executor':
        return Terminal;
      case 'reviewer':
        return ShieldAlert;
      case 'compliance':
        return Lock;
      case 'coder':
        return Code2;
      case 'builder':
        return Network;
      case 'reporter':
        return FileText;
      default:
        return Bot;
    }
  };

  const filtered = agents.filter((a) => {
    const matchesRole = selectedRole === 'all' || a.role === selectedRole;
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">AI Teammates & Agents</h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              10 SPECIALIZED AGENTS
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Central repository of autonomous workers with model parameter guardrails, approved toolsets, and evaluation scores.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7E8FA4] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search agents by name, role, or prompt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#4A5B73]">
          <span>TOTAL RUNS: 24,000+</span>
          <span>•</span>
          <span className="text-[#16803C] font-semibold">AVG EVAL PASS: 98.6%</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((agent) => {
          const Icon = getRoleIcon(agent.role);
          return (
            <div
              key={agent.id}
              className="rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 p-5 flex flex-col justify-between transition-all group shadow-human hover:shadow-human-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/15">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
                        {agent.role}
                      </span>
                      <h3 className="text-sm font-bold text-[#0E1E38] group-hover:text-[#0B5497] transition-colors">
                        {agent.name}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-semibold">
                    {agent.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-[#4A5B73] mt-3 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>

                {/* Model and Gateway info */}
                <div className="mt-4 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[11px] font-mono flex items-center justify-between text-[#4A5B73]">
                  <div>
                    Provider: <span className="text-[#0E1E38] font-semibold">{agent.modelProvider.toUpperCase()}</span>
                  </div>
                  <div className="text-[#0B5497] truncate max-w-[120px] font-medium">{agent.modelName}</div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E3D8] space-y-3">
                {/* Telemetry metrics */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-[#FAF8F3] text-center border border-[#E8E3D8]">
                    <div className="text-[#7E8FA4] text-[10px]">EVAL SCORE</div>
                    <div className="font-bold text-[#16803C]">{agent.evalScore}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F3] text-center border border-[#E8E3D8]">
                    <div className="text-[#7E8FA4] text-[10px]">RUNS</div>
                    <div className="font-bold text-[#0E1E38]">{agent.totalRuns}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F3] text-center border border-[#E8E3D8]">
                    <div className="text-[#7E8FA4] text-[10px]">TOOLS</div>
                    <div className="font-bold text-[#0B5497]">{agent.approvedTools?.length || 0}</div>
                  </div>
                </div>

                {/* Inspect Link */}
                <Link
                  href={`/agents/${agent.id}`}
                  className="w-full py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Configure Agent Parameters <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
