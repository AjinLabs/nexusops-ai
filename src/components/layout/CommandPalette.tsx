'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Workflow,
  Sparkles,
  ShieldAlert,
  Database,
  Terminal,
  Activity,
  DollarSign,
  X,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      title: 'Workflow Studio — Design & Canvas',
      category: 'Workflows',
      icon: Workflow,
      href: '/workflows',
    },
    {
      title: 'AI Command Centre — Copilot Query',
      category: 'Intelligence',
      icon: Terminal,
      href: '/command-centre',
    },
    {
      title: 'Review Critical Approvals (1 Pending)',
      category: 'Governance',
      icon: ShieldAlert,
      href: '/approvals',
    },
    {
      title: 'Natural-Language Workflow Synthesizer',
      category: 'Studio',
      icon: Plus,
      href: '/workflows/generator',
    },
    {
      title: 'Enterprise Knowledge Hub & Citations',
      category: 'RAG',
      icon: Database,
      href: '/knowledge',
    },
    {
      title: 'Agent Registry — 10 Specialized Roles',
      category: 'Agents',
      icon: Sparkles,
      href: '/agents',
    },
    {
      title: 'Cost Intelligence & Budget Thresholds',
      category: 'FinOps',
      icon: DollarSign,
      href: '/costs',
    },
    {
      title: 'Observability & Live DAG Execution Traces',
      category: 'Observability',
      icon: Activity,
      href: '/observability',
    },
  ];

  const filtered = query
    ? quickActions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-[#FFFFFF] border border-[#E8E3D8] shadow-human-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8E3D8] bg-[#FAF8F3]">
          <Search className="w-5 h-5 text-[#7E8FA4] mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, workflow, agent, or governance check..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#0E1E38] placeholder-[#7E8FA4] text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7E8FA4] hover:text-[#0B5497] hover:bg-[#EAF2FA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7E8FA4]">
              No actions matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#EAF2FA] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-[#0B5497] group-hover:border-[#0B5497]/30 group-hover:bg-[#FFFFFF] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0E1E38] group-hover:text-[#0B5497] transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[#7E8FA4] uppercase font-mono tracking-wider">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0B5497]" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#FAF8F3] border-t border-[#E8E3D8] flex items-center justify-between text-[11px] text-[#7E8FA4]">
          <span>Navigate with arrows</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
