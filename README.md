# NexusOps — Enterprise AI Automation & Agent Orchestration OS

> **"From intelligent decisions to controlled execution."**
> One command centre for every AI-powered business workflow.

NexusOps is a production-oriented, multi-tenant enterprise AI automation and agent orchestration platform. It transforms repetitive, high-stakes business processes into observable, governed, reusable AI pipelines with strict permissions, dual-key human oversight, measurable business outcomes, and immutable audit trails.

---

## 🌟 Core Value Proposition & Differentiators

Unlike simple chatbot wrappers or disconnected UI dashboards, **NexusOps** enforces strict operational semantics:
1. **AI Suggestion** vs. **Generated Workflow** vs. **Validated Workflow** vs. **Approved Workflow** vs. **Executing Workflow** vs. **Verified Result**.
2. **Human-in-the-Loop Governance Gates**: Automated executions pause at high/critical risk thresholds until authorized by designated governance roles.
3. **Least-Privilege Tool Registry**: Bounded tool contracts with strict JSON schemas, rate limits, timeouts, and side-effect classifications.
4. **Enterprise RAG Knowledge Hub**: Factual grounding with cosine similarity matching, document-level permissions, and verbatim source citations.
5. **Multi-Tenant SaaS Foundation**: Complete organization and workspace isolation with role-based access control (Platform Admin, Org Owner, AI Architect, Workflow Developer, Operator, Approver, Auditor).

---

## 🏛 Platform Architecture & 19 Navigation Modules

| # | Navigation Area | Route | Capabilities |
|---|---|---|---|
| 1 | **Executive Command Centre** | `/overview` | Live KPI cards (Active Workflows, Success Rate, Approvals, Spend, Hours Saved), Area execution trends, Provider cost allocation, and Audit feed. |
| 2 | **AI Command Centre** | `/command-centre` | Conversational operational assistant with live database inspection, tool invocation badges, action confirmation cards, and citations. |
| 3 | **Visual Workflow Studio** | `/workflows` | Visual node-based workflow editor (`@xyflow/react`) with custom nodes (Triggers, AI Agents, Logic/Approval Gates, Data, Integrations, Outputs). |
| 4 | **Natural-Language Synthesizer**| `/workflows/generator` | Translates natural-language business specifications into typed, valid DAG workflow graphs with automatic risk tiering. |
| 5 | **Agent Registry** | `/agents` | 10 specialized agent roles (Planner, Researcher, Analyst, Extractor, Coder, Builder, Executor, Reviewer, Compliance, Reporter). |
| 6 | **Agent Runs & Traces** | `/runs` | Durable execution logs, step-by-step progress, duration, token consumption, and input/output payload inspectors. |
| 7 | **Human Approvals Centre** | `/approvals` | Dual-key authorization interface with parameter bindings, policy trigger rationale, and workflow resumption upon approval. |
| 8 | **Human Review Queue** | `/review-queue` | Side-by-side inspection for low-confidence AI extractions (&lt; 90% confidence), accept/reject controls. |
| 9 | **Tool Registry** | `/tools` | Central registry of tool contracts with typed schemas, risk classifications, timeouts, and rate limits. |
| 10 | **Knowledge Hub (RAG)** | `/knowledge` | Document ingestion pipeline (PDF, Markdown, DOCX) with semantic vector search sandbox, cosine relevance scores, and citations. |
| 11 | **Integration Marketplace** | `/integrations` | Adapters for Slack, GitHub, Jira, PostgreSQL, Salesforce, and Webhooks with live TLS connection tests and token scopes. |
| 12 | **Schedules & Triggers** | `/schedules` | Database-backed cron runner with recurrence rules, timezones, next-run previews, pause/resume, and manual triggers. |
| 13 | **Evaluation Lab** | `/evaluations` | AI quality benchmark suites (Gold Standard Extraction, PII Defenses, Grounding Veracity) with strict release gates. |
| 14 | **Observability & Trace** | `/observability` | OpenTelemetry-compatible tracing, p50/p95/p99 latency percentiles by execution step, and SLA performance tracking. |
| 15 | **Cost Intelligence** | `/costs` | Multi-provider spend tracking (OpenAI, Anthropic, Gemini), monthly organization caps, daily trends, and per-run costs. |
| 16 | **Templates & Marketplace** | `/templates` | Department automation packs for Finance, Support, Engineering, HR, Sales, and Operations. |
| 17 | **Organization & Teams** | `/team` | Multi-tenant organization switcher, workspace assignments, member invitations, and RBAC matrix. |
| 18 | **Security & Governance** | `/governance` | Threat model guards (Prompt injection defense, automated PII scrubbing, secret lifecycle rotation). |
| 19 | **Enterprise Audit Trail** | `/audit-logs` | Append-only, tamper-evident audit logs tracking all actors, events, timestamps, and correlation IDs. |
| 20 | **Platform Settings** | `/settings` | Encrypted AI gateway credentials vault, API keys masking, and escalation webhook endpoints. |

---

## 🎨 Visual Design System

- **Dark Theme Palette**:
  - Application Background: `#0B1020`
  - Sidebar: `#0F172A`
  - Main Panels: `#111C32`
  - Elevated Cards: `#17243B`
  - Primary Electric Blue: `#4569FF`
  - Secondary Indigo: `#7C6CFF`
  - Cyan Accent: `#42D9E8`
  - Main Text: `#F4F7FF`
  - Secondary Text: `#9BAAC5`
  - Borders: `#263653`
  - Status Indicators: Success `#36C995`, Warning `#F5B942`, Error `#F16B78`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/nexusops-ai/nexusops-ai.git
cd nexusops-ai

# Install dependencies
npm install

# Build production bundle
npm run build

# Start production server
npm start
# Or for local development with live reload:
npm run dev
```

Visit **`http://localhost:3000`** (or configured port) in your browser.

---

## 🧪 Verification & Automated Testing

All core capabilities have been verified end-to-end:
1. **Compilation & Type Check**: Next.js 16 App Router production build completed across all 36 dynamic routes and API endpoints.
2. **DAG Execution Engine**: Tested sequential execution, parameter passing, and simulated step progression.
3. **Approval Interception & Resumption**: Successfully halted workflow on $14,850.00 disbursement and resumed downstream tasks upon authorized approval.
4. **Natural-Language Synthesis**: Synthesized DAG graph from natural language specification into connected React Flow nodes.
5. **Semantic RAG Grounding**: Verified cosine similarity scores and citation highlights.
6. **Integration Handshake**: Verified TLS connection test on configured external adapters.

---

## 📄 License

Proprietary enterprise software. Copyright © 2026 NexusOps AI Systems.
