'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { Workflow } from '@/types';
import { INITIAL_WORKFLOWS } from '@/server/db/mock-seed';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function WorkflowStudioContent() {
  const params = useParams();
  const id = params?.id as string;
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/workflows/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.workflow) {
          setWorkflow(data.workflow);
        } else {
          const found = INITIAL_WORKFLOWS.find((w) => w.id === id) || INITIAL_WORKFLOWS[0];
          setWorkflow(found);
        }
      })
      .catch(() => {
        const found = INITIAL_WORKFLOWS.find((w) => w.id === id) || INITIAL_WORKFLOWS[0];
        setWorkflow(found);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !workflow) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-[#4A5B73] gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#0B5497]" />
        <span>Loading workflow canvas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1.5 text-xs text-[#4A5B73] hover:text-[#0B5497] transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Workflows Catalog
        </Link>
      </div>

      <div className="flex-1 min-h-0">
        <WorkflowCanvas initialWorkflow={workflow} />
      </div>
    </div>
  );
}

export default function WorkflowStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-xs text-[#4A5B73] gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#0B5497]" />
          <span>Initializing canvas studio...</span>
        </div>
      }
    >
      <WorkflowStudioContent />
    </Suspense>
  );
}
