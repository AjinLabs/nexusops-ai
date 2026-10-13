'use client';

import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Plus,
  Sliders,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { INITIAL_EVALUATIONS } from '@/server/db/mock-seed';
import { EvaluationDataset } from '@/types';

export default function EvaluationLabPage() {
  const [datasets, setDatasets] = useState<EvaluationDataset[]>(INITIAL_EVALUATIONS);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRunEvaluation = (ds: EvaluationDataset) => {
    setRunningId(ds.id);
    setTimeout(() => {
      setRunningId(null);
      setFeedback(`✓ Benchmark run completed for "${ds.name}". Score: ${ds.lastRunScore}% (PASSED RELEASE GATE)`);
      setTimeout(() => setFeedback(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Evaluation Lab & AI Quality Gates
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-mono">
              STRICT GATES ENFORCED
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Pre-flight regression benchmarking, factual grounding checks, adversarial prompt injection tests, and automated promotion blocks.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-[#EBF8F0] border border-[#16803C]/20 text-xs font-medium text-[#16803C] flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {datasets.map((ds) => {
          const isPassing = ds.lastRunScore >= ds.benchmarkTargetScore;
          return (
            <div
              key={ds.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all flex flex-col justify-between space-y-4 shadow-human hover:shadow-human-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
                    TARGET: {ds.agentRole.toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      isPassing
                        ? 'bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20'
                        : 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                    }`}
                  >
                    {isPassing ? 'GATE PASSED' : 'GATE FAILED'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0E1E38] mt-3">{ds.name}</h3>
                <p className="text-xs text-[#4A5B73] mt-1 line-clamp-2 leading-relaxed">
                  {ds.description}
                </p>

                {/* Score vs Benchmark */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#4A5B73]">Current Benchmark:</span>
                    <span className="text-base font-bold text-[#16803C]">{ds.lastRunScore}%</span>
                  </div>
                  <div className="w-full bg-[#E8E3D8] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#16803C] h-full rounded-full"
                      style={{ width: `${ds.lastRunScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#7E8FA4] font-mono">
                    <span>Target: {ds.benchmarkTargetScore}%</span>
                    <span>Test Cases: {ds.testCaseCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E3D8] flex items-center justify-between">
                <span className="text-[10px] text-[#7E8FA4] font-mono">
                  Release Gate: {ds.releaseGatePolicy === 'strict' ? 'BLOCKING' : 'ADVISORY'}
                </span>
                <button
                  onClick={() => handleRunEvaluation(ds)}
                  disabled={runningId === ds.id}
                  className="px-4 py-1.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3 h-3 fill-current" />
                  {runningId === ds.id ? 'Running Test...' : 'Run Benchmark'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
