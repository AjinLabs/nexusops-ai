'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Workflow as WorkflowIcon,
  Plus,
  Play,
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Workflow, RiskTier } from '@/types';

export default function WorkflowsListPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [runningId, setRunningId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/workflows')
      .then((res) => res.json())
      .then((data) => {
        if (data.workflows) setWorkflows(data.workflows);
      });
  }, []);

  const triggerRun = async (id: string) => {
    setRunningId(id);
    try {
      const res = await fetch(`/api/workflows/${id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'production', triggerSource: 'manual' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Workflow initiated successfully! Run ID: ${data.run.id} (${data.run.status})`);
      }
    } catch (err) {
      alert('Failed triggering execution');
    } finally {
      setRunningId(null);
    }
  };

  const categories = ['all', 'finance', 'support', 'engineering', 'hr', 'sales'];

  const filtered = workflows.filter((w) => {
    const matchesCategory = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">Workflow Studio</h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              {workflows.length} REGISTERED
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Build, test, govern, and deploy autonomous multi-agent pipelines with visual DAG tracing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/workflows/generator"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-[#0B5497] text-xs font-semibold transition-all group shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0B5497] group-hover:scale-110 transition-transform" />
            Natural-Language Synthesizer
          </Link>

          <Link
            href="/workflows/studio/wf_invoice_proc"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B5497] text-white hover:bg-[#08447A] text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Workflow
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E3D8] shadow-human">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7E8FA4] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search workflows by name or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0B5497] text-white font-semibold shadow-sm'
                  : 'text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#FAF8F3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workflows List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((wf) => {
          const isCritical = wf.riskClassification === 'critical';
          return (
            <div
              key={wf.id}
              className="rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/40 p-5 flex flex-col justify-between transition-all group shadow-human hover:shadow-human-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
                    {wf.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full font-mono ${
                        isCritical
                          ? 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                          : 'bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25'
                      }`}
                    >
                      {wf.riskClassification} RISK
                    </span>
                    <span className="text-[10px] font-mono text-[#7E8FA4]">v{wf.version}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#0E1E38] mt-3 group-hover:text-[#0B5497] transition-colors leading-snug">
                  {wf.name}
                </h3>
                <p className="text-xs text-[#4A5B73] mt-1.5 line-clamp-2 leading-relaxed">
                  {wf.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E3D8] space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-[#FAF8F3] text-center border border-[#E8E3D8]">
                    <div className="text-[#7E8FA4] text-[10px]">RUNS</div>
                    <div className="font-bold text-[#0E1E38]">{wf.runCount}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F3] text-center border border-[#E8E3D8]">
                    <div className="text-[#7E8FA4] text-[10px]">SUCCESS</div>
                    <div className="font-bold text-[#16803C]">{wf.successRate}%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F3] text-center border border-[#E8E3D8]">
                    <div className="text-[#7E8FA4] text-[10px]">NODES</div>
                    <div className="font-bold text-[#0B5497]">{wf.nodes?.length || 5}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/workflows/studio/${wf.id}`}
                    className="flex-1 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <WorkflowIcon className="w-3.5 h-3.5" />
                    Open Studio
                  </Link>

                  <button
                    onClick={() => triggerRun(wf.id)}
                    disabled={runningId === wf.id}
                    className="px-3.5 py-2 rounded-full bg-[#FAF8F3] hover:bg-[#EAF2FA] text-[#0B5497] border border-[#E8E3D8] text-xs font-semibold transition-all flex items-center gap-1 disabled:opacity-50 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    {runningId === wf.id ? 'Starting...' : 'Execute'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
