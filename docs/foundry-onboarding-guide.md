# Microsoft Foundry Onboarding Guide for AURA QMS

## 1. Create the Azure AI Foundry Project

1. Go to Azure AI Foundry.
2. Create a new project named `AURA-QMS`.
3. Select the preferred Azure subscription and resource group.
4. Create or attach an Azure AI hub.
5. Enable model deployment for your selected GPT model.

## 2. Create Foundry IQ Knowledge Layer

Create a knowledge base called `AURA-QMS-Knowledge` and upload these folders:

- `knowledge_base/`
- `data/`
- `docs/`
- sample SOPs
- audit reports
- corrective action records
- training materials

Recommended index fields:

- document_id
- title
- department
- iso_clause
- owner
- document_type
- status
- last_reviewed
- source_path

## 3. Register Agents

Create the following agents in Foundry:

1. Orchestrator Agent
2. Compliance Intelligence Agent
3. Document Control Agent
4. Training & Competency Agent
5. Learning Agent
6. Assessment Agent
7. Audit Readiness Agent
8. Manager Insights Agent

Use the markdown files in `/agents` as each agent's system prompt.

## 4. Connect Tools

The recommended tools are:

- Foundry IQ retrieval tool
- Document search tool
- Readiness scoring tool
- Training record tool
- Assessment scoring tool
- Corrective action tracker
- Manager report generator

## 5. Connect the React App

Use the environment file:

```bash
cp .env.example .env
```

Then add your Foundry values:

```env
VITE_FOUNDRY_ENDPOINT=
VITE_FOUNDRY_API_KEY=
VITE_FOUNDRY_PROJECT_ID=
VITE_FOUNDRY_ORCHESTRATOR_AGENT_ID=
VITE_FOUNDRY_COMPLIANCE_AGENT_ID=
VITE_FOUNDRY_TRAINING_AGENT_ID=
VITE_FOUNDRY_ASSESSMENT_AGENT_ID=
VITE_FOUNDRY_AUDIT_AGENT_ID=
```

## 6. Demo Flow for Judges

Use this exact flow:

1. Open Command Center.
2. Show Operations and Procurement are high risk.
3. Open Audit Findings.
4. Show AF-001 mapped to ISO 9001 Clause 8.1.
5. Open Training Centre.
6. Complete the Clause 8.1 Operations training.
7. Score above 85%.
8. Show certification awarded.
9. Show Operations readiness recalculated.
10. Show Manager Insights explaining the improvement.

## 7. Evaluation

Use `/evals/agent_eval_cases.json` and `/evals/scoring_rubric.md` to test:

- Correct clause mapping
- Correct recommendation
- Correct training assignment
- Correct readiness update
- Safe and auditable responses
