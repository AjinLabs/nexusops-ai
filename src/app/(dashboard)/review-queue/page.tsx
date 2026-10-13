'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Edit3,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { INITIAL_HUMAN_REVIEWS } from '@/server/db/mock-seed';
import { HumanReviewItem } from '@/types';

export default function HumanReviewQueuePage() {
  const [items, setItems] = useState<HumanReviewItem[]>(INITIAL_HUMAN_REVIEWS);
  const [selectedItem, setSelectedItem] = useState<HumanReviewItem | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleResolve = (id: string, action: 'approved' | 'rejected') => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedItem(null);
    setFeedback(`✓ Review record ${id} has been marked as ${action.toUpperCase()}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Human Review Queue
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25 font-mono">
              {items.length} PENDING REVIEW
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Review edge-case extractions and low-confidence drafts where automated threshold confidence falls below 90%.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Review Queue Items */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E8E3D8] text-center text-xs text-[#4A5B73] shadow-human">
            ✓ All low-confidence AI suggestions have been reviewed and resolved.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all space-y-4 shadow-human hover:shadow-human-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8E3D8] gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0B5497]">{item.id}</span>
                  <span className="text-xs text-[#4A5B73]">in {item.workflowName}</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25">
                    CONFIDENCE: {((item.confidenceScore || 0.8) * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="text-[11px] text-[#7E8FA4]">Assigned to: {item.assignedTo}</span>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]">
                  <span className="text-[10px] text-[#7E8FA4] uppercase font-bold block mb-1.5">
                    Original Input Context
                  </span>
                  <pre className="text-[#4A5B73] whitespace-pre-wrap">
                    {JSON.stringify(item.inputContext, null, 2)}
                  </pre>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#0B5497]/25">
                  <span className="text-[10px] text-[#0B5497] uppercase font-bold block mb-1.5">
                    AI-Generated Draft Suggestion
                  </span>
                  <pre className="text-[#16803C] whitespace-pre-wrap">
                    {JSON.stringify(item.aiGeneratedDraft, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E3D8] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleResolve(item.id, 'rejected')}
                  className="px-4 py-2 rounded-full bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold transition-all flex items-center gap-1 shadow-sm"
                >
                  <X className="w-3.5 h-3.5 text-[#C53030]" /> Reject Draft
                </button>
                <button
                  onClick={() => handleResolve(item.id, 'approved')}
                  className="px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Accept Suggestion
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
