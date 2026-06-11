<div align="center">

# AURA QMS
## Adaptive Universal Readiness Agent

**AI-Powered Multi-Agent System for ISO Compliance Readiness**

*Microsoft Agents League — Reasoning Agents Challenge*

---

[![Microsoft Foundry](https://img.shields.io/badge/Microsoft-Foundry-0078D4?style=flat-square&logo=microsoft)](https://ai.azure.com)
[![Azure OpenAI](https://img.shields.io/badge/Azure-OpenAI%20GPT--4o-0078D4?style=flat-square&logo=microsoft-azure)](https://azure.microsoft.com)
[![Reasoning Agents](https://img.shields.io/badge/Challenge-Reasoning%20Agents-6366F1?style=flat-square)](https://aka.ms/agentsleague)
[![Synthetic Data](https://img.shields.io/badge/Data-Synthetic%20Only-14B8A6?style=flat-square)](./data)
[![Responsible AI](https://img.shields.io/badge/Responsible-AI%20Compliant-22C55E?style=flat-square)](./docs/responsible-ai.md)

</div>

---

## The Problem

Organisations pursuing ISO 9001 certification face a systemic challenge: **compliance gaps are discovered during audits, not before them.** Process owners lack role-specific training. Documents drift out of revision control. Readiness is assessed once a year instead of continuously. When the external auditor arrives, it is already too late.

AURA QMS changes this.

---

## The Solution

AURA QMS is a **Microsoft Foundry-powered multi-agent enterprise system** that continuously monitors, teaches, assesses, and advises on ISO 9001:2015 compliance readiness. Six specialised AI agents collaborate under an intelligent orchestrator to deliver grounded, cited, multi-step reasoning across every dimension of QMS readiness — 24/7, before the auditor knocks.

The system serves two layers of users simultaneously:
- **Process Owners** interact with their personal compliance portal — completing assessments, managing documents, following learning paths
- **QMS Managers and Top Management** see the aggregated intelligence — which departments are ready, which are failing, and what must happen before the audit

The agents are the bridge between individual performance and organisational readiness.

---

## Architecture

```
Frontend (React + Vite)
        ↓ Direct API calls
Azure Foundry Agent Service
        ↓
┌────────────────────────────────────────────────┐
│              Orchestrator Agent                │
│       Planner–Executor–Critic–Reviewer         │
└──┬──────────┬──────────┬──────────┬────────────┘
   ↓          ↓          ↓          ↓          ↓          ↓
Learning   Document   Audit    Assessment  Compliance  Manager
Path       Control    Readiness            Intelligence Insights
Agent      Agent      Agent    Agent       Agent       Agent
   ↓          ↓          ↓          ↓          ↓          ↓
┌────────────────────────────────────────────────────────┐
│              Microsoft IQ Intelligence Layers          │
│  Foundry IQ (KB) │ Fabric IQ (Ontology) │ Work IQ     │
└────────────────────────────────────────────────────────┘
        ↓
Synthetic Data (8 JSON files) + Knowledge Base (5 MD docs)
```

**No custom backend required.** The React frontend calls Azure Foundry Agent Service directly. Foundry provides the model hosting, agent endpoints, knowledge retrieval, and orchestration runtime.

---

## Agent Responsibilities

| Agent | IQ Layer | Reasoning Pattern | Responsibility |
|---|---|---|---|
| **Orchestrator** | All three | Planner–Executor–Critic | Routes intent, synthesises multi-agent outputs, verifies citations |
| **ISO Learning Path** | Foundry IQ + Work IQ | Planner–Executor | Role-based learning plans adapted to workload capacity |
| **Document Control** | Fabric IQ | Critic–Reviewer | Detects missing, draft, overdue documents; maps to clauses |
| **Audit Readiness** | Fabric IQ | Multi-step evaluator | Scores departments, predicts certification risk, flags urgency |
| **Assessment** | Foundry IQ | Generator–Evaluator loop | Grounded quiz generation, competency scoring, loop-back to learning |
| **Compliance Intelligence** | Foundry IQ + Fabric IQ | Semantic reasoner | Clause interpretation, gap mapping, corrective action prioritisation |
| **Manager Insights** | Work IQ + Fabric IQ | Synthesiser | Executive summaries, org analytics, capacity-aware risk narratives |

---

## Microsoft IQ Integration

### Foundry IQ — Grounded Knowledge Retrieval
Knowledge base built from five synthetic ISO 9001:2015 guidance documents in `/knowledge_base/`.
Every compliance claim is grounded in this knowledge base. Agents cite document and section references.
Setup: Upload KB files to Azure AI Studio → create knowledge base → connect to agents.

### Fabric IQ — Semantic Business Understanding
Ontology models the full compliance hierarchy:
`Organisation → Department → Process Owner → Documents → Findings → Corrective Actions → Readiness Score`
Scoring formula encoded as semantic rules. Agents traverse this ontology when reasoning about risk.

### Work IQ — Context-Aware Adaptation
Workload signals (meeting hours, focus hours, capacity band) inform learning plan scheduling.
Agents adapt recommendations based on individual capacity — no one-size-fits-all study plans.
Overloaded process owners get micro-learning paths. Available staff get intensive preparation.

---

## Multi-User Architecture

AURA QMS is designed for real organisational use, not single-user demos.

**Process Owner Portal** (Operations Manager, ICT Manager, HSE Manager, etc.)
- Personal ISO learning path with progress tracking
- Own documents and findings only
- Personal assessment history and next quiz
- Role-scoped AI chat — answers relevant to their department
- Activity feeds into the management dashboard automatically

**Management Dashboard** (QMS Manager, Top Management)
- All departments aggregated with readiness scores
- Agent-generated executive briefings
- Risk narratives and escalation recommendations
- Workload analytics respecting individual privacy

Switch between views using the "Viewing as" dropdown in the top bar.

---

## Reasoning Patterns

| Pattern | Where Applied |
|---|---|
| **Planner–Executor** | Orchestrator decomposes complex queries before dispatching |
| **Critic–Reviewer** | Verification layer validates clause accuracy before response is returned |
| **Self-reflection** | Low-confidence responses (< 85%) trigger re-evaluation before delivery |
| **Role-based Specialisation** | Six agents with narrow, non-overlapping responsibilities |
| **Generator–Evaluator Loop** | Assessment agent generates, scores, and loops back to learning if failed |

---

## Synthetic Data

All data is synthetic and for demonstration purposes only. No real company data, real employee data, or PII is included anywhere in this project.

| File | Records | Description |
|---|---|---|
| `data/departments.json` | 6 | Synthetic department registry with ISO scope and readiness scores |
| `data/process_owners.json` | 6 | Synthetic process owners with training and certification status |
| `data/audit_findings.json` | 5 | Synthetic audit findings with clause references and remediation |
| `data/corrective_actions.json` | 3 | Synthetic corrective action plans with step-by-step guidance |
| `data/readiness_scores.json` | 6 | Quarterly readiness scores with sub-dimensions and predictions |
| `data/workload_signals.json` | 6 | Synthetic work patterns for capacity-aware learning plans |
| `data/training_records.json` | 6 | Training completion and assessment history |
| `data/documents.json` | 9 | Document register with status and clause mapping |

Identifiers use clearly fabricated formats: DEPT-001, PO-001, DOC-001, AF-001, TR-001.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/aura-qms.git
cd aura-qms

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Foundry credentials (see Foundry Setup below)
# Leave VITE_APP_MODE=demo to run without Foundry (fully functional demo)

# 4. Run the app
npm run dev

# 5. Open in browser
# http://localhost:3000
```

The app runs in **demo mode** by default — all agent responses use intelligent keyword-matched fallbacks. No Azure subscription required to evaluate the UI and agent logic.

---

## Foundry Setup (Connect Live Agents)

### Step 1 — Create Azure AI Foundry Project
1. Go to [Azure AI Studio](https://ai.azure.com)
2. Create a new project
3. Copy the Project endpoint URL

### Step 2 — Create Foundry IQ Knowledge Base
1. Navigate to Knowledge bases → Create
2. Upload all files from `/knowledge_base/` directory
3. Configure Azure AI Search indexing
4. Copy the knowledge base ID

### Step 3 — Create Agents in Foundry Agent Service
Create 7 agents using the system prompts in `/agents/`:
- Orchestrator Agent (`orchestrator_prompt.md`)
- ISO Learning Path Agent (`learning_agent_prompt.md`)
- Document Control Agent (`document_control_agent_prompt.md`)
- Audit Readiness Agent (`audit_readiness_agent_prompt.md`)
- Assessment Agent (`assessment_agent_prompt.md`)
- Compliance Intelligence Agent
- Manager Insights Agent

Connect each relevant agent to the Foundry IQ knowledge base.

### Step 4 — Configure Environment
```env
VITE_AZURE_FOUNDRY_ENDPOINT=https://your-project.openai.azure.com/
VITE_AZURE_API_KEY=your-api-key
VITE_ORCHESTRATOR_AGENT_ID=asst_your-id
VITE_APP_MODE=live
# ... (see .env.example for all variables)
```

### Step 5 — Build and Deploy
```bash
npm run build
# Deploy /dist to Azure Static Web Apps, Vercel, or any static host
```

---

## Project Structure

```
aura-qms/
├── README.md                    # This file
├── .env.example                 # Environment template
├── .gitignore                   # Excludes secrets and node_modules
├── package.json                 # Dependencies (no Google packages)
├── vite.config.ts               # Build configuration
│
├── /src
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root component, routing, state
│   ├── types.ts                 # TypeScript interfaces
│   ├── data.ts                  # Synthetic data constants
│   ├── /config
│   │   └── foundry.ts           # Foundry configuration
│   ├── /services
│   │   └── foundryAgent.ts      # Foundry Agent Service client
│   └── /components
│       ├── CommandCenter.tsx    # Main dashboard (management view)
│       ├── PersonalPortal.tsx   # Process owner personal view
│       ├── DepartmentsGrid.tsx  # Department readiness cards
│       ├── DocumentsView.tsx    # Document control table
│       ├── AssessmentsView.tsx  # Assessment launcher + results
│       ├── ManagerInsightsView.tsx  # Executive analytics
│       ├── ExtraViews.tsx       # Findings, Compliance, Settings
│       └── DepartmentDetailDrawer.tsx  # Slide-in department detail
│
├── /data                        # Synthetic JSON datasets (8 files)
├── /knowledge_base              # Foundry IQ source documents (5 files)
├── /agents                      # Agent system prompts (7 files)
├── /docs                        # Architecture and technical docs
└── /evals                       # Evaluation test cases and rubric
```

---

## Evaluation Criteria Alignment

| Criterion (Weight) | How AURA QMS Addresses It |
|---|---|
| **Accuracy & Relevance (25%)** | Foundry IQ grounding ensures all ISO clause claims are cited from knowledge base. Evaluation rubric (`evals/`) enforces no hallucinated requirements. |
| **Reasoning & Multi-step Thinking (25%)** | Planner–Executor–Critic–Reviewer pattern. Orchestrator decomposes queries and dispatches to specialist agents. Multi-agent collaboration visible in activity feed. |
| **Creativity & Originality (15%)** | Novel application of enterprise learning scenario to ISO QMS domain. Dual-view architecture (management + process owner). Fabric IQ ontology for compliance hierarchy. |
| **User Experience & Presentation (15%)** | AI Command Center as landing screen. Role-based views. Count-up animations. Live agent feed. Fully functional demo mode without credentials. |
| **Reliability & Safety (20%)** | Guardrails on all agent outputs. Confidence scoring. Demo mode transparency. Responsible AI documentation. Synthetic data only. Human oversight recommendations. |

---

## Responsible AI

- All agent responses identify their source agent
- ISO clause citations required — no hallucinated requirements
- PII guardrails: no individual personal data exposed
- Confidence scoring: sub-85% responses flagged for human review
- Human oversight explicitly recommended for all major corrective actions
- Demo mode clearly labelled when Foundry is not connected
- See [`docs/responsible-ai.md`](./docs/responsible-ai.md) for full details

---

## Roadmap

- **Phase 2**: Real-time SharePoint/OneDrive connector for live document status via MCP
- **Phase 3**: Microsoft Teams notifications for overdue corrective actions
- **Phase 4**: Multi-standard support — ISO 14001 (Environmental), ISO 45001 (OH&S), ISO 27001 (InfoSec)
- **Phase 5**: Hosted Agent deployment with full Azure Managed Identity and Entra integration
- **Phase 6**: Power BI embedded dashboards via Fabric IQ live data connection

---

## Documentation

| Document | Description |
|---|---|
| [`docs/architecture.md`](./docs/architecture.md) | Full system architecture diagram |
| [`docs/foundry-iq.md`](./docs/foundry-iq.md) | Foundry IQ knowledge base setup |
| [`docs/fabric-iq.md`](./docs/fabric-iq.md) | Fabric IQ semantic ontology |
| [`docs/work-iq.md`](./docs/work-iq.md) | Work IQ workload signal integration |
| [`docs/responsible-ai.md`](./docs/responsible-ai.md) | Responsible AI principles and guardrails |
| [`docs/demo-script.md`](./docs/demo-script.md) | Step-by-step judging demo walkthrough |
| [`evals/agent_eval_cases.json`](./evals/agent_eval_cases.json) | 8 agent evaluation test cases |
| [`evals/scoring_rubric.md`](./evals/scoring_rubric.md) | Agent quality scoring rubric |

---

## Challenge Compliance Checklist

- [x] Multi-agent system (6 specialist agents + orchestrator)
- [x] Microsoft Foundry integration (Foundry Agent Service API)
- [x] Reasoning and multi-step decision-making (Planner–Executor–Critic pattern)
- [x] External tools / knowledge base (Foundry IQ with 5 knowledge documents)
- [x] Microsoft IQ integration (Foundry IQ + Fabric IQ + Work IQ — all three)
- [x] Synthetic data only (8 JSON files, fabricated identifiers, no PII)
- [x] Demoable (runs in demo mode without credentials)
- [x] Clear documentation (architecture, agent responsibilities, orchestration flow)
- [x] Responsible AI controls (guardrails, transparency, human oversight)
- [x] Evaluation test cases (8 graded eval cases with scoring rubric)

---

<div align="center">

**Built for the Microsoft Agents League — Reasoning Agents Challenge**

*Adaptive Universal Readiness Agent — making compliance intelligence continuous*

</div>

---

## Training & Competency Module Added

This version includes a complete process-linked Training Centre in `src/components/TrainingView.tsx`.

The module connects ISO clause gaps to learning, quizzes, certification, and live readiness score updates. It introduces the Training & Competency Agent as a new Foundry specialist agent and adds implementation guides in:

- `agents/training_competency_agent_prompt.md`
- `docs/training-competency-module.md`
- `docs/foundry-onboarding-guide.md`

### New Demo Path

```text
Audit Finding → Clause Gap → Training Module → Assessment → Certification → Department Readiness Update → Manager Insight
```

### Run Locally

```bash
npm install
npm run dev
```

Open the app and select `Training Centre` from the sidebar.
