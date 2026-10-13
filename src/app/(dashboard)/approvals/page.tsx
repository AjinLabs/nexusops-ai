'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  FileCode,
  UserCheck,
  Check,
  X,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { ApprovalRequest } from '@/types';

export default function ApprovalsCentrePage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [decisionComment, setDecisionComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      if (data.approvals) {
        setApprovals(data.approvals);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleDecision = async (decision: 'approved' | 'rejected') => {
    if (!selectedApproval) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/approvals/${selectedApproval.id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          comment: decisionComment || `Recorded by Marcus Vance (Risk/Governance)`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(
          decision === 'approved'
            ? `✓ Decision Recorded: Request ${selectedApproval.id} Approved. Downstream execution resumed!`
            : `✓ Decision Recorded: Request ${selectedApproval.id} Rejected. Side-effect aborted.`
        );
        setSelectedApproval(null);
        setDecisionComment('');
        fetchApprovals();
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (err) {
      alert('Failed recording decision');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pending = approvals.filter((a) => a.status === 'pending');
  const history = approvals.filter((a) => a.status !== 'pending');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 select-none">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Human-in-the-Loop Governance Centre
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25 font-mono">
              {pending.length} ACTION REQUIRED
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Enforce dual-party governance. Sensitive financial disbursements, IAM changes, and external messages pause here for human review.
          </p>
        </div>

        <button
          onClick={fetchApprovals}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E3D8] text-xs text-[#4A5B73] hover:text-[#0B5497] hover:border-[#0B5497]/40 transition-all shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#0B5497]" /> Refresh Queue
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Pending Approvals Queue */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#C53030]" />
          Pending Approvals Awaiting Human Sign-off ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-[#E8E3D8] text-center text-xs text-[#4A5B73] shadow-human">
            ✓ No pending approval requests. All automation pipelines are fully authorized and running peacefully.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pending.map((appr) => {
              const isCritical = appr.riskLevel === 'critical';
              return (
                <div
                  key={appr.id}
                  className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all shadow-human"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-[#E8E3D8] gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-0.5 text-[10px] font-bold uppercase rounded-full font-mono ${
                          isCritical
                            ? 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                            : 'bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/25'
                        }`}
                      >
                        {appr.riskLevel} RISK
                      </span>
                      <span className="font-mono text-xs font-bold text-[#0E1E38]">
                        {appr.id}
                      </span>
                      <span className="text-xs text-[#4A5B73]">
                        via {appr.workflowName}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-[#7E8FA4]">
                      Expires: {new Date(appr.expiresAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-bold text-[#0E1E38]">
                      Action: <span className="font-mono text-[#0B5497]">{appr.actionType}</span> on System: <span className="text-[#0E1E38]">{appr.targetSystem}</span>
                    </div>
                    <p className="text-xs text-[#4A5B73] leading-relaxed">
                      <strong className="text-[#0E1E38]">Policy Trigger:</strong> {appr.reason}
                    </p>
                    <p className="text-xs text-[#4A5B73] leading-relaxed">
                      <strong className="text-[#16803C]">Evidence Verified:</strong> {appr.supportingEvidence}
                    </p>
                  </div>

                  {/* Parameter preview */}
                  <div className="mt-3 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[11px] font-mono">
                    <span className="text-[10px] text-[#7E8FA4] uppercase font-bold block mb-1">
                      Target Action Parameters
                    </span>
                    <pre className="text-[#0B5497] max-h-28 overflow-auto">
                      {JSON.stringify(appr.parameters, null, 2)}
                    </pre>
                  </div>

                  {/* Decision Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#E8E3D8] flex items-center justify-between">
                    <span className="text-[11px] text-[#7E8FA4]">
                      Requestor: <span className="text-[#0E1E38] font-medium">{appr.requestorName}</span>
                    </span>

                    <button
                      onClick={() => setSelectedApproval(appr)}
                      className="px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" /> Review & Authorize
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E8E3D8] p-6 shadow-human-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8]">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#C53030] uppercase">
                  GOVERNANCE DECISION DIALOG
                </span>
                <h3 className="text-base font-bold text-[#0E1E38] mt-0.5">
                  {selectedApproval.actionType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="text-[#7E8FA4] hover:text-[#0E1E38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 text-[#4A5B73]">
              <div>
                Target System: <span className="text-[#0E1E38] font-semibold">{selectedApproval.targetSystem}</span>
              </div>
              <div>
                Workflow: <span className="text-[#0E1E38]">{selectedApproval.workflowName}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[11px] font-mono text-[#0B5497]">
                {JSON.stringify(selectedApproval.parameters, null, 2)}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0E1E38]">
                Governance Decision Notes (Logged to immutable audit trail):
              </label>
              <textarea
                rows={2}
                value={decisionComment}
                onChange={(e) => setDecisionComment(e.target.value)}
                placeholder="e.g. Verified matched Purchase Order PO-88219. Authorized disbursement."
                className="w-full mt-1.5 p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8E3D8]">
              <button
                onClick={() => handleDecision('rejected')}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-full bg-[#FEE2E2] hover:bg-[#FECACA] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                <XCircle className="w-4 h-4 text-[#C53030]" /> Reject & Abort
              </button>

              <button
                onClick={() => handleDecision('approved')}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Resume Execution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Approvals */}
      <div className="space-y-3 pt-6 border-t border-[#E8E3D8]">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider">
          Resolved Approvals Audit History
        </h2>

        <div className="space-y-2">
          {history.map((h) => (
            <div
              key={h.id}
              className="p-3.5 rounded-xl bg-white border border-[#E8E3D8] flex items-center justify-between text-xs shadow-human"
            >
              <div>
                <div className="font-bold text-[#0E1E38] flex items-center gap-2">
                  <span className="font-mono text-[#0B5497]">{h.id}</span>
                  <span>{h.actionType}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      h.status === 'approved'
                        ? 'bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20'
                        : 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#4A5B73] mt-1">
                  Decided by <span className="text-[#0B5497] font-semibold">{h.resolvedBy}</span>: &quot;{h.decisionComment}&quot;
                </div>
              </div>

              <span className="text-[10px] text-[#7E8FA4] font-mono">
                {new Date(h.resolvedAt || h.requestedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
