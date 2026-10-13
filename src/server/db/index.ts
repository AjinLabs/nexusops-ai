import fs from 'fs';
import path from 'path';
import {
  Organization,
  Workspace,
  User,
  Workflow,
  WorkflowRun,
  Agent,
  ApprovalRequest,
  ToolDefinition,
  Integration,
  KnowledgeDocument,
  AuditLog,
  ScheduleItem,
  EvaluationDataset,
  HumanReviewItem,
  MarketplaceTemplate,
} from '@/types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_AGENTS,
  INITIAL_TOOLS,
  INITIAL_INTEGRATIONS,
  INITIAL_WORKFLOWS,
  INITIAL_APPROVALS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SCHEDULES,
  INITIAL_EVALUATIONS,
  INITIAL_HUMAN_REVIEWS,
  INITIAL_TEMPLATES,
  INITIAL_WORKFLOW_RUNS,
} from './mock-seed';

export interface NexusOpsDatabase {
  organizations: Organization[];
  users: User[];
  agents: Agent[];
  tools: ToolDefinition[];
  integrations: Integration[];
  workflows: Workflow[];
  workflowRuns: WorkflowRun[];
  approvals: ApprovalRequest[];
  knowledgeDocs: KnowledgeDocument[];
  auditLogs: AuditLog[];
  schedules: ScheduleItem[];
  evaluations: EvaluationDataset[];
  humanReviews: HumanReviewItem[];
  templates: MarketplaceTemplate[];
  budget: {
    monthlyLimit: number;
    currentSpend: number;
    currency: string;
    warningThresholdPercent: number;
    hardStopEnabled: boolean;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'nexusops-store.json');

let inMemoryDb: NexusOpsDatabase | null = null;

function getInitialDb(): NexusOpsDatabase {
  return {
    organizations: INITIAL_ORGANIZATIONS,
    users: INITIAL_USERS,
    agents: INITIAL_AGENTS,
    tools: INITIAL_TOOLS,
    integrations: INITIAL_INTEGRATIONS,
    workflows: INITIAL_WORKFLOWS,
    workflowRuns: INITIAL_WORKFLOW_RUNS,
    approvals: INITIAL_APPROVALS,
    knowledgeDocs: INITIAL_KNOWLEDGE_DOCS,
    auditLogs: INITIAL_AUDIT_LOGS,
    schedules: INITIAL_SCHEDULES,
    evaluations: INITIAL_EVALUATIONS,
    humanReviews: INITIAL_HUMAN_REVIEWS,
    templates: INITIAL_TEMPLATES,
    budget: {
      monthlyLimit: 25000,
      currentSpend: 1482.4,
      currency: 'USD',
      warningThresholdPercent: 80,
      hardStopEnabled: true,
    },
  };
}

export function getDatabase(): NexusOpsDatabase {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(raw);
      return inMemoryDb!;
    }
  } catch (err) {
    console.error('Failed reading database file, using fallback seeded state:', err);
  }

  inMemoryDb = getInitialDb();
  saveDatabase(inMemoryDb);
  return inMemoryDb;
}

export function saveDatabase(data: NexusOpsDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    inMemoryDb = data;
  } catch (err) {
    console.error('Failed writing database file:', err);
  }
}

// System Audit Logger
export function createAuditEntry(
  actor: { id: string; name: string; email: string; role: string },
  action: string,
  resourceType: 'workflow' | 'agent' | 'approval' | 'integration' | 'tool' | 'auth' | 'secret',
  resourceId: string,
  resourceName: string,
  status: 'success' | 'failure' | 'warning',
  details: Record<string, any>
): AuditLog {
  const db = getDatabase();
  const entry: AuditLog = {
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    resourceType,
    resourceId,
    resourceName,
    status,
    ipAddress: '127.0.0.1',
    details,
    correlationId: `corr_${Date.now()}`,
  };

  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  saveDatabase(db);
  return entry;
}

