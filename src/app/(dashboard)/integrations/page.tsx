'use client';

import React, { useState, useEffect } from 'react';
import {
  Plug,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Layers,
  Search,
  ExternalLink,
  RotateCcw,
  Key,
  Globe,
  X,
  Loader2,
} from 'lucide-react';
import { Integration } from '@/types';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ key: string; success: boolean; message: string } | null>(null);
  const [configureModal, setConfigureModal] = useState<Integration | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const fetchIntegrations = () => {
    fetch('/api/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.integrations) setIntegrations(data.integrations);
      });
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestConnection = async (key: string) => {
    setTestingKey(key);
    setTestResult(null);

    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, action: 'test_connection' }),
      });
      const data = await res.json();
      setTestResult({
        key,
        success: data.success,
        message: data.message || (data.success ? 'Handshake established successfully' : 'Connection failed: missing credentials'),
      });
    } catch (err) {
      setTestResult({ key, success: false, message: 'Network error contacting endpoint' });
    } finally {
      setTestingKey(null);
    }
  };

  const handleSaveCredentials = async () => {
    if (!configureModal || !apiKeyInput.trim()) return;

    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: configureModal.key,
          action: 'save_credentials',
          credentials: { apiKey: apiKeyInput },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfigureModal(null);
        setApiKeyInput('');
        fetchIntegrations();
      }
    } catch (err) {
      alert('Failed saving credentials');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Integrations & Connectors
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20 font-mono">
              6 ENTERPRISE ADAPTERS
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Enterprise integrations with least-privilege token scopes, credential rotation reminders, and live TLS ping tests.
          </p>
        </div>
      </div>

      {/* Test feedback notification */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between animate-in fade-in shadow-sm ${
            testResult.success
              ? 'bg-[#EBF8F0] border-[#16803C]/20 text-[#16803C]'
              : 'bg-[#FEE2E2] border-[#C53030]/25 text-[#991B1B]'
          }`}
        >
          <div className="flex items-center gap-2">
            {testResult.success ? <CheckCircle2 className="w-4 h-4 text-[#16803C]" /> : <XCircle className="w-4 h-4 text-[#C53030]" />}
            <span>{testResult.message}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-[11px] underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 p-5 flex flex-col justify-between transition-all shadow-human hover:shadow-human-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5497] font-mono">
                  {item.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full flex items-center gap-1 ${
                    item.isConnected
                      ? 'bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20'
                      : 'bg-[#FEE2E2] text-[#C53030] border border-[#C53030]/25'
                  }`}
                >
                  {item.isConnected ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-[#16803C]" /> CONNECTED
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-[#C53030]" /> UNCONFIGURED
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#0E1E38] mt-3">{item.name}</h3>
              <p className="text-xs text-[#4A5B73] mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              {/* Scopes */}
              <div className="mt-4 pt-3 border-t border-[#E8E3D8] space-y-2 text-xs">
                <div className="text-[10px] font-semibold text-[#7E8FA4] uppercase">
                  Authorized Scopes:
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.scopes.map((scope, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-[#FAF8F3] text-[#4A5B73] font-mono text-[10px] border border-[#E8E3D8]"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E8E3D8] flex items-center gap-2">
              <button
                onClick={() => handleTestConnection(item.key)}
                disabled={testingKey === item.key}
                className="flex-1 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {testingKey === item.key ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Pinging...
                  </>
                ) : (
                  'Test Ping'
                )}
              </button>

              <button
                onClick={() => {
                  setConfigureModal(item);
                  setApiKeyInput('');
                }}
                className="px-4 py-2 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-[#0B5497] text-xs font-semibold transition-all shadow-sm"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Credentials Modal */}
      {configureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E8E3D8] p-6 shadow-human-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8]">
              <h3 className="text-sm font-bold text-[#0E1E38]">
                Configure {configureModal.name} Credentials
              </h3>
              <button
                onClick={() => setConfigureModal(null)}
                className="text-[#7E8FA4] hover:text-[#0E1E38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#4A5B73]">
                Provide OAuth client secret or API token. Stored with envelope AES-256 encryption.
              </p>
              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">API Secret / Token</label>
                <input
                  type="password"
                  placeholder="sk_live_... or oauth_token_..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs font-mono text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
              <button
                onClick={() => setConfigureModal(null)}
                className="px-4 py-2 rounded-full text-xs text-[#4A5B73] hover:text-[#0E1E38]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCredentials}
                disabled={!apiKeyInput.trim()}
                className="px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
              >
                Save & Verify Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
