export type UserRole =
  | 'platform_admin'
  | 'org_owner'
  | 'org_admin'
  | 'ai_architect'
  | 'workflow_developer'
  | 'operator'
  | 'approver'
  | 'auditor'
  | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  orgId: string;
  workspaceId: string;
  department: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'enterprise_pro' | 'scale' | 'custom_sovereign';
  workspaces: Workspace[];
  totalWorkflowsQuota: number;
  monthlyBudget: number;
  createdAt: string;
}

export interface Workspace {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  environment: 'production' | 'staging' | 'sandbox' | 'compliance';
  description: string;
  agentCount: number;
  workflowCount: number;
}

export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export type NodeCategory =
  | 'trigger'
  | 'ai'
  | 'logic'
  | 'data'
  | 'integration'
  | 'output';

export interface WorkflowNodeData {
  label: string;
  category: NodeCategory;
  subType: string;
  description: string;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'completed' | 'failed' | 'waiting_approval' | 'skipped';
  executionDurationMs?: number;
  executionOutput?: any;
  executionError?: string;
  riskLevel?: RiskTier;
  requiresApproval?: boolean;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
  animated?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'hr' | 'finance' | 'sales' | 'support' | 'engineering' | 'operations' | 'security';
  version: string;
  status: 'draft' | 'published' | 'archived';
  orgId: string;
  workspaceId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  triggerType: 'manual' | 'schedule' | 'webhook' | 'event';
  riskClassification: RiskTier;
  runCount: number;
  successRate: number;
  avgDurationMs: number;
  estimatedCostPerRun: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  validationErrors?: string[];
}

export interface NodeRunRecord {
  id: string;
  nodeId: string;
  nodeLabel: string;
  category: NodeCategory;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval' | 'skipped';
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  inputPayload?: any;
  outputPayload?: any;
  error?: string;
  retries?: number;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  workflowVersion: string;
  triggerSource: 'manual' | 'schedule' | 'webhook' | 'event' | 'simulation';
  status: 'queued' | 'running' | 'waiting_approval' | 'completed' | 'failed' | 'cancelled';
  mode: 'production' | 'simulation';
  startTime: string;
  endTime?: string;
  durationMs?: number;
  initiatedBy: string;
  orgId: string;
  workspaceId: string;
  nodeRuns: NodeRunRecord[];
  tokensUsed: number;
  estimatedCost: number;
  errorDetails?: string;
  currentStepIndex?: number;
  totalSteps?: number;
}

export type AgentRoleType =
  | 'planner'
  | 'researcher'
  | 'analyst'
  | 'extractor'
  | 'coder'
  | 'builder'
  | 'executor'
  | 'reviewer'
  | 'compliance'
  | 'reporter';

export interface Agent {
  id: string;
  name: string;
  role: AgentRoleType;
  description: string;
  avatarIcon: string;
  modelProvider: 'openai' | 'anthropic' | 'gemini' | 'local';
  modelName: string;
  temperature: number;
  maxTokens: number;
  systemInstructions: string;
  approvedTools: string[];
  memoryType: 'task_only' | 'conversation_window' | 'semantic_longterm';
  status: 'active' | 'inactive' | 'testing';
  version: string;
  evalScore: number;
  totalRuns: number;
  usageCost: number;
  orgId: string;
  workspaceId: string;
  owner: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  runId: string;
  workflowId: string;
  workflowName: string;
  nodeId: string;
  requestorName: string;
  riskLevel: RiskTier;
  targetSystem: string;
  actionType: string;
  parameters: Record<string, any>;
  reason: string;
  supportingEvidence: string;
  expectedSideEffects: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired';
  requestedAt: string;
  expiresAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  decisionComment?: string;
  executionResult?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'database' | 'communication' | 'file_system' | 'api' | 'ai_inference' | 'finance';
  riskLevel: RiskTier;
  requiredIntegration?: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  timeoutMs: number;
  requiresApproval: boolean;
  rateLimitPerMin: number;
  allowedAgentRoles: AgentRoleType[];
  sideEffectDescription: string;
}

export interface Integration {
  id: string;
  key: string;
  name: string;
  category: 'communication' | 'vcs' | 'ticketing' | 'storage' | 'crm' | 'database' | 'finance';
  description: string;
  icon: string;
  isConnected: boolean;
  authType: 'oauth' | 'api_key' | 'webhook';
  credentialsConfigured: boolean;
  configuredBy?: string;
  configuredAt?: string;
  scopes: string[];
  lastSyncAt?: string;
  recentErrors: number;
  endpointUrl?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'markdown' | 'url';
  sizeKb: number;
  chunkCount: number;
  status: 'indexed' | 'indexing' | 'failed';
  uploadedAt: string;
  uploadedBy: string;
  orgId: string;
  workspaceId: string;
  tags: string[];
  sampleExcerpt: string;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  text: string;
  score?: number;
  page?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  resourceType: 'workflow' | 'agent' | 'approval' | 'integration' | 'tool' | 'auth' | 'secret';
  resourceId: string;
  resourceName: string;
  status: 'success' | 'failure' | 'warning';
  ipAddress: string;
  details: Record<string, any>;
  correlationId: string;
}

export interface ScheduleItem {
  id: string;
  workflowId: string;
  workflowName: string;
  cronExpression: string;
  humanSchedule: string;
  timezone: string;
  isActive: boolean;
  nextRun: string;
  lastRun?: string;
  lastRunStatus?: 'success' | 'failed';
  concurrencyLimit: number;
}

export interface EvaluationDataset {
  id: string;
  name: string;
  description: string;
  agentRole: AgentRoleType;
  testCaseCount: number;
  lastRunScore: number;
  lastEvaluatedAt: string;
  benchmarkTargetScore: number;
  releaseGatePolicy: 'strict' | 'warning_only';
}

export interface HumanReviewItem {
  id: string;
  runId: string;
  workflowName: string;
  category: 'invoice_extraction' | 'customer_reply' | 'document_classification' | 'code_review';
  confidenceScore: number;
  inputContext: Record<string, any>;
  aiGeneratedDraft: Record<string, any>;
  assignedTo: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  submittedAt: string;
}

export interface MarketplaceTemplate {
  id: string;
  title: string;
  slug: string;
  department: 'HR' | 'Finance' | 'Sales' | 'Support' | 'Engineering' | 'Operations';
  description: string;
  riskTier: RiskTier;
  nodesCount: number;
  requiredIntegrations: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Enterprise';
  downloadsCount: number;
  estimatedHoursSaved: number;
  tags: string[];
}
