'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  BrainCircuit,
  Sliders,
  Wrench,
  Database,
  History,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  DollarSign,
  Play,
  Loader2,
} from 'lucide-react';
import { Agent } from '@/types';
import { INITIAL_AGENTS, INITIAL_TOOLS } from '@/server/db/mock-seed';

function AgentDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'instructions' | 'tools' | 'memory' | 'versions'>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => {
        const found = (data.agents as Agent[])?.find((a) => a.id === id);
        if (found) setAgent(found);
        else {
          const fallback = INITIAL_AGENTS.find((a) => a.id === id) || INITIAL_AGENTS[0];
          setAgent(fallback);
        }
      })
      .catch(() => {
        const fallback = INITIAL_AGENTS.find((a) => a.id === id) || INITIAL_AGENTS[0];
        setAgent(fallback);
      });
  }, [id]);

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-[#4A5B73] gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#0B5497]" />
        <span>Loading agent configuration...</span>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      const data = await res.json();
      if (data.success) {
        setSaveFeedback('✓ Agent configuration updated and immutable version checkpointed.');
        setTimeout(() => setSaveFeedback(null), 3000);
      }
    } catch (err) {
      alert('Failed saving agent');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTool = (toolSlug: string) => {
    const current = agent.approvedTools || [];
    const next = current.includes(toolSlug)
      ? current.filter((t) => t !== toolSlug)
      : [...current, toolSlug];
    setAgent({ ...agent, approvedTools: next });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* Back button */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-xs text-[#4A5B73] hover:text-[#0B5497] transition-colors font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Agent Registry
      </Link>

      {/* Agent Header */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-human">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF2FA] border border-[#0B5497]/20 flex items-center justify-center text-[#0B5497] shadow-sm flex-shrink-0">
            <BrainCircuit className="w-7 h-7 text-[#0B5497]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
                {agent.role.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-semibold">
                {agent.status.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-[#7E8FA4]">v{agent.version}</span>
            </div>
            <h1 className="text-xl font-bold text-[#0E1E38] mt-1">{agent.name}</h1>
            <p className="text-xs text-[#4A5B73] mt-0.5">{agent.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveFeedback && (
            <span className="text-xs text-[#16803C] font-medium animate-in fade-in">
              {saveFeedback}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#E8E3D8] pb-1 text-xs">
        {[
          { key: 'overview', label: 'Overview & Telemetry' },
          { key: 'instructions', label: 'System Instructions & Model' },
          { key: 'tools', label: 'Approved Toolset' },
          { key: 'memory', label: 'Memory & Context Window' },
          { key: 'versions', label: 'Version History' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[#0B5497] text-white font-semibold shadow-sm'
                : 'text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#FAF8F3]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
            <span className="text-[11px] text-[#7E8FA4] font-mono">EVALUATION SCORE</span>
            <div className="text-2xl font-bold text-[#16803C] mt-1 font-mono">{agent.evalScore}%</div>
            <p className="text-[11px] text-[#4A5B73] mt-1">Meets Gold Standard release threshold</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
            <span className="text-[11px] text-[#7E8FA4] font-mono">ALL-TIME EXECUTIONS</span>
            <div className="text-2xl font-bold text-[#0E1E38] mt-1 font-mono">{agent.totalRuns}</div>
            <p className="text-[11px] text-[#4A5B73] mt-1">99.8% completion reliability</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8E3D8] shadow-human">
            <span className="text-[11px] text-[#7E8FA4] font-mono">TOTAL TOKEN SPEND</span>
            <div className="text-2xl font-bold text-[#0B5497] mt-1 font-mono">${agent.usageCost.toFixed(2)}</div>
            <p className="text-[11px] text-[#4A5B73] mt-1">Current billing cycle allocation</p>
          </div>
        </div>
      )}

      {/* Tab 2: Instructions & Model */}
      {activeTab === 'instructions' && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#0B5497]">
              System Policy & Prompt Instructions
            </label>
            <p className="text-xs text-[#4A5B73] mt-0.5">
              Defines operational role, behavioral boundaries, and output formatting rules.
            </p>
            <textarea
              rows={6}
              value={agent.systemInstructions}
              onChange={(e) => setAgent({ ...agent, systemInstructions: e.target.value })}
              className="w-full mt-2 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs font-mono text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#4A5B73]">Model Provider</label>
              <select
                value={agent.modelProvider}
                onChange={(e) => setAgent({ ...agent, modelProvider: e.target.value as any })}
                className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="gemini">Google Gemini</option>
                <option value="local">Local / Ollama</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4A5B73]">Model Identifier</label>
              <input
                type="text"
                value={agent.modelName}
                onChange={(e) => setAgent({ ...agent, modelName: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] focus:border-[#0B5497] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4A5B73]">Temperature: {agent.temperature}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={agent.temperature}
                onChange={(e) => setAgent({ ...agent, temperature: parseFloat(e.target.value) })}
                className="w-full mt-3 accent-[#0B5497]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tools */}
      {activeTab === 'tools' && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B5497]">
              Authorized Tool Invocations
            </h3>
            <p className="text-xs text-[#4A5B73] mt-0.5">
              Principle of Least Privilege: This agent can only invoke tools explicitly granted here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {INITIAL_TOOLS.map((t) => {
              const isAllowed = agent.approvedTools?.includes(t.slug);
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTool(t.slug)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    isAllowed
                      ? 'bg-[#EAF2FA] border-[#0B5497]/40 shadow-sm'
                      : 'bg-[#FAF8F3] border-[#E8E3D8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="pr-3">
                    <div className="text-xs font-bold text-[#0E1E38] flex items-center gap-2">
                      {t.name}
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-white text-[#0B5497] font-mono border border-[#E8E3D8]">
                        {t.riskLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4A5B73] mt-1">{t.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAllowed}
                    readOnly
                    className="w-4 h-4 rounded text-[#0B5497] accent-[#0B5497] mt-1"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Memory */}
      {activeTab === 'memory' && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B5497]">
              Context & Retention Isolation
            </h3>
            <p className="text-xs text-[#4A5B73] mt-0.5">
              Enforce strict tenant scoping. Memory never bleeds across organizations or unapproved workspaces.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                id: 'task_only',
                title: 'Task Execution Scope Only (Ephemerally Bounded)',
                desc: 'Context memory discarded immediately upon node completion. Ideal for stateless extraction and classification.',
              },
              {
                id: 'conversation_window',
                title: 'Sliding Conversation Window (Last 10 Exchanges)',
                desc: 'Maintains bounded context within active multi-turn session. Prevents context drift.',
              },
              {
                id: 'semantic_longterm',
                title: 'Persistent Semantic Memory (Vector Grounded)',
                desc: 'Indexes verified user preferences and approved schemas with strict tenant workspace filters.',
              },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setAgent({ ...agent, memoryType: m.id as any })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  agent.memoryType === m.id
                    ? 'bg-[#EAF2FA] border-[#0B5497]/40 shadow-sm'
                    : 'bg-[#FAF8F3] border-[#E8E3D8] hover:border-[#0B5497]/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#0E1E38]">
                  <span>{m.title}</span>
                  {agent.memoryType === m.id && (
                    <span className="text-[10px] text-[#0B5497] font-mono font-bold">ACTIVE</span>
                  )}
                </div>
                <p className="text-[11px] text-[#4A5B73] mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Versions */}
      {activeTab === 'versions' && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B5497]">
              Immutable Version Checkpoints
            </h3>
            <p className="text-xs text-[#4A5B73] mt-0.5">
              Published production agent versions cannot be modified silently. Every change is an audit checkpoint.
            </p>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            {[
              { ver: agent.version, date: 'Current (Active)', author: 'Alex Mercer', current: true },
              { ver: '2.3.1', date: '2026-10-01', author: 'Sarah Chen' },
              { ver: '2.2.0', date: '2026-09-15', author: 'Alex Mercer' },
            ].map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]"
              >
                <div>
                  <span className="font-bold font-mono text-[#0E1E38]">v{v.ver}</span>
                  <span className="text-[#4A5B73] ml-2">• Author: {v.author} • {v.date}</span>
                </div>
                {v.current ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20">
                    ACTIVE RUNTIME
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setAgent({ ...agent, version: v.ver });
                      alert(`Rolled back to checkpoint v${v.ver}`);
                    }}
                    className="px-3 py-1 rounded-full bg-white hover:bg-[#EAF2FA] border border-[#E8E3D8] text-[#0B5497] text-[11px] font-medium transition-all shadow-sm"
                  >
                    Roll Back
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-xs text-[#4A5B73] gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#0B5497]" />
          <span>Loading agent configuration...</span>
        </div>
      }
    >
      <AgentDetailContent />
    </Suspense>
  );
}