// Workflows Repository
export const workflowsRepo = {
  list(workspaceId?: string): Workflow[] {
    const db = getDatabase();
    if (workspaceId) {
      return db.workflows.filter((w) => w.workspaceId === workspaceId);
    }
    return db.workflows;
  },

  getById(id: string): Workflow | undefined {
    const db = getDatabase();
    return db.workflows.find((w) => w.id === id);
  },

  save(workflow: Workflow, actor?: User): Workflow {
    const db = getDatabase();
    const index = db.workflows.findIndex((w) => w.id === workflow.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      db.workflows[index] = {
        ...workflow,
        updatedAt: now,
      };
      if (actor) {
        createAuditEntry(
          actor,
          'WORKFLOW_UPDATED',
          'workflow',
          workflow.id,
          workflow.name,
          'success',
          { version: workflow.version, status: workflow.status }
        );
      }
    } else {
      const created = {
        ...workflow,
        createdAt: now,
        updatedAt: now,
      };
      db.workflows.unshift(created);
      if (actor) {
        createAuditEntry(
          actor,
          'WORKFLOW_CREATED',
          'workflow',
          workflow.id,
          workflow.name,
          'success',
          { version: workflow.version, status: workflow.status }
        );
      }
    }

    saveDatabase(db);
    return workflow;
  },

  delete(id: string, actor?: User): boolean {
    const db = getDatabase();
    const target = db.workflows.find((w) => w.id === id);
    if (!target) return false;

    db.workflows = db.workflows.filter((w) => w.id !== id);
    if (actor) {
      createAuditEntry(
        actor,
        'WORKFLOW_DELETED',
        'workflow',
        id,
        target.name,
        'warning',
        { deletedAt: new Date().toISOString() }
      );
    }
    saveDatabase(db);
    return true;
  },
};

// Workflow Runs Repository
export const workflowRunsRepo = {
  list(workflowId?: string, workspaceId?: string): WorkflowRun[] {
    const db = getDatabase();
    let runs = db.workflowRuns;
    if (workflowId) {
      runs = runs.filter((r) => r.workflowId === workflowId);
    }
    if (workspaceId) {
      runs = runs.filter((r) => r.workspaceId === workspaceId);
    }
    return runs.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  },

  getById(id: string): WorkflowRun | undefined {
    const db = getDatabase();
    return db.workflowRuns.find((r) => r.id === id);
  },

  create(run: WorkflowRun): WorkflowRun {
    const db = getDatabase();
    db.workflowRuns.unshift(run);

    // Track budget usage
    if (run.estimatedCost > 0) {
      db.budget.currentSpend = parseFloat((db.budget.currentSpend + run.estimatedCost).toFixed(4));
    }

    saveDatabase(db);
    return run;
  },

  update(id: string, updates: Partial<WorkflowRun>): WorkflowRun | undefined {
    const db = getDatabase();
    const index = db.workflowRuns.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    db.workflowRuns[index] = {
      ...db.workflowRuns[index],
      ...updates,
    };
    saveDatabase(db);
    return db.workflowRuns[index];
  },
};

// Approvals Repository
export const approvalsRepo = {
  list(status?: 'pending' | 'approved' | 'rejected' | 'all'): ApprovalRequest[] {
    const db = getDatabase();
    if (!status || status === 'all') {
      return db.approvals;
    }
    return db.approvals.filter((a) => a.status === status);
  },

  getById(id: string): ApprovalRequest | undefined {
    const db = getDatabase();
    return db.approvals.find((a) => a.id === id);
  },

  create(req: ApprovalRequest): ApprovalRequest {
    const db = getDatabase();
    db.approvals.unshift(req);
    saveDatabase(db);
    return req;
  },

  decide(
    id: string,
    decision: 'approved' | 'rejected',
    decidedBy: User,
    comment?: string
  ): ApprovalRequest | undefined {
    const db = getDatabase();
    const index = db.approvals.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    const current = db.approvals[index];
    const updated: ApprovalRequest = {
      ...current,
      status: decision,
      resolvedAt: new Date().toISOString(),
      resolvedBy: decidedBy.name,
      decisionComment: comment || `Decision recorded as ${decision}`,
      executionResult:
        decision === 'approved'
          ? `Authorization token issued. Side effect dispatched.`
          : `Operation aborted by governance. Request flagged.`,
    };

    db.approvals[index] = updated;

    createAuditEntry(
      decidedBy,
      decision === 'approved' ? 'APPROVAL_GRANTED' : 'APPROVAL_REJECTED',
      'approval',
      id,
      current.workflowName,
      decision === 'approved' ? 'success' : 'warning',
      {
        actionType: current.actionType,
        targetSystem: current.targetSystem,
        comment,
      }
    );

    saveDatabase(db);
    return updated;
  },
};

