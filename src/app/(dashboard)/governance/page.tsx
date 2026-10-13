'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  FileText,
  RotateCcw,
} from 'lucide-react';

export default function SecurityGovernancePage() {
  const [promptInjectionGuard, setPromptInjectionGuard] = useState(true);
  const [piiScrubber, setPiiScrubber] = useState(true);
  const [dualKeyApprovals, setDualKeyApprovals] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = () => {
    setFeedback('✓ Governance policies synchronized across active worker nodes.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Security & Governance Centre
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-mono">
              SOC2 / GDPR COMPLIANT
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Enterprise threat model defenses, model gateway allowlists, and secret rotation audits.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          Save Policy Standards
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Security Policies Grid */}
      <div className="space-y-4">
        {[
          {
            title: 'Adversarial Prompt Injection & Jailbreak Defense',
            desc: 'Detects and neutralizes prompt hijacking, delimiter bypasses, and unauthorized system prompt exfiltration attempts.',
            state: promptInjectionGuard,
            toggle: () => setPromptInjectionGuard(!promptInjectionGuard),
            status: 'STRICT DEFENSE',
          },
          {
            title: 'Automated PII & Confidential Data Redaction',
            desc: 'Automatically masks Social Security Numbers, credit card credentials, AWS keys, and confidential emails before LLM transmission.',
            state: piiScrubber,
            toggle: () => setPiiScrubber(!piiScrubber),
            status: 'ENFORCED',
          },
          {
            title: 'Dual-Key Separation of Duties for Critical Actions',
            desc: 'Prohibits the creator of an autonomous workflow from approving their own financial transfers or IAM adjustments.',
            state: dualKeyApprovals,
            toggle: () => setDualKeyApprovals(!dualKeyApprovals),
            status: 'GOVERNANCE LOCKED',
          },
        ].map((pol, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all flex items-center justify-between gap-4 shadow-human"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#0E1E38]">{pol.title}</span>
                <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20">
                  {pol.status}
                </span>
              </div>
              <p className="text-xs text-[#4A5B73] leading-relaxed max-w-2xl">{pol.desc}</p>
            </div>

            <input
              type="checkbox"
              checked={pol.state}
              onChange={pol.toggle}
              className="w-5 h-5 rounded text-[#0B5497] accent-[#0B5497] cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Secret Rotation Reminders */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-3 shadow-human">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-[#B45309]" />
          Active API Credential Lifecycles
        </h2>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] flex items-center justify-between">
            <span className="text-[#0E1E38] font-medium">OpenAI Production Key (••••••••••••9842)</span>
            <span className="text-[#16803C] font-semibold">Rotated 14 days ago (Healthy)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] flex items-center justify-between">
            <span className="text-[#0E1E38] font-medium">Slack Enterprise OAuth Secret (••••••••••••3311)</span>
            <span className="text-[#16803C] font-semibold">Rotated 31 days ago (Healthy)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
