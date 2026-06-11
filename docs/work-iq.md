# Work IQ Integration

## What is Work IQ
Work IQ is the intelligence layer that personalises Microsoft 365 Copilot for users
and organisations, combining data, context, and skills/tools so agents can respond
using organisational signals rather than connector-only approaches.

## AURA QMS Work IQ Signals
Workload signals from `workload_signals.json` represent Work IQ data:

| Signal | Source | Used By |
|--------|--------|---------|
| meeting_hours | Calendar data | ISO Learning Path Agent |
| focus_hours | Focus time blocks | ISO Learning Path Agent, Engagement |
| training_hours_available | Derived from schedule | Study plan scheduling |
| preferred_learning_slot | Historical patterns | Engagement timing |
| capacity_band | Computed from hours | Plan adaptation |
| collaboration_load | Communication volume | Overload detection |

## Capacity-Aware Recommendations
The ISO Learning Path Agent adapts study plans based on capacity band:

- **available** (PO-001, PO-003): Full learning modules, 2hr daily sessions
- **limited** (PO-002, PO-005): Condensed modules, 1hr sessions 3x/week
- **constrained** (PO-006): Micro-learning, 30min sessions, highest priority topics only
- **overloaded** (PO-004): Emergency: 15min daily minimum, escalate capacity concern to manager

## Privacy Considerations
Workload signals are used in aggregate for scheduling recommendations only.
Individual work pattern data is never surfaced in shared management views.
Insights Agent presents team-level patterns without exposing individual data.
