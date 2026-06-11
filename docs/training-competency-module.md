# Training & Competency Module

The Training & Competency Module turns AURA from a compliance dashboard into a competence-driven ISO readiness system.

## What It Adds
- Process-linked ISO 9001:2015 training modules
- Role-based visibility for QMS managers and process owners
- Quizzes with pass and certification thresholds
- Training records with attempts, scores, dates, and certification state
- Automatic update of the department training subscore
- Automatic recalculation of overall department readiness
- New assessment result records for management review

## Core Feedback Loop

```text
Audit Finding / Clause Gap
        ↓
Compliance Intelligence Agent
        ↓
Training & Competency Agent
        ↓
Learning Module + Quiz
        ↓
Assessment Agent
        ↓
Training Score
        ↓
Department Readiness Engine
        ↓
Audit Readiness Agent
        ↓
Manager Insights Agent
```

## Scoring Logic

Training uses two thresholds:

- Pass threshold: 70%
- Certification threshold: 85%

When the user passes, the module updates the relevant department training subscore using weighted scoring:

```text
newTraining = oldTraining * 0.4 + quizScore * 0.6
```

The department score is then recalculated:

```text
overall = documents * 25% + training * 30% + audit * 25% + process * 20%
```

## Microsoft Foundry Role

In Azure AI Foundry, the Training & Competency Agent should be registered as a specialist agent connected to Foundry IQ. It should retrieve ISO clause guidance, company procedures, competency matrices, audit findings, and corrective-action evidence.

## Foundry IQ Knowledge Collections

Recommended collections:

- ISO 9001:2015 clause guidance
- Company SOPs and work instructions
- Competency matrix
- Training records
- Assessment records
- Audit findings
- Corrective action plans
- Management review minutes

## Demo Story

1. Operations has a major finding under Clause 8.1.
2. The Compliance Intelligence Agent maps the finding to Operational Planning & Control.
3. The Training & Competency Agent assigns the Clause 8.1 module.
4. The Operations Manager completes the module and scores 92%.
5. The module awards certification.
6. Operations training subscore increases.
7. Department readiness recalculates.
8. Manager Insights explains the improvement and remaining evidence gap.
