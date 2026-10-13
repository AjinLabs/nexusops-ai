'use client';

import React from 'react';
import {
  Activity,
  Cpu,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ObservabilityPage() {
  const latencyData = [
    { step: 'Ingestion & Webhook', p50: 120, p95: 280, p99: 450 },
    { step: 'Schema Extractor', p50: 840, p95: 1420, p99: 2100 },
    { step: 'RAG Vector Search', p50: 340, p95: 680, p99: 980 },
    { step: 'Analyst Reasoning', p50: 620, p95: 1100, p99: 1650 },
    { step: 'Reviewer Guardrail', p50: 450, p95: 890, p99: 1350 },
    { step: 'Tool Execution', p50: 210, p95: 420, p99: 720 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Observability & Performance Traces
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              OPENTELEMETRY TRACING
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Real-time step latencies, token consumption telemetry, and error redactions.
          </p>
        </div>
      </div>

      {/* Latency Percentiles Chart */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0E1E38]">Latency Percentiles by Execution Step (ms)</h2>
            <p className="text-xs text-[#4A5B73]">
              p50 (median), p95, and p99 duration across all active production agents
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#0B5497]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B5497]" /> p50
            </span>
            <span className="flex items-center gap-1 text-[#4082BD]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4082BD]" /> p95
            </span>
            <span className="flex items-center gap-1 text-[#A0C2E6]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A0C2E6]" /> p99
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" vertical={false} />
              <XAxis dataKey="step" stroke="#7E8FA4" fontSize={11} tickLine={false} />
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
              <Bar dataKey="p50" fill="#0B5497" radius={[4, 4, 0, 0]} />
              <Bar dataKey="p95" fill="#4082BD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="p99" fill="#A0C2E6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
          <span className="text-[10px] text-[#7E8FA4] font-mono">AVG PIPELINE DURATION</span>
          <div className="text-xl font-bold text-[#0E1E38] mt-1 font-mono">1.82s</div>
          <p className="text-[11px] text-[#16803C] mt-1 font-medium">✓ 42% faster than SLA target (3.0s)</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
          <span className="text-[10px] text-[#7E8FA4] font-mono">TOKEN EFFICIENCY RATIO</span>
          <div className="text-xl font-bold text-[#0B5497] mt-1 font-mono">94.8%</div>
          <p className="text-[11px] text-[#4A5B73] mt-1">Context compression active</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
          <span className="text-[10px] text-[#7E8FA4] font-mono">TRACE CORRELATION HEALTH</span>
          <div className="text-xl font-bold text-[#16803C] mt-1 font-mono">100%</div>
          <p className="text-[11px] text-[#4A5B73] mt-1">Zero orphaned executions</p>
        </div>
      </div>
    </div>
  );
}