// Agents Repository
export const agentsRepo = {
  list(workspaceId?: string): Agent[] {
    const db = getDatabase();
    if (workspaceId) {
      return db.agents.filter((a) => a.workspaceId === workspaceId);
    }
    return db.agents;
  },

  getById(id: string): Agent | undefined {
    const db = getDatabase();
    return db.agents.find((a) => a.id === id);
  },

  save(agent: Agent, actor?: User): Agent {
    const db = getDatabase();
    const index = db.agents.findIndex((a) => a.id === agent.id);
    const now = new Date().toISOString();

    if (index >= 0) {
      db.agents[index] = {
        ...agent,
        updatedAt: now,
      };
      if (actor) {
        createAuditEntry(actor, 'AGENT_CONFIG_UPDATED', 'agent', agent.id, agent.name, 'success', {
          version: agent.version,
          status: agent.status,
          modelProvider: agent.modelProvider,
        });
      }
    } else {
      db.agents.unshift(agent);
      if (actor) {
        createAuditEntry(actor, 'AGENT_CREATED', 'agent', agent.id, agent.name, 'success', {
          role: agent.role,
          modelProvider: agent.modelProvider,
        });
      }
    }

    saveDatabase(db);
    return agent;
  },
};

// Integrations Repository
export const integrationsRepo = {
  list(): Integration[] {
    const db = getDatabase();
    return db.integrations;
  },

  getByKey(key: string): Integration | undefined {
    const db = getDatabase();
    return db.integrations.find((i) => i.key === key);
  },

  update(key: string, updates: Partial<Integration>, actor?: User): Integration | undefined {
    const db = getDatabase();
    const index = db.integrations.findIndex((i) => i.key === key);
    if (index === -1) return undefined;

    db.integrations[index] = {
      ...db.integrations[index],
      ...updates,
    };

    if (actor) {
      createAuditEntry(
        actor,
        'INTEGRATION_CONFIG_UPDATED',
        'integration',
        db.integrations[index].id,
        db.integrations[index].name,
        'success',
        { isConnected: updates.isConnected, scopes: updates.scopes }
      );
    }

    saveDatabase(db);
    return db.integrations[index];
  },
};

// Knowledge Documents Repository
export const knowledgeRepo = {
  list(workspaceId?: string): KnowledgeDocument[] {
    const db = getDatabase();
    if (workspaceId) {
      return db.knowledgeDocs.filter((d) => d.workspaceId === workspaceId);
    }
    return db.knowledgeDocs;
  },

  add(doc: KnowledgeDocument, actor?: User): KnowledgeDocument {
    const db = getDatabase();
    db.knowledgeDocs.unshift(doc);
    if (actor) {
      createAuditEntry(actor, 'KNOWLEDGE_DOC_UPLOADED', 'secret', doc.id, doc.title, 'success', {
        chunkCount: doc.chunkCount,
        fileType: doc.fileType,
      });
    }
    saveDatabase(db);
    return doc;
  },
};

// Audit Logs Repository
export const auditRepo = {
  list(limit = 100): AuditLog[] {
    const db = getDatabase();
    return db.auditLogs.slice(0, limit);
  },
};

// Tools Repository
export const toolsRepo = {
  list(): ToolDefinition[] {
    const db = getDatabase();
    return db.tools;
  },
};
