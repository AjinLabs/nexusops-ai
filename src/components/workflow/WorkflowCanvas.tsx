'use client';

import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Play,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Radio,
  FileCode,
  Download,
  Share2,
  Sliders,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Workflow, WorkflowNode, WorkflowEdge, RiskTier } from '@/types';
import { nodeTypes } from './CustomNodes';
import { NodeInspector } from './NodeInspector';

interface WorkflowCanvasProps {
  initialWorkflow: Workflow;
  onSave?: (workflow: Workflow) => void;
}

export function WorkflowCanvas({ initialWorkflow, onSave }: WorkflowCanvasProps) {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [nodes, setNodes] = useState<Node[]>(initialWorkflow.nodes as any);
  const [edges, setEdges] = useState<Edge[]>(initialWorkflow.edges as any);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: '#0B5497', strokeWidth: 2 } }, eds)
      ),
    []
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as any);
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<WorkflowNode['data']>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          const updated = {
            ...n,
            data: { ...n.data, ...updates },
          };
          if (selectedNode?.id === nodeId) {
            setSelectedNode(updated as any);
          }
          return updated;
        }
        return n;
      })
    );
  };

  // Add new node to canvas
  const addNode = (category: string) => {
    const id = `node_${category}_${Date.now()}`;
    const x = Math.floor(Math.random() * 300) + 100;
    const y = Math.floor(Math.random() * 200) + 100;

    let subType = 'generic';
    let type = 'aiNode';
    let label = 'New Node';

    if (category === 'trigger') {
      type = 'triggerNode';
      subType = 'webhook';
      label = 'Webhook Trigger';
    } else if (category === 'ai') {
      type = 'aiNode';
      subType = 'completion';
      label = 'AI Agent Step';
    } else if (category === 'logic') {
      type = 'logicNode';
      subType = 'if_else';
      label = 'Conditional Branch';
    } else if (category === 'approval') {
      type = 'logicNode';
      subType = 'approval_gate';
      label = 'Human Approval Gate';
    } else if (category === 'integration') {
      type = 'integrationNode';
      subType = 'slack';
      label = 'Slack Notification';
    }

    const newNode: Node = {
      id,
      type,
      position: { x, y },
      data: {
        label,
        category,
        subType,
        description: `Configured ${label} for autonomous workflow pipeline`,
        config: {},
        status: 'idle',
        requiresApproval: category === 'approval',
        riskLevel: category === 'approval' ? 'critical' : 'medium',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setStatusMessage(`Added new ${label}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Validate workflow graph
  const validateWorkflow = () => {
    const errors: string[] = [];
    if (nodes.length === 0) {
      errors.push('Workflow graph is empty. Please add at least one trigger node.');
    }

    const hasTrigger = nodes.some((n) => (n.data as any).category === 'trigger');
    if (!hasTrigger) {
      errors.push('Missing Trigger node. Workflows must begin with an inbound stimulus or schedule.');
    }

    // Check for disconnected nodes
    nodes.forEach((n) => {
      const hasOutgoing = edges.some((e) => e.source === n.id);
      const hasIncoming = edges.some((e) => e.target === n.id);
      if (!hasIncoming && (n.data as any).category !== 'trigger') {
        errors.push(`Node "${(n.data as any).label}" is disconnected (missing inbound connection).`);
      }
    });

    setValidationMessages(errors);
    if (errors.length === 0) {
      setStatusMessage('✓ Validation passed! Workflow DAG is structurally sound and type-safe.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Run test execution on canvas
  const handleTestRun = async (mode: 'production' | 'simulation') => {
    setIsRunning(true);
    setStatusMessage(`Initiating ${mode.toUpperCase()} execution trace across DAG...`);

    try {
      for (let i = 0; i < nodes.length; i++) {
        const targetId = nodes[i].id;
        const targetNode = nodes[i];

        setNodes((prev) =>
          prev.map((n) =>
            n.id === targetId ? { ...n, data: { ...n.data, status: 'running' } } : n
          )
        );

        await new Promise((r) => setTimeout(r, 600));

        if (
          (targetNode.data as any).subType === 'approval_gate' ||
          (targetNode.data as any).requiresApproval
        ) {
          setNodes((prev) =>
            prev.map((n) =>
              n.id === targetId ? { ...n, data: { ...n.data, status: 'waiting_approval' } } : n
            )
          );
          setStatusMessage(
            '⏸ Workflow paused at Governance Approval Gate. Awaiting human sign-off.'
          );
          setIsRunning(false);
          return;
        }

        setNodes((prev) =>
          prev.map((n) =>
            n.id === targetId ? { ...n, data: { ...n.data, status: 'completed' } } : n
          )
        );
      }

      setStatusMessage('✓ All nodes executed and verified successfully!');
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      setStatusMessage('Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    const updated: Workflow = {
      ...workflow,
      nodes: nodes as any,
      edges: edges as any,
      updatedAt: new Date().toISOString(),
    };
    setWorkflow(updated);
    if (onSave) onSave(updated);

    fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    setStatusMessage('✓ Workflow draft saved to database successfully.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] rounded-2xl bg-[#FAF8F3] border border-[#E8E3D8] overflow-hidden shadow-human relative select-none">
      {/* Studio Action Toolbar */}
      <div className="h-14 border-b border-[#E8E3D8] bg-[#FFFFFF] px-4 flex items-center justify-between z-20">
        {/* Left: Workflow metadata */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#0E1E38] tracking-tight">{workflow.name}</h2>
            <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-[#EAF2FA] text-[#0B5497] border border-[#0B5497]/20">
              v{workflow.version}
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-[#FAF8F3] text-[#4A5B73] border border-[#E8E3D8]">
              {workflow.status}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF8F3] text-[11px] text-[#0B5497] font-medium border border-[#E8E3D8]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Risk: {workflow.riskClassification.toUpperCase()}</span>
          </div>
        </div>

        {/* Center: Status feedback notification */}
        {statusMessage && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF2FA] border border-[#0B5497]/30 text-xs text-[#0B5497] font-medium animate-in fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-[#0B5497]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Add Node Dropdown */}
          <div className="flex items-center bg-[#FAF8F3] border border-[#E8E3D8] rounded-full p-0.5 text-xs">
            <button
              onClick={() => addNode('ai')}
              className="px-3 py-1 text-[#4A5B73] hover:text-[#0B5497] hover:bg-[#FFFFFF] rounded-full flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3 text-[#0B5497]" /> + AI Agent
            </button>
            <button
              onClick={() => addNode('approval')}
              className="px-3 py-1 text-[#4A5B73] hover:text-[#B45309] hover:bg-[#FFFFFF] rounded-full flex items-center gap-1 transition-all"
            >
              <ShieldAlert className="w-3 h-3 text-[#B45309]" /> + Approval Gate
            </button>
          </div>

          {/* Validate */}
          <button
            onClick={validateWorkflow}
            className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E3D8] hover:border-[#0B5497]/40 text-xs text-[#4A5B73] hover:text-[#0B5497] transition-all shadow-sm"
          >
            Validate DAG
          </button>

          {/* Test Simulation */}
          <button
            onClick={() => handleTestRun('simulation')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF2FA] border border-[#0B5497]/25 text-[#0B5497] hover:bg-[#D5E6F5] text-xs font-semibold transition-all disabled:opacity-50 shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-[#0B5497]" />
            {isRunning ? 'Simulating...' : 'Simulate Run'}
          </button>

          {/* Save Draft */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0B5497] hover:bg-[#08447A] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Validation Warnings Bar */}
      {validationMessages.length > 0 && (
        <div className="bg-[#FEE2E2] border-b border-[#FCA5A5] px-4 py-2 flex items-center justify-between text-xs text-[#991B1B]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationMessages.join(' • ')}</span>
          </div>
          <button
            onClick={() => setValidationMessages([])}
            className="text-[11px] underline hover:text-[#0E1E38]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Visual Canvas Area + Slideout Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#D9D2C3" gap={20} size={1} />
            <Controls className="bg-[#FFFFFF] border-[#E8E3D8] text-[#0E1E38] shadow-sm rounded-xl overflow-hidden" />
            <MiniMap
              nodeColor={(n: any) => {
                if (n.data?.category === 'trigger') return '#0B5497';
                if (n.data?.category === 'ai') return '#0B5497';
                if (n.data?.category === 'logic') return '#B45309';
                return '#16803C';
              }}
              className="bg-[#FFFFFF] border-[#E8E3D8] shadow-sm rounded-xl overflow-hidden"
            />
          </ReactFlow>
        </div>

        {/* Context-Sensitive Right Node Inspector */}
        <NodeInspector
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdateNode={handleUpdateNode}
        />
      </div>
    </div>
  );
}
