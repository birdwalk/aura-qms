# Foundry IQ Integration

## What is Foundry IQ
Foundry IQ is Microsoft Foundry's configurable, multi-source knowledge layer. It provides
a knowledge base with knowledge sources and agentic retrieval, returning permission-aware,
grounded answers with citations.

## AURA QMS Knowledge Base
The following synthetic documents are uploaded to Foundry IQ as knowledge sources:

| File | Content | Primary Agents |
|------|---------|----------------|
| iso_9001_guidance.md | Clause-by-clause ISO 9001:2015 requirements | Learning Path, Compliance Intelligence, Assessment |
| audit_procedures.md | Internal audit process, finding classification | Audit Readiness, Assessment |
| document_control_guide.md | Document lifecycle, status definitions, clause requirements | Document Control |
| corrective_action_guide.md | Root cause analysis, CA process, verification | Compliance Intelligence |
| certification_prep_guide.md | Exam preparation, assessment tips | Learning Path, Assessment |

## Retrieval Pattern
1. Agent receives user query
2. Foundry IQ performs semantic search across knowledge base
3. Relevant passages retrieved with source document metadata
4. Agent constructs response citing specific document and section
5. Citations surfaced to user in response footer

## Setup Instructions
1. In Azure AI Studio, navigate to your Foundry project
2. Select "Knowledge bases" → "Create knowledge base"
3. Upload all files from `/knowledge_base/` directory
4. Configure Azure AI Search index
5. Connect knowledge base to each agent in Foundry Agent Service
6. Copy knowledge base ID to `VITE_KNOWLEDGE_BASE_ID` in `.env.local`
