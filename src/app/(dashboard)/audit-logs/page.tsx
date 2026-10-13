'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Download,
  Filter,
} from 'lucide-react';
import { AuditLog } from '@/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
      });
  }, []);

  const filtered = logs.filter((l) => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      l.resourceName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Enterprise Audit Trail
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              APPEND-ONLY IMMUTABLE LOG
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Tamper-evident operational record of all workflow publications, approvals, tool invocations, and role modifications.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[#7E8FA4] absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#4A5B73]">
          <span>RECORD COUNT: {filtered.length}</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-white border border-[#E8E3D8] overflow-hidden shadow-human">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E8E3D8] bg-[#FAF8F3] text-[#7E8FA4] text-[11px] uppercase font-semibold">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action Event</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Resource Target</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Correlation ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3D8] font-mono text-[11px]">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-[#FAF8F3] transition-colors">
                <td className="py-3.5 px-4 text-[#4A5B73]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0E1E38]">{log.action}</td>
                <td className="py-3.5 px-4 text-[#0B5497]">
                  {log.actor.name} ({log.actor.role})
                </td>
                <td className="py-3.5 px-4 text-[#4A5B73]">{log.resourceName}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.status === 'success'
                        ? 'bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20'
                        : 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#7E8FA4]">{log.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
