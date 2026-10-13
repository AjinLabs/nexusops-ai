'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Workflow } from '@/types';

export default function NaturalLanguageGeneratorPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(
    'When a high-priority customer support ticket arrives, classify urgency, search our security knowledge base, draft an SLA solution, and require a human manager sign-off before dispatching to Slack.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null);
  const [summary, setSummary] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedWorkflow(data.workflow);
        setSummary(data.summary);
      }
    } catch (err) {
      alert('Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportToStudio = async () => {
    if (!generatedWorkflow) return;

    // Save to DB
    await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generatedWorkflow),
    });

    router.push(`/workflows/studio/${generatedWorkflow.id}`);
  };

  const examplePrompts = [
    'When an employee expense report exceeds $1,000, verify receipts with OCR, cross-reference travel policy in Knowledge Hub, and route to departmental VP for approval before ERP sync.',
    'When a critical GitHub CVE alert is published, inspect container logs, quarantine vulnerable microservice, and send an executive incident brief to Slack #secops-alerts.',
    'Onboard new enterprise engineering hires: provision GitHub repository access, assign SOC2 compliance reading, and trigger a 30-day manager review checkpoint.',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none">
      {/* Back button */}
      <Link
        href="/workflows"
        className="inline-flex items-center gap-1.5 text-xs text-[#4A5B73] hover:text-[#0B5497] transition-colors font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Workflows Catalog
      </Link>

      {/* Header in Ocean & Ivory style */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8] bg-white p-5 rounded-2xl border shadow-human">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[#EAF2FA] border border-[#0B5497]/20 text-[#0B5497] shadow-sm">
            <Sparkles className="w-5 h-5 text-[#0B5497]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#0E1E38]">
              Natural-Language Workflow Synthesizer
            </h1>
            <p className="text-xs text-[#4A5B73] mt-0.5">
              Describe your business automation objective. The AI Builder Agent will synthesize a validated DAG graph with typed schemas and governance gates.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Composer Box */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0B5497] flex items-center justify-between">
          <span>Automation Specification</span>
          <span className="text-[10px] text-[#7E8FA4] font-mono">MODEL: NEXUS-BUILDER-V3</span>
        </label>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. When an invoice arrives, extract line items, match PO in PostgreSQL, and if > $5k require approval before payout..."
          className="w-full p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] focus:border-[#0B5497] focus:ring-1 focus:ring-[#0B5497] text-sm text-[#0E1E38] placeholder-[#7E8FA4] focus:outline-none transition-all shadow-inner"
        />

        {/* Example prompts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#7E8FA4] uppercase">Or choose a crafted template:</span>
          <div className="flex flex-col gap-1.5">
            {examplePrompts.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="text-left text-xs text-[#4A5B73] hover:text-[#0B5497] p-3 rounded-xl bg-[#FAF8F3] hover:bg-[#EAF2FA] border border-[#E8E3D8] transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2">{ex}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7E8FA4] group-hover:text-[#0B5497] flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Synthesizing DAG Graph...' : 'Synthesize Workflow Graph'}
          </button>
        </div>
      </div>

      {/* Generated Workflow Preview Canvas & Inspection */}
      {generatedWorkflow && (
        <div className="p-6 rounded-2xl bg-white border border-[#0B5497]/30 space-y-6 shadow-human animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E3D8] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-mono">
                  SYNTHESIS COMPLETE
                </span>
                <span className="text-[10px] font-mono text-[#7E8FA4]">
                  ID: {generatedWorkflow.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#0E1E38] mt-1">{generatedWorkflow.name}</h2>
              <p className="text-xs text-[#4A5B73] mt-0.5">{generatedWorkflow.description}</p>
            </div>

            <button
              onClick={handleImportToStudio}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
            >
              Open in Visual Canvas Studio <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Synthesis Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]">
              <span className="text-[10px] text-[#7E8FA4]">NODES GENERATED</span>
              <div className="text-lg font-bold text-[#0B5497] mt-1">{summary?.nodeCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]">
              <span className="text-[10px] text-[#7E8FA4]">RISK CLASSIFICATION</span>
              <div className="text-lg font-bold text-[#C53030] mt-1 uppercase">
                {summary?.riskTier}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]">
              <span className="text-[10px] text-[#7E8FA4]">APPROVAL GATE</span>
              <div className="text-lg font-bold text-[#B45309] mt-1">
                {summary?.requiresHumanApproval ? 'ENFORCED' : 'OPTIONAL'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8]">
              <span className="text-[10px] text-[#7E8FA4]">ESTIMATED RUN COST</span>
              <div className="text-lg font-bold text-[#16803C] mt-1">$0.045 / run</div>
            </div>
          </div>

          {/* Sequential Step Progression */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider">
              Synthesized Pipeline Execution DAG
            </h3>
            <div className="space-y-2">
              {generatedWorkflow.nodes.map((node, i) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#EAF2FA] border border-[#0B5497]/20 text-[11px] font-mono font-bold text-[#0B5497] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-[#0E1E38] flex items-center gap-2">
                        {node.data.label}
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-white text-[#4A5B73] font-mono border border-[#E8E3D8]">
                          {node.data.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#4A5B73] mt-0.5">{node.data.description}</div>
                    </div>
                  </div>

                  {node.data.requiresApproval ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25">
                      HUMAN SIGN-OFF
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#16803C] flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Auto
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
