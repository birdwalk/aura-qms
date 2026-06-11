# AURA QMS — System Architecture

## Overview
AURA QMS is a Microsoft Foundry-powered multi-agent enterprise system for ISO 9001:2015
compliance readiness. It employs six specialised AI agents coordinated by an orchestrator,
grounded in three Microsoft IQ intelligence layers, and deployed via Azure Foundry Agent Service.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React / Vite)               │
│  Command Center · Departments · Documents · Assessments  │
│  Personal Portal (Process Owner View) · Manager Insights │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼────────────────────────────────┐
│           AZURE FOUNDRY AGENT SERVICE                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Orchestrator Agent                   │   │
│  │     Planner–Executor–Critic–Reviewer pattern      │   │
│  └──┬───────┬───────┬──────┬──────────┬─────────────┘   │
│     │       │       │      │          │                   │
│  ┌──▼──┐ ┌──▼──┐ ┌──▼──┐ ┌▼────┐ ┌──▼───────┐ ┌─────┐  │
│  │Learn│ │Doc  │ │Audit│ │Asmt │ │Compliance│ │Mgr  │  │
│  │Path │ │Ctrl │ │Rdns │ │     │ │Intel     │ │Insgt│  │
│  └──┬──┘ └──┬──┘ └──┬──┘ └┬────┘ └──┬───────┘ └──┬──┘  │
└─────┼───────┼───────┼─────┼─────────┼────────────┼─────┘
      │       │       │     │         │            │
┌─────▼───────▼───────▼─────▼─────────▼────────────▼─────┐
│                  MICROSOFT IQ LAYERS                     │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐    │
│  │ Foundry IQ │  │ Fabric IQ  │  │    Work IQ      │    │
│  │ ISO KB     │  │ Ontology   │  │ Workload signals│    │
│  │ Citations  │  │ Semantic   │  │ Capacity aware  │    │
│  └────────────┘  └────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────┘
      │
┌─────▼──────────────────────────────────────────────────┐
│                   SYNTHETIC DATA LAYER                   │
│  departments.json · process_owners.json · documents.json │
│  audit_findings.json · training_records.json             │
│  corrective_actions.json · readiness_scores.json         │
│  workload_signals.json                                   │
└────────────────────────────────────────────────────────┘
```

## Deployment Model
- Frontend: Static site (Vite build → Azure Static Web Apps or any CDN)
- Agents: Hosted in Azure Foundry Agent Service (containerised, managed identity)
- Knowledge Base: Azure Blob Storage → indexed by Azure AI Search → accessed via Foundry IQ
- No custom backend server required — frontend calls Foundry Agent Service API directly

## Security
- API keys stored in environment variables only (never in source code)
- Azure Managed Identity for agent-to-service authentication in production
- No PII in knowledge base or synthetic datasets
- All agent outputs subject to guardrail validation before display
