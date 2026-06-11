// ============================================================
// AURA QMS — Type Definitions
// Microsoft Foundry · Reasoning Agents Challenge
// ============================================================

export type ViewType =
  | 'command_center'
  | 'departments'
  | 'documents'
  | 'findings'
  | 'assessments'
  | 'training'
  | 'compliance'
  | 'manager_insights'
  | 'settings';

export interface DepartmentReadiness {
  id: string;
  name: string;
  head: string;
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  status: 'Ready' | 'At Risk' | 'Not Ready' | 'On Track';
  trend: string;
  subscores?: {
    documents: number;
    training: number;
    audit: number;
    process: number;
  };
  openFindings: number;
  details?: string;
}

export interface AgentActivityItem {
  id: string;
  agentType: 'audit' | 'compliance' | 'document' | 'insights' | 'learning' | 'assessment' | 'training';
  agentName: string;
  actionText: string;
  timestamp: string;
  confidence: number;
}

export interface ComplianceAlert {
  id: string;
  level: 'CRITICAL' | 'WARNING';
  title: string;
  subtitle: string;
  departmentId: string;
  clause: string;
  dateOrInfo: string;
  targetId: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  department: string;
  type: string;
  status: 'approved' | 'draft' | 'overdue_review' | 'missing';
  isoClause: string;
  lastReviewed: string;
}

export interface AssessmentResult {
  id: string;
  owner: string;
  role: string;
  score: number;
  result: 'Pass' | 'Fail';
  date: string;
}

export interface WorkloadSignal {
  id: string;
  owner: string;
  role: string;
  capacity: 'available' | 'limited' | 'constrained' | 'overloaded';
  meetingHrs: number;
  focusHrs: number;
  learningSlot: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  sources?: string;
  agentUsed?: string;  // Which Foundry agent responded
  isDemo?: boolean;    // True when using fallback demo mode
}

export interface AuditFinding {
  id: string;
  dept: string;
  clause: string;
  severity: string;
  status: string;
  desc: string;
  owner: string;
  remediation: string;
}
