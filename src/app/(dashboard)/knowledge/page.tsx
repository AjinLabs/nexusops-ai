'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Upload,
  BookOpen,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  X,
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeChunk } from '@/types';

export default function KnowledgeHubPage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('What is the approval threshold for AP invoices?');
  const [searchResults, setSearchResults] = useState<KnowledgeChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [newDocTags, setNewDocTags] = useState('Compliance, Policy');

  const fetchDocs = () => {
    fetch('/api/knowledge')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) setDocuments(data.documents);
      });
  };

  useEffect(() => {
    fetchDocs();
    handleSearch();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);

    try {
      const res = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpload = async () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newDocTitle,
          content: newDocContent,
          fileType: 'markdown',
          tags: newDocTags.split(',').map((t) => t.trim()),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setNewDocTitle('');
        setNewDocContent('');
        fetchDocs();
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E3D8] shadow-human">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#0E1E38]">
              Enterprise Knowledge Hub (RAG)
            </h1>
            <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-mono">
              VECTOR INDEX ONLINE
            </span>
          </div>
          <p className="text-xs text-[#4A5B73] mt-1">
            Grounded enterprise knowledge with semantic chunk embeddings, document-level ACLs, and verbatim source citations.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" /> Ingest Knowledge Document
        </button>
      </div>

      {/* Semantic Search Interactive Sandbox */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E3D8] space-y-4 shadow-human">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0B5497]" />
            <h2 className="text-sm font-bold text-[#0E1E38]">
              Semantic Retrieval & Citation Simulator
            </h2>
          </div>
          <span className="text-[10px] text-[#7E8FA4] font-mono">EMBEDDINGS: TEXT-EMBEDDING-3-LARGE</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7E8FA4] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Test a natural-language query against indexed documents..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none transition-all shadow-inner"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-5 py-2.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Run Query'}
          </button>
        </div>

        {/* Results with relevance scores and verbatim citations */}
        <div className="space-y-3 pt-2">
          <div className="text-[11px] font-bold text-[#7E8FA4] uppercase tracking-wider flex items-center justify-between">
            <span>Retrieved Grounding Chunks ({searchResults.length})</span>
            <span className="text-[10px] text-[#0B5497] font-mono">COSINE THRESHOLD &gt; 0.70</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {searchResults.map((chunk) => (
              <div
                key={chunk.id}
                className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] flex flex-col justify-between text-xs space-y-2 hover:border-[#0B5497]/40 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0E1E38] truncate max-w-[170px]">
                      {chunk.documentTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20">
                      {((chunk.score || 0.85) * 100).toFixed(1)}% MATCH
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A5B73] mt-2 italic line-clamp-3 leading-relaxed">
                    &ldquo;{chunk.text}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8E3D8] flex items-center justify-between text-[10px] text-[#7E8FA4] font-mono">
                  <span>Chunk #{chunk.chunkIndex}</span>
                  <span>Page {chunk.page || 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indexed Documents Catalog */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-[#0E1E38] uppercase tracking-wider">
          Indexed Workspace Knowledge Documents ({documents.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-[#E8E3D8] hover:border-[#0B5497]/30 transition-all flex flex-col justify-between space-y-3 shadow-human hover:shadow-human-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#EAF2FA] border border-[#0B5497]/15 text-[#0B5497]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#0E1E38]">{doc.title}</h3>
                      <span className="text-[10px] text-[#7E8FA4] font-mono">
                        {doc.fileType.toUpperCase()} • {doc.sizeKb} KB • {doc.chunkCount} Chunks
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 text-[9px] font-bold rounded-full bg-[#EBF8F0] text-[#16803C] border border-[#16803C]/20 font-mono">
                    INDEXED
                  </span>
                </div>

                <p className="text-xs text-[#4A5B73] mt-2.5 line-clamp-2 leading-relaxed">
                  {doc.sampleExcerpt}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#E8E3D8] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  {doc.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-[#FAF8F3] text-[10px] text-[#4A5B73] font-mono border border-[#E8E3D8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-[#7E8FA4]">
                  Uploaded by {doc.uploadedBy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E8E3D8] p-6 shadow-human-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D8]">
              <h3 className="text-sm font-bold text-[#0E1E38]">Ingest Enterprise Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#7E8FA4] hover:text-[#0E1E38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Employee Code of Conduct 2026"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. HR, Compliance, Policies"
                  value={newDocTags}
                  onChange={(e) => setNewDocTags(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#0E1E38]">Document Text Content</label>
                <textarea
                  rows={6}
                  placeholder="Paste document policy text or excerpts..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-[#FAF8F3] border border-[#E8E3D8] text-xs text-[#0E1E38] placeholder-[#7E8FA4] focus:border-[#0B5497] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E3D8]">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-full text-xs text-[#4A5B73] hover:text-[#0E1E38]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!newDocTitle || !newDocContent}
                className="px-5 py-2 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-sm"
              >
                Chunk & Index Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
