import {
  DepartmentReadiness,
  AgentActivityItem,
  ComplianceAlert,
  DocumentItem,
  AssessmentResult,
  WorkloadSignal,
  ChatMessage
} from './types';

export const INITIAL_DEPARTMENTS: DepartmentReadiness[] = [
  {
    id: 'DEPT-001',
    name: 'Quality Management',
    head: 'Quality Director (PO-001)',
    score: 87,
    risk: 'Low',
    status: 'Ready',
    trend: '↑ +2%',
    subscores: { documents: 94, training: 88, audit: 85, process: 81 },
    openFindings: 0,
    details: 'The central Quality Management Department maintains compliance across all primary clauses. All core processes are documented and reviewed. Internal audit schedules are on track with zero major nonconformities detected.'
  },
  {
    id: 'DEPT-002',
    name: 'Information Technology',
    head: 'ICT Manager (PO-002)',
    score: 73,
    risk: 'Medium',
    status: 'At Risk',
    trend: '→ 0%',
    subscores: { documents: 80, training: 65, audit: 72, process: 75 },
    openFindings: 1,
    details: 'IT operations show moderate compliance, but system recovery drills and employee security certifications are lagging. Corrective Action Plan CAP-IT-03 is currently active for server validation redundancy.'
  },
  {
    id: 'DEPT-003',
    name: 'HSE',
    head: 'HSE Manager (PO-003)',
    score: 91,
    risk: 'Low',
    status: 'Ready',
    trend: '↑ +1%',
    subscores: { documents: 95, training: 90, audit: 92, process: 87 },
    openFindings: 0,
    details: 'Health, Safety & Environment department represents a model sector. Robust logging of risk events and perfect adherence to regulatory timelines. Competency metrics of standard operators stand high.'
  },
  {
    id: 'DEPT-004',
    name: 'Operations',
    head: 'Operations Manager (PO-004)',
    score: 61,
    risk: 'High',
    status: 'Not Ready',
    trend: '↓ −3%',
    subscores: { documents: 40, training: 55, audit: 68, process: 81 },
    openFindings: 2,
    details: 'Operations department fails to meet the 70% basic compliance threshold. Severe gaps exist in Clause 8.1 operational planning due to the missing Operational Control Plan. Action is urgently recommended.'
  },
  {
    id: 'DEPT-005',
    name: 'Human Resources',
    head: 'HR Manager (PO-005)',
    score: 79,
    risk: 'Medium',
    status: 'On Track',
    trend: '↑ +1%',
    subscores: { documents: 85, training: 74, audit: 80, process: 77 },
    openFindings: 1,
    details: 'Human Resources is steadily improving. Performance development programs align with ISO training requisites, though competency evaluation records require structured central archival updates.'
  },
  {
    id: 'DEPT-006',
    name: 'Procurement',
    head: 'Procurement Manager (PO-006)',
    score: 55,
    risk: 'High',
    status: 'Not Ready',
    trend: '↓ −5%',
    subscores: { documents: 35, training: 48, audit: 58, process: 79 },
    openFindings: 1,
    details: 'Procurement presents critical operational risk. Supplier evaluations under Clause 8.4.1 are severely overdue (18 months of audits lacking). The core Supplier Eval Procedure (DOC-005) is stale by 6 months.'
  }
];

