# Fabric IQ Integration

## What is Fabric IQ
Fabric IQ is the semantic foundation within Microsoft Fabric. It brings together data,
meaning, and actions into a single semantic layer, with an Ontology at the core connecting
people, processes, systems, actions, rules, and data into unified business entities.

## AURA QMS Semantic Ontology

```
Organisation (Syntara Group)
    └── Department (DEPT-001 to DEPT-006)
            └── Process Owner (PO-001 to PO-006)
                    ├── Training Records (TR-001 to TR-006)
                    ├── Documents Owned (DOC-001 to DOC-009)
                    │       └── Document Status
                    │               └── ISO Clause Reference
                    ├── Audit Findings (AF-001 to AF-005)
                    │       └── Corrective Actions (CA-001 to CA-003)
                    └── Readiness Score (RS-001 to RS-006)
                            ├── Sub-scores (doc/training/audit/process)
                            └── Certification Prediction
```

## Semantic Rules Encoded
- Readiness score formula: (doc×0.30) + (training×0.25) + (audit×0.25) + (process×0.20)
- Major NC penalty: −15 points per open major nonconformity
- Certification threshold: ≥70% required for all departments
- Training certification threshold: ≥80% assessment score
- Document review cycle: 12 months for all approved documents

## How Agents Use Fabric IQ
- **Audit Readiness Agent**: Traverses ontology to compute weighted scores across departments
- **Manager Insights Agent**: Aggregates semantic entities for executive-level summaries
- **Compliance Intelligence Agent**: Maps clause requirements to responsible departments via ontology
