'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  PieChart as PieIcon,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CostIntelligencePage() {
  const [budgetLimit, setBudgetLimit] = useState(25000);
  const [currentSpend] = useState(1482.4);
  const [hardStop, setHardStop] = useState(true);

  const dailySpendData = [
    { day: 'Mon, Oct 07', spend: 182 },
    { day: 'Tue, Oct 08', spend: 215 },
    { day: 'Wed, Oct 09', spend: 248 },
    { day: 'Thu, Oct 10', spend: 270 },
    { day: 'Fri, Oct 11', spend: 310 },
    { day: 'Sat, Oct 12', spend: 290 },
    { day: 'Sun, Oct 13', spend: 198 },
  ];

  const workflowCosts = [
    { name: 'AP Invoice Extraction & 2-Way Match', runs: 842, cost: 70.72, avg: 0.084 },
    { name: 'Customer Support SLA Triage', runs: 2450, cost: 93.1, avg: 0.038 },
    { name: 'SecOps Incident Auto-Containment', runs: 88, cost: 10.56, avg: 0.12 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Cost Intelligence & Budget Control
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-mono">
              BUDGET HEALTH: PEACEFUL & SAFE
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Real-time multi-provider model spend tracking, automated hard stops, and cost-per-execution breakdowns.
          </p>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-2 shadow-human">
          <span className="text-[11px] text-[#4A5B73] font-mono uppercase font-semibold">
            Current Spend (MTD)
          </span>
          <div className="text-3xl font-bold text-[#0E1E38] font-mono">
            ${currentSpend.toFixed(2)}
          </div>
          <p className="text-xs text-[#4A5B73]">
            Across 10 registered autonomous agents
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-2 shadow-human">
          <span className="text-[11px] text-[#4A5B73] font-mono uppercase font-semibold">
            Monthly Organization Cap
          </span>
          <div className="text-3xl font-bold text-[#0B5497] font-mono">
            ${budgetLimit.toLocaleString()}
          </div>
          <p className="text-xs text-[#16803C] font-semibold">
            {((currentSpend / budgetLimit) * 100).toFixed(1)}% consumed (Well within bounds)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-2 shadow-human">
          <span className="text-[11px] text-[#4A5B73] font-mono uppercase font-semibold">
            Enforcement Policy
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-3 py-1 rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-semibold text-xs">
              HARD CAP ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#4A5B73]">
            Blocks non-emergency model calls if threshold reached
          </p>
        </div>
      </div>

      {/* Daily Spend Trend Chart */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0E1E38]">Daily Model Gateway Spend ($ USD)</h2>
            <p className="text-xs text-[#4A5B73]">Aggregate tokens billed across OpenAI, Anthropic, and Gemini</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySpendData}>
              <defs>
                <linearGradient id="colorSpendOcean" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B5497" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0B5497" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" vertical={false} />
              <XAxis dataKey="day" stroke="#7E8FA4" fontSize={11} tickLine={false} />
              <YAxis stroke="#7E8FA4" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(val: any) => [`$${val}`, 'Daily Spend']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E8E3D8',
                  borderRadius: '12px',
                  color: '#0E1E38',
                  fontSize: '12px',
                  boxShadow: '0 4px 20px rgba(11,84,151,0.08)',
                }}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#0B5497"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSpendOcean)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spend per Workflow Table */}
      <div className="rounded-2xl bg-white border border-[#E8E3D8] overflow-hidden shadow-human">
        <div className="p-4 border-b border-[#E8E3D8] bg-[#FAF8F3] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider">
            Cost Allocation by Business Workflow
          </h2>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E8E3D8] text-[#7E8FA4] text-[11px] uppercase font-semibold">
              <th className="py-3 px-4">Workflow Name</th>
              <th className="py-3 px-4">Completed Runs</th>
              <th className="py-3 px-4">Avg Cost / Run</th>
              <th className="py-3 px-4 text-right">Total Incurred</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3D8]">
            {workflowCosts.map((wf, idx) => (
              <tr key={idx} className="hover:bg-[#FAF8F3] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#0E1E38]">{wf.name}</td>
                <td className="py-3.5 px-4 font-mono text-[#4A5B73]">{wf.runs}</td>
                <td className="py-3.5 px-4 font-mono text-[#0B5497]">${wf.avg.toFixed(3)}</td>
                <td className="py-3.5 px-4 font-mono text-[#16803C] font-bold text-right">
                  ${wf.cost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