export const INITIAL_ACTIVITY_FEED: AgentActivityItem[] = [
  {
    id: 'act-1',
    agentType: 'audit',
    agentName: 'Audit Readiness Agent',
    actionText: 'Identified 2 high-risk departments for external audit',
    timestamp: '2 min ago',
    confidence: 91
  },
  {
    id: 'act-2',
    agentType: 'compliance',
    agentName: 'Compliance Intelligence Agent',
    actionText: 'Mapped AF-001 to ISO 9001:2015 Clause 8.1 — major nonconformity',
    timestamp: '5 min ago',
    confidence: 96
  },
  {
    id: 'act-3',
    agentType: 'document',
    agentName: 'Document Control Agent',
    actionText: 'DOC-007 missing: Operational Control Plan flagged for DEPT-004',
    timestamp: '12 min ago',
    confidence: 98
  },
  {
    id: 'act-4',
    agentType: 'insights',
    agentName: 'Manager Insights Agent',
    actionText: 'Procurement dept score dropped 5% — escalation recommended',
    timestamp: '18 min ago',
    confidence: 88
  },
  {
    id: 'act-5',
    agentType: 'learning',
    agentName: 'ISO Learning Path Agent',
    actionText: 'Generated 8-week ISO 9001 learning plan for Operations Manager PO-004',
    timestamp: '34 min ago',
    confidence: 93
  },
  {
    id: 'act-6',
    agentType: 'assessment',
    agentName: 'Assessment Agent',
    actionText: 'PO-003 scored 91/100 on Clause 6 assessment — certified',
    timestamp: '1 hr ago',
    confidence: 99
  },
  {
    id: 'act-7',
    agentType: 'audit',
    agentName: 'Audit Readiness Agent',
    actionText: 'DEPT-006 readiness score below threshold: 55% — audit risk HIGH',
    timestamp: '2 hrs ago',
    confidence: 95
  },
  {
    id: 'act-8',
    agentType: 'document',
    agentName: 'Document Control Agent',
    actionText: 'DOC-005 Supplier Evaluation Procedure: review overdue by 6 months',
    timestamp: '3 hrs ago',
    confidence: 97
  }
];

export const COMPLIANCE_ALERTS: ComplianceAlert[] = [
  {
    id: 'AL-001',
    level: 'CRITICAL',
    title: 'Major NC: Missing Operational Control Plan',
    subtitle: 'DEPT-004 · Clause 8.1 · Due 31 Jan 2026',
    departmentId: 'DEPT-004',
    clause: '8.1',
    dateOrInfo: 'Due 31 Jan 2026',
    targetId: 'DOC-007'
  },
  {
    id: 'AL-002',
    level: 'CRITICAL',
    title: 'Major NC: Supplier evaluations overdue 18 months',
    subtitle: 'DEPT-006 · Clause 8.4.1 · Due 15 Jan 2026',
    departmentId: 'DEPT-006',
    clause: '8.4.1',
    dateOrInfo: 'Due 15 Jan 2026',
    targetId: 'AF-002'
  },
  {
    id: 'AL-003',
    level: 'WARNING',
    title: 'Document review overdue: Supplier Evaluation Procedure',
    subtitle: 'DOC-005 · Last reviewed Jun 2024',
    departmentId: 'DEPT-006',
    clause: '8.4.1',
    dateOrInfo: 'Last reviewed Jun 2024',
    targetId: 'DOC-005'
  }
];

export const READINESS_TREND_DATA = [
  { month: 'Jul', score: 68 },
  { month: 'Aug', score: 70 },
  { month: 'Sep', score: 71 },
  { month: 'Oct', score: 73 },
  { month: 'Nov', score: 74 },
  { month: 'Dec', score: 76 }
];

