'use client';

import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_SCHEDULES } from '@/server/db/mock-seed';
import { ScheduleItem } from '@/types';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleTriggerNow = (s: ScheduleItem) => {
    setTriggeringId(s.id);
    setTimeout(() => {
      setTriggeringId(null);
      setFeedback(`✓ Dispatched manual run for "${s.workflowName}"`);
      setTimeout(() => setFeedback(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Schedules & Event Triggers
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              DURABLE CRON RUNNER
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Database-backed recurrence engines with timezone alignments, misfire recovery, and duplicate-trigger deduplication.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-human hover:shadow-human-lg"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#0E1E38]">{sch.workflowName}</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                    sch.isActive
                      ? 'bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20'
                      : 'bg-[#FAF8F3] text-[#7E8FA4] border border-[#E8E3D8]'
                  }`}
                >
                  {sch.isActive ? 'ACTIVE' : 'PAUSED'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF2FA] text-[10px] text-[#0B5497] font-mono border border-[#0B5497]/20">
                  {sch.cronExpression}
                </span>
              </div>
              <p className="text-xs text-[#4A5B73]">{sch.humanSchedule}</p>
              <div className="text-[11px] text-[#7E8FA4] font-mono pt-1">
                Next Scheduled Run: <span className="text-[#0E1E38] font-medium">{new Date(sch.nextRun).toLocaleString()} ({sch.timezone})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => handleTriggerNow(sch)}
                disabled={triggeringId === sch.id}
                className="px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current text-white" />
                {triggeringId === sch.id ? 'Dispatching...' : 'Trigger Now'}
              </button>
              <button
                onClick={() => toggleActive(sch.id)}
                className="px-3.5 py-2 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-[#4A5B73] hover:text-[#0B5497] text-xs font-medium transition-all shadow-sm"
              >
                {sch.isActive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
