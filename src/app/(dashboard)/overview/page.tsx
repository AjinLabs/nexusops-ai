'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Workflow,
  Sparkles,
  ShieldAlert,
  PlayCircle,
  Activity,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Zap,
  ArrowRight,
  RefreshCw,
  Plus,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function OverviewPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Human-friendly operational execution data in Ocean & Ivory theme
  const executionTrendData = [
    { date: 'Mon, Oct 07', success: 184, failed: 2, waitingApproval: 4 },
    { date: 'Tue, Oct 08', success: 220, failed: 1, waitingApproval: 3 },
    { date: 'Wed, Oct 09', success: 265, failed: 4, waitingApproval: 5 },
    { date: 'Thu, Oct 10', success: 298, failed: 3, waitingApproval: 2 },
    { date: 'Fri, Oct 11', success: 340, failed: 1, waitingApproval: 6 },
    { date: 'Sat, Oct 12', success: 312, failed: 0, waitingApproval: 4 },
    { date: 'Sun, Oct 13', success: 198, failed: 0, waitingApproval: 2 },
  ];

  // Model provider spend allocation matched to Ocean #0B5497 and warm tones
  const costByProviderData = [
    { name: 'OpenAI (GPT-4o)', value: 840.2, color: '#0B5497' },
    { name: 'Anthropic (Claude 3.5)', value: 485.4, color: '#4082BD' },
    { name: 'Google (Gemini 1.5 Pro)', value: 156.8, color: '#A0C2E6' },
  ];

  const kpis = [
    {
      title: 'Active Workflows',
      value: '19',
      subtext: 'of 24 registered pipelines',
      change: '+3 handcrafted this week',
      icon: Workflow,
      href: '/workflows',
      badgeColor: 'bg-[#EAF2FA] text-[#0B5497] border-[#0B5497]/20',
    },
    {
      title: 'Successful Runs',
      value: '1,482',
      subtext: '98.6% flawless completion',
      change: '+18.4% vs last week',
      icon: CheckCircle2,
      href: '/runs',
      badgeColor: 'bg-[#EBF8F0] text-[#16803C] border-[#16803C]/20',
    },
    {
      title: 'Needs Human Review',
      value: '2',
      subtext: '1 invoice above $5,000 threshold',
      change: 'Review Needed',
      icon: ShieldAlert,
      isUrgent: true,
      href: '/approvals',
      badgeColor: 'bg-[#FEE2E2] text-[#C53030] border-[#C53030]/30',
    },
    {
      title: 'Active AI Teammates',
      value: '10',
      subtext: 'Specialized domain agents',
      change: 'All 10 healthy & online',
      icon: Sparkles,
      href: '/agents',
      badgeColor: 'bg-[#FAF8F3] text-[#0B5497] border-[#E8E3D8]',
    },
    {
      title: 'Monthly AI Budget',
      value: '$1,482.40',
      subtext: 'Monthly cap: $25,000.00',
      change: '5.9% utilized (safe)',
      icon: DollarSign,
      href: '/costs',
      badgeColor: 'bg-[#EAF2FA] text-[#0B5497] border-[#0B5497]/20',
    },
    {
      title: 'Team Hours Saved',
      value: '420 hrs',
      subtext: 'Equivalent to 2.6 full-time staff',
      change: '+$48.2k value returned',
      icon: Zap,
      href: '/observability',
      badgeColor: 'bg-[#EBF8F0] text-[#16803C] border-[#16803C]/20',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Friendly Human Greeting & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Good afternoon, Elena 👋
            </h1>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16803C] animate-pulse" />
              All systems peaceful & healthy (99.4%)
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Your AI workflows have saved the team 420 hours this month. 2 items await your friendly review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range selector in capsule style */}
          <div className="flex items-center bg-[#FAF8F3] border border-[#E8E3D8] rounded-full p-1 text-xs">
            {['24h', '7d', '30d', 'Quarter'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  timeRange === r
                    ? 'bg-[#0B5497] text-white shadow-sm font-semibold'
                    : 'text-[#4A5B73] hover:text-[#0B5497]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <Link
            href="/workflows/generator"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Craft New Workflow
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid in Warm Ivory / Clean White with Ocean Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.href}
              className="p-4 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/40 transition-all duration-200 group relative flex flex-col justify-between shadow-human hover:shadow-human-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#4A5B73] uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className="p-1.5 rounded-xl bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/15">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight text-[#0E1E38] mt-2">
                  {kpi.value}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E8E3D8] flex items-center justify-between text-[11px]">
                <span className="text-[#7E8FA4] truncate pr-1">{kpi.subtext}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${kpi.badgeColor}`}
                >
                  {kpi.change}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Execution Velocity (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-[#E8E3D8] flex flex-col justify-between shadow-human">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#0E1E38]">
                Workflow Volume & Completion Health
              </h2>
              <p className="text-xs text-[#4A5B73]">
                Daily autonomous tasks handled successfully vs governance pauses
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#0B5497] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B5497]" /> Succeeded
              </span>
              <span className="flex items-center gap-1.5 text-[#C53030] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C53030]" /> Needs Attention
              </span>
              <span className="flex items-center gap-1.5 text-[#B45309] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" /> Human Review
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executionTrendData}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B5497" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0B5497" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorApproval" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B45309" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B45309" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" vertical={false} />
                <XAxis dataKey="date" stroke="#7E8FA4" fontSize={11} tickLine={false} />
                <YAxis stroke="#7E8FA4" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
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
                  dataKey="success"
                  stroke="#0B5497"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSuccess)"
                />
                <Area
                  type="monotone"
                  dataKey="waitingApproval"
                  stroke="#B45309"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApproval)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Cost Allocation by Model Provider */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] flex flex-col justify-between shadow-human">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0E1E38]">Model Spend Distribution</h2>
              <Link href="/costs" className="text-xs text-[#0B5497] hover:underline flex items-center gap-1 font-medium">
                Cost Center <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-[#4A5B73] mt-1">
              Token consumption across authorized LLM gateways
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByProviderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costByProviderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${val.toFixed(2)}`, 'Spend']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E8E3D8',
                    borderRadius: '12px',
                    color: '#0E1E38',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px rgba(11,84,151,0.08)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E8E3D8]">
            {costByProviderData.map((prov, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#4A5B73]">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prov.color }} />
                  {prov.name}
                </span>
                <span className="font-mono font-bold text-[#0E1E38]">${prov.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: Active Governance Queue & Operational Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Governance Approvals Queue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C53030]" />
              <h2 className="text-sm font-bold text-[#0E1E38]">
                Awaiting Human Sign-off (2)
              </h2>
            </div>
            <Link
              href="/approvals"
              className="text-xs text-[#0B5497] hover:underline flex items-center gap-1 font-semibold"
            >
              Open Approvals Queue <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25">
                    HIGH VALUE
                  </span>
                  <span className="text-xs font-bold text-[#0E1E38]">
                    Disburse Vendor Payment: $14,850.00
                  </span>
                </div>
                <span className="text-[10px] text-[#7E8FA4] font-mono">appr_inv_8901</span>
              </div>
              <p className="text-xs text-[#4A5B73] mt-1.5 leading-relaxed">
                Datadog Cloud Monitoring Inc. matched PO #PO-88219. Exceeds $5k auto-settlement threshold.
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E8E3D8] text-[11px]">
                <span className="text-[#7E8FA4]">Requested by AP Autonomous Agent</span>
                <Link
                  href="/approvals"
                  className="px-3.5 py-1 rounded-full bg-[#0B5497] text-white text-[11px] font-semibold hover:bg-[#08447A] transition-all shadow-sm"
                >
                  Review & Authorize
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25">
                    SECURITY CHECK
                  </span>
                  <span className="text-xs font-bold text-[#0E1E38]">
                    Revoke Inactive Production IAM Keys
                  </span>
                </div>
                <span className="text-[10px] text-[#7E8FA4] font-mono">appr_gh_7712</span>
              </div>
              <p className="text-xs text-[#4A5B73] mt-1.5 leading-relaxed">
                Policy Sentry flagged 94 days since last active usage on developer contractor credentials.
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E8E3D8] text-[11px]">
                <span className="text-[#7E8FA4]">Requested by Governance Policy Sentry</span>
                <Link
                  href="/approvals"
                  className="px-3.5 py-1 rounded-full bg-white border border-[#E8E3D8] text-[#0B5497] text-[11px] font-semibold hover:border-[#0B5497]/40"
                >
                  Inspect Evidence
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live Operational Activity Log */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0B5497]" />
              <h2 className="text-sm font-bold text-[#0E1E38]">Recent Team & Agent Activity</h2>
            </div>
            <Link
              href="/audit-logs"
              className="text-xs text-[#0B5497] hover:underline flex items-center gap-1 font-semibold"
            >
              Full Audit Trail <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Approval Request Created',
                desc: 'Workflow "AP Invoice Extraction" staged $14,850.00 payment order',
                actor: 'Autonomous Agent',
                time: '12m ago',
                badge: 'appr_inv_8901',
              },
              {
                title: 'Workflow Execution Completed',
                desc: 'Customer Support SLA Triage successfully closed ticket #TKT-99124',
                actor: 'Zendesk Webhook',
                time: '45m ago',
                badge: 'run_991815',
              },
              {
                title: 'Integration Test Succeeded',
                desc: 'Slack Enterprise Grid verified scopes [chat:write, reactions:write]',
                actor: 'David Kim',
                time: '2h ago',
                badge: 'int_slack',
              },
              {
                title: 'New Workflow Version Published',
                desc: 'Customer Support SLA Triage promoted to immutable v2.1.0',
                actor: 'Alex Mercer',
                time: '18h ago',
                badge: 'v2.1.0',
              },
            ].map((act, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs"
              >
                <div>
                  <div className="font-semibold text-[#0E1E38]">{act.title}</div>
                  <div className="text-[11px] text-[#4A5B73] mt-0.5">{act.desc}</div>
                  <div className="text-[10px] text-[#7E8FA4] mt-1">
                    Actor: <span className="text-[#0B5497] font-medium">{act.actor}</span> • {act.time}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#0B5497] border border-[#E8E3D8] font-mono text-[10px]">
                  {act.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