export const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: 'Which departments are at risk for the upcoming audit?'
  },
  {
    id: 'msg-2',
    sender: 'aura',
    text: `Based on current readiness data, two departments present HIGH audit risk:

🔴 Operations (DEPT-004) — Score: 61%
• Major nonconformity AF-001: No Operational Control Plan (Clause 8.1)
• Process owner training incomplete
• Recommendation: Immediate corrective action required

🔴 Procurement (DEPT-006) — Score: 55%  
• Major nonconformity AF-002: Supplier evaluations 18 months overdue (Clause 8.4.1)
• Document DOC-005 overdue for review
• Recommendation: Escalate to top management this week`,
    sources: 'Sources: audit_findings.json · readiness_scores.json · ISO 9001:2015 §8.1, §8.4.1'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'DOC-001',
    title: 'Quality Manual',
    department: 'Quality Management',
    type: 'Manual',
    status: 'approved',
    isoClause: 'Clause 4.3',
    lastReviewed: 'Nov 2025'
  },
  {
    id: 'DOC-002',
    title: 'Internal Audit Procedure',
    department: 'Quality Management',
    type: 'Procedure',
    status: 'approved',
    isoClause: 'Clause 9.2',
    lastReviewed: 'Dec 2025'
  },
  {
    id: 'DOC-003',
    title: 'Risk Assessment Framework',
    department: 'Quality Management',
    type: 'Framework',
    status: 'draft',
    isoClause: 'Clause 6.1',
    lastReviewed: 'Jan 2026'
  },
  {
    id: 'DOC-004',
    title: 'Disaster Recovery Plan',
    department: 'Information Technology',
    type: 'Plan',
    status: 'approved',
    isoClause: 'Clause 8.1.3',
    lastReviewed: 'Sep 2025'
  },
  {
    id: 'DOC-005',
    title: 'Supplier Evaluation Procedure',
    department: 'Procurement',
    type: 'Procedure',
    status: 'overdue_review',
    isoClause: 'Clause 8.4.1',
    lastReviewed: 'Jun 2024'
  },
  {
    id: 'DOC-006',
    title: 'HSE Competency Register',
    department: 'HSE',
    type: 'Register',
    status: 'approved',
    isoClause: 'Clause 7.2',
    lastReviewed: 'Oct 2025'
  },
  {
    id: 'DOC-007',
    title: 'Operational Control Plan',
    department: 'Operations',
    type: 'Plan',
    status: 'missing',
    isoClause: 'Clause 8.1',
    lastReviewed: 'Never'
  },
  {
    id: 'DOC-008',
    title: 'Employee Onboarding Manual',
    department: 'Human Resources',
    type: 'Manual',
    status: 'approved',
    isoClause: 'Clause 7.1.2',
    lastReviewed: 'Jul 2025'
  },
  {
    id: 'DOC-009',
    title: 'Procurement Standard Guidelines',
    department: 'Procurement',
    type: 'Guideline',
    status: 'draft',
    isoClause: 'Clause 8.4',
    lastReviewed: 'Feb 2026'
  }
];

export const RECENT_ASSESSMENTS: AssessmentResult[] = [
  { id: 'asm-1', owner: 'PO-001', role: 'QMS Manager', score: 88, result: 'Pass', date: 'Dec 2025' },
  { id: 'asm-2', owner: 'PO-003', role: 'HSE Manager', score: 91, result: 'Pass', date: 'Dec 2025' },
  { id: 'asm-3', owner: 'PO-005', role: 'HR Manager', score: 76, result: 'Pass', date: 'Nov 2025' },
  { id: 'asm-4', owner: 'PO-002', role: 'ICT Manager', score: 62, result: 'Fail', date: 'Sep 2025' },
  { id: 'asm-5', owner: 'PO-004', role: 'Ops Manager', score: 57, result: 'Fail', date: 'Nov 2025' },
  { id: 'asm-6', owner: 'PO-006', role: 'Procurement Mgr', score: 48, result: 'Fail', date: 'Oct 2025' }
];

export const WORKLOAD_SIGNALS: WorkloadSignal[] = [
  {
    id: 'wrk-1',
    owner: 'PO-001',
    role: 'QMS Director',
    capacity: 'available',
    meetingHrs: 12,
    focusHrs: 28,
    learningSlot: 'Wed Afternoon'
  },
  {
    id: 'wrk-2',
    owner: 'PO-002',
    role: 'ICT Manager',
    capacity: 'limited',
    meetingHrs: 22,
    focusHrs: 18,
    learningSlot: 'Fri Morning'
  },
  {
    id: 'wrk-3',
    owner: 'PO-003',
    role: 'HSE Director',
    capacity: 'available',
    meetingHrs: 8,
    focusHrs: 32,
    learningSlot: 'Mon Afternoon'
  },
  {
    id: 'wrk-4',
    owner: 'PO-004',
    role: 'Operations Mgr',
    capacity: 'overloaded',
    meetingHrs: 35,
    focusHrs: 5,
    learningSlot: 'Thu Morning'
  },
  {
    id: 'wrk-5',
    owner: 'PO-005',
    role: 'HR Lead',
    capacity: 'limited',
    meetingHrs: 25,
    focusHrs: 15,
    learningSlot: 'Tue Morning'
  },
  {
    id: 'wrk-6',
    owner: 'PO-006',
    role: 'Procurement Mgr',
    capacity: 'constrained',
    meetingHrs: 29,
    focusHrs: 11,
    learningSlot: 'Thu Afternoon'
  }
];
