'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Send,
  Terminal,
  Sparkles,
  Wrench,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  Workflow,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolInvoked?: string;
  citations?: string[];
  suggestedFollowUps?: string[];
  actionCard?: any;
}

export default function AICommandCentrePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content: `### Welcome to NexusOps Command Intelligence Copilot 👋
I am connected to your live enterprise workspace **Production Operations (ws_prod)**. I have access to real-time execution logs, DAG traces, governance approval queues, and authorized knowledge indexes.

How can I assist you today? You can query operational health, inspect pending approvals, analyze AI costs, or instruct me to generate a new workflow draft.`,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Which workflows failed today?',
        'Explain why an approval is pending',
        'Show me the most expensive agents this month',
        'Find workflows that use a disconnected integration',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        content: data.message || 'Operational query processed successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolInvoked: data.toolInvoked,
        citations: data.citations,
        suggestedFollowUps: data.suggestedFollowUps,
        actionCard: data.actionCard,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          content: 'An error occurred while contacting the AI Command Copilot gateway.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto space-y-4 select-none">
      {/* Header bar in Warm Ivory & Ocean style */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8] bg-white p-4 rounded-2xl border shadow-human">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-[#EAF2FA] border border-[#0B5497]/20 text-[#0B5497] shadow-sm">
            <Bot className="w-5 h-5 text-[#0B5497]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#0E1E38]">AI Command Assistant</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
                LLM ORCHESTRATION GATEWAY
              </span>
            </div>
            <p className="text-xs text-[#4A5B73]">
              Natural-language operational assistant with verified citations and safe tool execution
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg_reset',
                sender: 'assistant',
                content: 'Chat session reset. How can I assist your operations today?',
                timestamp: 'Now',
                suggestedFollowUps: [
                  'Which workflows failed today?',
                  'Explain why an approval is pending',
                  'Show me the most expensive agents this month',
                ],
              },
            ]);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3D8] text-xs text-[#4A5B73] hover:text-[#0B5497] hover:border-[#0B5497]/40 transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Session
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 shadow-human ${
                msg.sender === 'user'
                  ? 'bg-[#0B5497] text-white rounded-br-none shadow-md'
                  : 'bg-white border border-[#E8E3D8] text-[#0E1E38] rounded-bl-none'
              }`}
            >
              {/* Tool invocation badge */}
              {msg.toolInvoked && (
                <div className="mb-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-[11px] font-mono text-[#0B5497]">
                  <Wrench className="w-3.5 h-3.5 text-[#0B5497] animate-spin" />
                  <span>Invoked Tool:</span>
                  <span className="text-[#0E1E38] font-bold">{msg.toolInvoked}</span>
                </div>
              )}

              {/* Message content */}
              <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                msg.sender === 'user' ? 'text-white' : 'text-[#0E1E38]'
              }`}>
                {msg.content}
              </div>

              {/* Action Preview Card if returned */}
              {msg.actionCard && msg.actionCard.type === 'approval_preview' && (
                <div className="mt-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs shadow-sm">
                  <div className="flex items-center justify-between text-[#C53030] font-bold pb-2 border-b border-[#E8E3D8]">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Action Requires Executive Sign-off
                    </span>
                    <span className="font-mono text-[10px] text-[#0B5497]">
                      {msg.actionCard.approvalId}
                    </span>
                  </div>
                  <div className="mt-2 text-[#4A5B73] space-y-1">
                    <div>
                      Vendor: <span className="text-[#0E1E38] font-semibold">{msg.actionCard.vendor}</span>
                    </div>
                    <div>
                      Disbursement: <span className="text-[#0E1E38] font-mono font-bold">${msg.actionCard.amount?.toLocaleString()} USD</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      href="/approvals"
                      className="px-4 py-1.5 rounded-full bg-[#0B5497] text-white font-medium text-xs hover:bg-[#08447A] transition-all flex items-center gap-1 shadow-sm"
                    >
                      Open Approval Decision Modal <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Citations if available */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#E8E3D8] text-[11px]">
                  <div className="flex items-center gap-1 text-[#0B5497] font-semibold mb-1">
                    <BookOpen className="w-3 h-3" /> Grounded In Enterprise Sources:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-[#4A5B73] font-mono text-[10px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-[10px] text-[#7E8FA4] mt-1 px-1">{msg.timestamp}</span>

            {/* Suggested Follow-Ups */}
            {msg.suggestedFollowUps && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-2xl">
                {msg.suggestedFollowUps.map((sf, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(sf)}
                    className="px-3.5 py-1 rounded-full bg-white border border-[#E8E3D8] hover:border-[#0B5497] text-[11px] text-[#0B5497] hover:bg-[#EAF2FA] transition-all text-left flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-[#0B5497]" />
                    {sf}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E8E3D8] text-xs text-[#4A5B73] shadow-human">
            <div className="w-5 h-5 border-2 border-[#0B5497] border-t-transparent rounded-full animate-spin" />
            <span>Consulting multi-agent telemetry and evaluating governance rules...</span>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Ask a question or describe an automation (e.g. 'Which workflows failed today?' or 'Draft ticket triage workflow')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white border border-[#E8E3D8] focus:border-[#0B5497] focus:ring-1 focus:ring-[#0B5497] text-sm text-[#0E1E38] placeholder-[#7E8FA4] focus:outline-none transition-all shadow-human"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-full bg-[#0B5497] text-white hover:bg-[#08447A] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-[#7E8FA4] mt-2 px-2">
          <span>Enterprise Guardrails: PII Scrubbed • Bounded Tools • Audit Trail Enabled</span>
          <Link href="/workflows/generator" className="text-[#0B5497] hover:underline flex items-center gap-1 font-medium">
            <Plus className="w-3 h-3" /> Open Visual Graph Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
