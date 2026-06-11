# Responsible AI — AURA QMS

## Principles Applied

### 1. Fairness
- Readiness assessments use consistent, documented scoring formulas applied equally to all departments
- No department is penalised for factors outside their control without human review
- Learning plans adapted to capacity, not penalised for workload constraints

### 2. Reliability and Safety
- All ISO clause references grounded in approved knowledge base — no hallucination
- Confidence scores surfaced for all agent outputs
- Low-confidence responses (< 85%) flagged for human review
- Guardrails prevent PII exposure in all responses
- Major corrective action decisions always routed to human oversight

### 3. Privacy and Security
- All demonstration data is synthetic — no real names, emails, or personal identifiers
- Workload signals used for scheduling only, never surfaced individually in management views
- API keys managed via environment variables and Azure Managed Identity (never in code)
- No user data transmitted outside Azure tenant boundary in production deployment

### 4. Inclusivity
- Responses use plain language explanations alongside technical ISO references
- Learning paths adapted to individual capacity and workload constraints
- Role-based views prevent information overload — each user sees what is relevant to them

### 5. Transparency
- Every AI response identifies which agent generated it
- Demo mode is clearly labelled when Foundry is not connected
- Sources cited in every compliance-related response
- Users informed they are interacting with AI at all times

### 6. Accountability
- Human oversight required before acting on major corrective action recommendations
- Audit trail maintained through Foundry observability and telemetry
- Agent evaluation rubric documented and applied regularly
- All agent system prompts documented and version-controlled

## Guardrails Implemented
| Guardrail | Mechanism |
|-----------|-----------|
| No PII in responses | Agent prompt instruction + output review |
| No hallucinated ISO requirements | Foundry IQ grounding required for all clause claims |
| Human oversight for major decisions | Explicit recommendation in all CA outputs |
| Demo mode transparency | Visual DEMO badge on all non-Foundry responses |
| Confidence flagging | Sub-85% confidence responses flagged automatically |
