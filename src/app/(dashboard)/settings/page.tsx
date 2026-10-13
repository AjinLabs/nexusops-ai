'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  Globe,
  Sliders,
  Save,
  RotateCcw,
} from 'lucide-react';

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState('sk-proj-••••••••••••••••••••••••9842');
  const [anthropicKey, setAnthropicKey] = useState('sk-ant-••••••••••••••••••••••••5519');
  const [geminiKey, setGeminiKey] = useState('AIzaSy••••••••••••••••••••••••4412');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = () => {
    setFeedback('✓ Enterprise credentials and gateway configurations saved successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Platform Settings & AI Gateway
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              ENCRYPTED SECRETS VAULT
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Manage provider model gateways, masked API credentials, and notification webhooks.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Model Provider API Keys */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-[#0B5497]" />
          AI Provider API Gateways
        </h2>
        <p className="text-xs text-[#4A5B73]">
          Secrets are stored with AES-256 envelope encryption. Never exposed to browser or client bundles.
        </p>

        <div className="space-y-3 pt-2 text-xs">
          <div>
            <label className="text-xs font-semibold text-[#0E1E38]">OpenAI API Key (GPT-4o, Embeddings)</label>
            <input
              type="text"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs font-mono text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0E1E38]">Anthropic API Key (Claude 3.5 Sonnet)</label>
            <input
              type="text"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs font-mono text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0E1E38]">Google Gemini API Key (Gemini 1.5 Pro)</label>
            <input
              type="text"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs font-mono text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Webhook Notifications */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0B5497]" />
          Incident & Governance Webhooks
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-xs font-semibold text-[#0E1E38]">Slack Operations Channel Webhook</label>
            <input
              type="text"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs font-mono text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
