'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  Download,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  Layers,
  Sparkles,
} from 'lucide-react';
import { INITIAL_TEMPLATES } from '@/server/db/mock-seed';
import { MarketplaceTemplate } from '@/types';

export default function TemplatesMarketplacePage() {
  const router = useRouter();
  const [templates] = useState<MarketplaceTemplate[]>(INITIAL_TEMPLATES);
  const [selectedDept, setSelectedDept] = useState('all');
  const [search, setSearch] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const departments = ['all', 'Finance', 'Support', 'Engineering', 'HR', 'Sales', 'Operations'];

  const filtered = templates.filter((t) => {
    const matchesDept = selectedDept === 'all' || t.department === selectedDept;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleInstall = (template: MarketplaceTemplate) => {
    setInstallingId(template.id);
    setTimeout(() => {
      setInstallingId(null);
      // Navigate to workflows list
      router.push('/workflows');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Department Automation Packs & Marketplace
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              6 VERIFIED PACKS
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Pre-engineered enterprise workflows with tested node graphs, typed schemas, and governance policies ready for immediate installation.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#7E8FA4] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search automation templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
                selectedDept === dept
                  ? 'bg-[#0B5497] text-white font-semibold shadow-sm'
                  : 'text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#FAF8F3]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all flex flex-col justify-between space-y-4 shadow-human hover:shadow-human-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
                  {tpl.department}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase ${
                    tpl.riskTier === 'critical'
                      ? 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                      : 'bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25'
                  }`}
                >
                  {tpl.riskTier} RISK
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#0E1E38] mt-3">{tpl.title}</h3>
              <p className="text-xs text-[#4A5B73] mt-1.5 line-clamp-3 leading-relaxed">
                {tpl.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {tpl.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-[#FAF8F3] text-[10px] text-[#4A5B73] font-mono border border-[#E8E3D8]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E3D8] space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#7E8FA4] font-mono">
                <span>{tpl.nodesCount} Pre-Wired Nodes</span>
                <span>~{tpl.estimatedHoursSaved}h saved / mo</span>
              </div>

              <button
                onClick={() => handleInstall(tpl)}
                disabled={installingId === tpl.id}
                className="w-full py-2.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                {installingId === tpl.id ? 'Installing Pack...' : 'Install into Workspace'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
