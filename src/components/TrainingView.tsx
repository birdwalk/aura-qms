// ═══════════════════════════════════════════════════════════════
//  AURA QMS — Training Module
//  Process-linked training with performance feedback to system
//  Scores update: training subscore → overall department score
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Play, CheckCircle2, XCircle, Clock, Award,
  TrendingUp, TrendingDown, AlertCircle, ChevronRight,
  ChevronDown, RotateCcw, Sparkles, Target, Users,
  BarChart3, Lock, Unlock, ArrowRight, RefreshCw, Star,
  FileText, Shield, Zap, Brain, ClipboardCheck
} from 'lucide-react';
import { DepartmentReadiness, AssessmentResult } from '../types';

// ── Types ─────────────────────────────────────────────────────
interface TrainingQuestion {
  id:          string;
  q:           string;
  options:     string[];
  correct:     number;
  explanation: string;
  clause:      string;
}

interface TrainingModule {
  id:          string;
  title:       string;
  clause:      string;
  description: string;
  duration:    string;
  difficulty:  'Beginner' | 'Intermediate' | 'Advanced';
  prerequisite?: string;
  content:     string[];
  questions:   TrainingQuestion[];
  deptId:      string;
  ownerId:     string;
  ownerName:   string;
  role:        string;
}

interface TrainingRecord {
  moduleId:        string;
  ownerId:         string;
  status:          'not_started' | 'in_progress' | 'completed' | 'failed';
  score:           number | null;
  attempts:        number;
  lastAttempt:     string | null;
  certified:       boolean;
  completionDate:  string | null;
}

interface TrainingViewProps {
  departments:              DepartmentReadiness[];
  onUpdateDepartmentScore:  (deptId: string, updates: Partial<DepartmentReadiness>) => void;
  onAddAssessmentResult:    (result: AssessmentResult) => void;
  setToast:                 (t: { message: string; type: 'success' | 'info' | 'warning' } | null) => void;
  userRole:                 'QMS' | 'Operations' | 'ICT' | 'HSE' | 'Procurement';
}

// ── Training Modules Data ─────────────────────────────────────
const ALL_MODULES: TrainingModule[] = [
  // ── OPERATIONS ──────────────────────────────────────────────
  {
    id: 'ops-t1', deptId: 'DEPT-004', ownerId: 'PO-004',
    ownerName: 'Operations Manager', role: 'Operations',
    title: 'Clause 8.1 — Operational Planning & Control',
    clause: 'ISO 9001:2015 Clause 8.1',
    description: 'Master operational control plans, process criteria, and shift handover procedures.',
    duration: '45 min', difficulty: 'Intermediate',
    content: [
      'Clause 8.1 requires the organisation to plan, implement, control, and maintain the processes needed to meet product/service requirements.',
      'Key deliverable: An approved Operational Control Plan (DOC-007) must define acceptance criteria for each process.',
      'Shift handover procedures must be documented and consistently followed. Each operator must sign off on the incoming shift checklist.',
      'Process criteria include: what inputs are required, what outputs are expected, and how nonconforming outputs are handled.',
      'Work instructions must be available at point of use — not filed in an office. Operators must have direct access.',
      'Critical to audit readiness: Maintain records showing that controlled conditions were applied consistently.'
    ],
    questions: [
      {
        id: 'ops-t1-q1', clause: '8.1',
        q: 'Which document is explicitly missing for Operations under Clause 8.1?',
        options: ['Supplier Agreement', 'Internal Audit Policy', 'Operational Control Plan (DOC-007)', 'Disaster Recovery Plan'],
        correct: 2,
        explanation: 'DOC-007 (Operational Control Plan) is the critical missing artifact flagged as Nonconformity AF-001. Without it, Clause 8.1 cannot be satisfied.'
      },
      {
        id: 'ops-t1-q2', clause: '8.1',
        q: 'Under ISO 9001:2015 Clause 8.1, what must the organisation establish for controlled processes?',
        options: ['Financial targets only', 'Criteria for processes and acceptance of outputs', 'HR performance ratings', 'Marketing KPIs'],
        correct: 1,
        explanation: 'Clause 8.1 explicitly requires establishing criteria for processes AND criteria for acceptance of products/services.'
      },
      {
        id: 'ops-t1-q3', clause: '8.1',
        q: 'Where must work instructions be available to operators according to ISO 9001?',
        options: ['HR filing cabinet', "QMS Manager's office only", 'At the point of use', 'Digital archive only'],
        correct: 2,
        explanation: 'ISO 9001 requires documented information to be available at the point where it is needed — not centralised away from users.'
      },
      {
        id: 'ops-t1-q4', clause: '8.1',
        q: 'What must happen to the shift handover procedure to satisfy Clause 8.1?',
        options: ['It must be verbal only', 'It must be documented and consistently followed with sign-offs', 'It is optional for small teams', 'Only the manager needs to approve it'],
        correct: 1,
        explanation: 'Controlled conditions under Clause 8.1 require that shift handover procedures are documented AND that evidence of consistent application is maintained.'
      },
    ]
  },
  {
    id: 'ops-t2', deptId: 'DEPT-004', ownerId: 'PO-004',
    ownerName: 'Operations Manager', role: 'Operations',
    title: 'Clause 9.1 — Monitoring & Measurement',
    clause: 'ISO 9001:2015 Clause 9.1',
    description: 'Performance evaluation methods, KPIs, and data-driven decision making.',
    duration: '30 min', difficulty: 'Beginner',
    prerequisite: 'ops-t1',
    content: [
      'Clause 9.1 requires determining what needs to be monitored, using valid methods, and analysing results.',
      'You must define: what to monitor, how to do it, when to analyse, and who is responsible.',
      'Customer satisfaction must be monitored — even if indirectly through complaints, returns, or surveys.',
      'Process performance indicators (KPIs) must be tracked and reviewed at defined intervals.',
      'Data collected must be retained as documented information (records).'
    ],
    questions: [
      {
        id: 'ops-t2-q1', clause: '9.1',
        q: 'What four things must be determined for each monitoring activity under Clause 9.1?',
        options: ['Budget, staff, time, risk', 'What, how, when, who is responsible', 'Input, output, review, approval', 'Plan, do, check, act'],
        correct: 1,
        explanation: 'Clause 9.1.1 specifically requires defining: what to monitor/measure, applicable methods, when analysis occurs, and responsibility.'
      },
      {
        id: 'ops-t2-q2', clause: '9.1',
        q: 'Is customer satisfaction monitoring mandatory under ISO 9001:2015?',
        options: ['No, only for large organisations', 'Only if contractually required', 'Yes, it is explicitly required', 'Only for product companies'],
        correct: 2,
        explanation: 'Clause 9.1.2 explicitly requires monitoring customer perceptions of the degree to which their needs/expectations have been met.'
      },
    ]
  },
  // ── PROCUREMENT ─────────────────────────────────────────────
  {
    id: 'proc-t1', deptId: 'DEPT-006', ownerId: 'PO-006',
    ownerName: 'Procurement Manager', role: 'Procurement',
    title: 'Clause 8.4 — Control of External Providers',
    clause: 'ISO 9001:2015 Clause 8.4',
    description: 'Supplier evaluation, selection criteria, and performance monitoring requirements.',
    duration: '50 min', difficulty: 'Advanced',
    content: [
      'Clause 8.4 requires the organisation to control externally provided processes, products, and services.',
      'You must define evaluation, selection, and re-evaluation criteria for all suppliers providing conforming inputs.',
      'Annual supplier evaluations are not optional — they are a Clause 8.4.1 requirement. Procurement is currently 18 months overdue.',
      'A register of approved suppliers must be maintained with current evaluation status.',
      'Communication requirements under 8.4.3 include: what processes/products/services you are providing, approvals needed, competence requirements, and performance reporting.',
      'Supplier risk classification determines monitoring intensity: High-risk suppliers need more frequent evaluation.'
    ],
    questions: [
      {
        id: 'proc-t1-q1', clause: '8.4.1',
        q: 'How often must high-risk supplier evaluations be conducted?',
        options: ['Every 5 years', 'Only when issues arise', 'At defined intervals — typically annually', 'Only at initial onboarding'],
        correct: 2,
        explanation: 'Clause 8.4.1 requires re-evaluation at defined intervals. For high-risk suppliers, annual evaluation is standard practice. Procurement is currently 18 months overdue — creating audit finding AF-002.'
      },
      {
        id: 'proc-t1-q2', clause: '8.4.3',
        q: 'Under Clause 8.4.3, which of the following must be communicated to external providers?',
        options: ['Internal salary structures', 'Approvals, competence requirements, and performance reporting expectations', 'Company financial results', 'Only delivery timelines'],
        correct: 1,
        explanation: 'Clause 8.4.3 requires communicating: required approvals, competence requirements of personnel, QMS interactions, control methods, and performance metrics.'
      },
      {
        id: 'proc-t1-q3', clause: '8.4.1',
        q: 'What must Procurement maintain regarding approved suppliers?',
        options: ['A verbal agreement record', 'A register of approved suppliers with current evaluation status', 'Only purchase order history', 'Email records only'],
        correct: 1,
        explanation: 'An approved supplier register with up-to-date evaluation status is required documented information under Clause 8.4.1.'
      },
    ]
  },
  // ── ICT ─────────────────────────────────────────────────────
  {
    id: 'ict-t1', deptId: 'DEPT-002', ownerId: 'PO-002',
    ownerName: 'ICT Manager', role: 'ICT',
    title: 'Clause 7.5 — Documented Information Control',
    clause: 'ISO 9001:2015 Clause 7.5',
    description: 'Creation, maintenance, and control of documented information including digital records.',
    duration: '40 min', difficulty: 'Intermediate',
    content: [
      'Clause 7.5 covers all documented information — both documents (instructions, procedures) and records (evidence of activities).',
      'ICT is responsible for ensuring documented information is available, protected from loss, and controlled for integrity.',
      'Version control is mandatory: only the current approved version should be available at point of use.',
      'Access controls must be defined: who can create, update, approve, or delete documented information.',
      'Retention periods must be defined for all record types. ICT must enforce these through system configuration.',
      'Backup and recovery procedures must be documented and regularly tested — this links directly to open finding CAP-IT-03.'
    ],
    questions: [
      {
        id: 'ict-t1-q1', clause: '7.5',
        q: 'What is the key difference between a "document" and a "record" in ISO 9001?',
        options: [
          'Documents are older; records are newer',
          'Documents provide instructions/requirements; records provide evidence of activities performed',
          'Records are for external parties only',
          'There is no difference'
        ],
        correct: 1,
        explanation: 'Documents define how things should be done (procedures, work instructions). Records provide evidence that activities were performed (completed checklists, test results).'
      },
      {
        id: 'ict-t1-q2', clause: '7.5.3',
        q: 'What must ICT ensure regarding version control of documented information?',
        options: [
          'Only the current approved version is available at point of use',
          'All versions must be available to all staff',
          'Versions only matter for external documents',
          'Version control applies only to financial documents'
        ],
        correct: 0,
        explanation: 'Clause 7.5.3 requires controlling documented information to ensure availability of suitable versions at points of use and protection from unintended alteration.'
      },
    ]
  },
  {
    id: 'ict-t2', deptId: 'DEPT-002', ownerId: 'PO-002',
    ownerName: 'ICT Manager', role: 'ICT',
    title: 'Clause 8.1.3 — Change Control & System Redundancy',
    clause: 'ISO 9001:2015 Clause 8.1.3',
    description: 'Managing planned and unplanned changes to IT systems to prevent adverse outcomes.',
    duration: '35 min', difficulty: 'Advanced',
    prerequisite: 'ict-t1',
    content: [
      'Clause 8.1.3 requires reviewing consequences of unintended changes and taking action to mitigate adverse effects.',
      'Change management must include: change request, impact assessment, approval, implementation, verification, and closure.',
      'Server validation redundancy drills must be logged as objective evidence. CAP-IT-03 requires this to be completed.',
      'Disaster recovery procedures must be tested at defined intervals — not just documented.',
      'Any change to infrastructure must be evaluated for impact on product/service conformity.'
    ],
    questions: [
      {
        id: 'ict-t2-q1', clause: '8.1.3',
        q: 'What corrective action is required per CAP-IT-03 for server backup compliance?',
        options: [
          'Order new storage hardware',
          'Complete and log server validation redundancy drills',
          'Hire an external consultant',
          'Delete older system logs'
        ],
        correct: 1,
        explanation: 'CAP-IT-03 specifically requires completion of redundancy backup drills with logged validation records as objective evidence of Clause 8.1.3 compliance.'
      },
    ]
  },
  // ── HSE ─────────────────────────────────────────────────────
  {
    id: 'hse-t1', deptId: 'DEPT-003', ownerId: 'PO-003',
    ownerName: 'HSE Manager', role: 'HSE',
    title: 'Clause 6.1 — Risk & Opportunity Management',
    clause: 'ISO 9001:2015 Clause 6.1',
    description: 'Identifying, assessing, and treating risks and opportunities systematically.',
    duration: '40 min', difficulty: 'Intermediate',
    content: [
      'Clause 6.1 requires determining risks and opportunities relevant to the QMS context.',
      'Risks that could affect conformity of products/services or customer satisfaction must be addressed.',
      'Risk treatment options include: avoidance, mitigation, transfer, or acceptance.',
      'The risk register must be a live document — reviewed at management review and updated when context changes.',
      'Opportunities are positive risks — situations where enhanced performance or customer satisfaction is possible.',
      'HSE leads this process organisation-wide due to the nature of safety and environmental risk identification.'
    ],
    questions: [
      {
        id: 'hse-t1-q1', clause: '6.1',
        q: 'What are the four risk treatment options under ISO 9001 Clause 6.1?',
        options: [
          'Ignore, escalate, delegate, document',
          'Avoidance, mitigation, transfer, acceptance',
          'Prevention, correction, reporting, closing',
          'Plan, do, check, act'
        ],
        correct: 1,
        explanation: 'ISO 9001:2015 Clause 6.1 allows four treatment approaches: avoid the risk, mitigate its likelihood/impact, transfer it (e.g. insurance), or accept it with monitoring.'
      },
      {
        id: 'hse-t1-q2', clause: '6.1',
        q: 'How often must the risk register be reviewed?',
        options: [
          'Only at annual audit',
          'Never — once created it stands',
          'At management review and when context changes',
          'Only when an incident occurs'
        ],
        correct: 2,
        explanation: 'The risk register is a living document. Clause 6.1 requires risks to be periodically reviewed — minimum at management review — and updated when the organisational context changes.'
      },
    ]
  },
  // ── HR ──────────────────────────────────────────────────────
  {
    id: 'hr-t1', deptId: 'DEPT-005', ownerId: 'PO-005',
    ownerName: 'HR Manager', role: 'HR',
    title: 'Clause 7.2 — Competence Management',
    clause: 'ISO 9001:2015 Clause 7.2',
    description: 'Determining, evaluating, and maintaining workforce competence records.',
    duration: '35 min', difficulty: 'Beginner',
    content: [
      'Clause 7.2 requires determining competence requirements for persons affecting QMS performance.',
      'HR must ensure personnel are competent based on: education, training, or experience.',
      'When competency gaps are found, action must be taken — training, mentoring, or reassignment.',
      'The effectiveness of actions taken must be evaluated — not just assumed.',
      'Competency records must be retained as documented information.',
      'Annual competency reviews aligned with performance appraisals satisfy this clause effectively.'
    ],
    questions: [
      {
        id: 'hr-t1-q1', clause: '7.2',
        q: 'What are the three bases for demonstrating competence under Clause 7.2?',
        options: [
          'Age, seniority, and nationality',
          'Education, training, and experience',
          'Salary grade, job title, and location',
          'Attendance, punctuality, and discipline'
        ],
        correct: 1,
        explanation: 'ISO 9001:2015 Clause 7.2 states competence shall be determined based on appropriate education, training, or experience.'
      },
      {
        id: 'hr-t1-q2', clause: '7.2',
        q: 'What must HR do after implementing competency improvement actions?',
        options: [
          'Nothing — training is sufficient',
          'Evaluate the effectiveness of the actions taken',
          'Archive all related documents',
          'Request management approval retroactively'
        ],
        correct: 1,
        explanation: 'Clause 7.2(d) explicitly requires evaluating the effectiveness of actions taken — closing the loop to confirm the gap was actually resolved.'
      },
    ]
  },
  // ── QMS OVERVIEW (for QMS role) ───────────────────────────
  {
    id: 'qms-t1', deptId: 'DEPT-001', ownerId: 'PO-001',
    ownerName: 'Quality Director', role: 'QMS',
    title: 'ISO 9001:2015 Leadership & Context (Clauses 4–5)',
    clause: 'ISO 9001:2015 Clauses 4 & 5',
    description: 'Understanding organisational context, interested parties, and top management obligations.',
    duration: '50 min', difficulty: 'Intermediate',
    content: [
      "Clause 4.1 requires understanding the organisation's internal and external context affecting its ability to achieve intended QMS outcomes.",
      'Clause 4.2 requires identifying interested parties and their relevant requirements — including regulatory bodies, customers, and employees.',
      'Clause 4.4 requires establishing a process-based QMS with clear process interactions, owners, and performance metrics.',
      'Clause 5.1 Leadership: Top management must demonstrate leadership by ensuring QMS integration into business processes — not treating it as separate.',
      "Clause 5.2: A quality policy must be appropriate to the organisation's purpose, include a commitment to continual improvement, and be communicated.",
      'Clause 5.3: Roles, responsibilities, and authorities must be assigned, communicated, and understood throughout the organisation.'
    ],
    questions: [
      {
        id: 'qms-t1-q1', clause: '4.1',
        q: 'What does Clause 4.1 require the organisation to understand?',
        options: [
          'Financial performance only',
          'Internal and external issues that affect the QMS',
          'Customer satisfaction scores only',
          'Competitor analysis'
        ],
        correct: 1,
        explanation: "Clause 4.1 requires determining external and internal issues relevant to the organisation's purpose and strategic direction that affect the ability to achieve intended QMS results."
      },
      {
        id: 'qms-t1-q2', clause: '5.2',
        q: 'What must a Quality Policy include according to Clause 5.2?',
        options: [
          'Financial targets and budget allocations',
          'Commitment to satisfy requirements AND commitment to continual improvement',
          'List of all customers',
          'Technical specifications only'
        ],
        correct: 1,
        explanation: 'Clause 5.2.1 requires the quality policy to include a commitment to satisfy applicable requirements and a commitment to continual improvement of the QMS.'
      },
    ]
  },
];

// ── Score → Department feedback calculator ────────────────────
function calculateNewDeptScore(
  dept: DepartmentReadiness,
  newTrainingScore: number
): Partial<DepartmentReadiness> {
  const current     = dept.subscores || { documents: 70, training: 60, audit: 70, process: 70 };
  const newTraining = Math.round((current.training * 0.4) + (newTrainingScore * 0.6));
  const overall     = Math.round(
    (current.documents * 0.25) + (newTraining * 0.30) + (current.audit * 0.25) + (current.process * 0.20)
  );
  return {
    subscores: { ...current, training: newTraining },
    score:     overall,
    risk:      overall >= 80 ? 'Low' : overall >= 65 ? 'Medium' : 'High',
    status:    overall >= 80 ? 'Ready' : overall >= 70 ? 'On Track' : overall >= 60 ? 'At Risk' : 'Not Ready',
    trend:     newTraining > current.training ? `↑ +${newTraining - current.training}%` : `↓ ${newTraining - current.training}%`,
  };
}

// ── Helpers ───────────────────────────────────────────────────
const PASS_THRESHOLD = 70;
const CERT_THRESHOLD = 85;

const difficultyColor = {
  Beginner:     'var(--accent-teal)',
  Intermediate: '#f59e0b',
  Advanced:     '#ef4444',
};

const statusBadge = (s: TrainingRecord['status']) => {
  const map = {
    not_started: { label: 'Not Started', color: '#475569' },
    in_progress: { label: 'In Progress', color: '#f59e0b' },
    completed:   { label: 'Completed',   color: 'var(--accent-teal)' },
    failed:      { label: 'Failed',      color: '#ef4444' },
  };
  return map[s] || map.not_started;
};

// ════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════════
export const TrainingView: React.FC<TrainingViewProps> = ({
  departments, onUpdateDepartmentScore, onAddAssessmentResult, setToast, userRole
}) => {
  const [records, setRecords]           = useState<Record<string, TrainingRecord>>({});
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [phase, setPhase]               = useState<'browse' | 'learn' | 'quiz' | 'result'>('browse');
  const [contentPage, setContentPage]   = useState(0);
  const [answers, setAnswers]           = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted]       = useState(false);
  const [filterDept, setFilterDept]     = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter modules based on role
  const visibleModules = userRole === 'QMS'
    ? ALL_MODULES
    : ALL_MODULES.filter(m => m.role === userRole || m.role === 'QMS');

  const filteredModules = visibleModules.filter(m => {
    const rec    = records[m.id];
    const status = rec?.status || 'not_started';
    const deptOk = filterDept === 'all' || m.deptId === filterDept;
    const statOk = filterStatus === 'all' || status === filterStatus;
    return deptOk && statOk;
  });

  // Stats
  const totalModules    = visibleModules.length;
  const completedCount  = visibleModules.filter(m => records[m.id]?.status === 'completed').length;
  const certifiedCount  = visibleModules.filter(m => records[m.id]?.certified).length;
  const avgScore        = (() => {
    const scores = visibleModules.map(m => records[m.id]?.score).filter(Boolean) as number[];
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  })();

  // ── Start a module ─────────────────────────────────────────
  const startModule = (mod: TrainingModule) => {
    setActiveModule(mod);
    setContentPage(0);
    setAnswers({});
    setSubmitted(false);
    setPhase('learn');
    setRecords(prev => ({
      ...prev,
      [mod.id]: {
        moduleId: mod.id, ownerId: mod.ownerId,
        status: 'in_progress', score: null,
        attempts: (prev[mod.id]?.attempts || 0),
        lastAttempt: null, certified: false, completionDate: null,
      }
    }));
  };

  // ── Submit quiz ────────────────────────────────────────────
  const submitQuiz = () => {
    if (!activeModule) return;
    setSubmitted(true);

    const correct = activeModule.questions.filter(
      (q, i) => answers[q.id] === q.correct
    ).length;
    const score   = Math.round((correct / activeModule.questions.length) * 100);
    const passed  = score >= PASS_THRESHOLD;
    const cert    = score >= CERT_THRESHOLD;
    const now     = new Date().toISOString().split('T')[0];

    // Update local record
    const newRecord: TrainingRecord = {
      moduleId:       activeModule.id,
      ownerId:        activeModule.ownerId,
      status:         passed ? 'completed' : 'failed',
      score,
      attempts:       (records[activeModule.id]?.attempts || 0) + 1,
      lastAttempt:    now,
      certified:      cert,
      completionDate: passed ? now : null,
    };
    setRecords(prev => ({ ...prev, [activeModule.id]: newRecord }));

    // ── Feed performance back to department ──────────────────
    const dept = departments.find(d => d.id === activeModule.deptId);
    if (dept && passed) {
      const updates = calculateNewDeptScore(dept, score);
      onUpdateDepartmentScore(activeModule.deptId, updates);

      // Add to assessment results
      onAddAssessmentResult({
        id:     'train-' + Date.now(),
        owner:  activeModule.ownerId,
        role:   activeModule.ownerName,
        score,
        result: passed ? 'Pass' : 'Fail',
        date:   new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      });

      setToast({
        message: cert
          ? `🏆 ${activeModule.ownerName} certified on ${activeModule.clause}! Department score updated.`
          : `✅ Training passed (${score}%). ${activeModule.deptId} readiness score recalculated.`,
        type: 'success'
      });
    } else if (!passed) {
      setToast({
        message: `Training failed (${score}%). Score of ${PASS_THRESHOLD}% required. Please review and retry.`,
        type: 'warning'
      });
    }

    setPhase('result');
  };

  // ── Score display for result screen ───────────────────────
  const getQuizScore = () => {
    if (!activeModule) return { score: 0, correct: 0, total: 0 };
    const correct = activeModule.questions.filter(q => answers[q.id] === q.correct).length;
    const score   = Math.round((correct / activeModule.questions.length) * 100);
    return { score, correct, total: activeModule.questions.length };
  };

  // ════════════════════════════════════════════════════════════
  //  RENDER — BROWSE VIEW
  // ════════════════════════════════════════════════════════════
  if (phase === 'browse') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={20} style={{ color: 'var(--accent-teal)' }} />
              Process Training Centre
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              ISO 9001:2015 training modules linked to individual processes · Scores feed back to department readiness
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { label: 'Total Modules',  value: totalModules,   icon: BookOpen,      color: '#6366f1' },
            { label: 'Completed',      value: completedCount, icon: CheckCircle2,  color: 'var(--accent-teal)' },
            { label: 'Certified',      value: certifiedCount, icon: Award,         color: '#f59e0b' },
            { label: 'Avg Score',      value: avgScore ? avgScore + '%' : '—', icon: BarChart3, color: '#8b5cf6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '8px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select className="form-select" style={{ flex: 1, minWidth: 160 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="form-select" style={{ flex: 1, minWidth: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Module cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filteredModules.map(mod => {
            const rec      = records[mod.id];
            const status   = rec?.status || 'not_started';
            const badge    = statusBadge(status);
            const dept     = departments.find(d => d.id === mod.deptId);
            const isLocked = mod.prerequisite && (records[mod.prerequisite]?.status !== 'completed');

            return (
              <div key={mod.id} className="card" style={{
                padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
                opacity: isLocked ? 0.6 : 1,
                border: rec?.certified ? '1px solid #f59e0b40' : undefined,
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--accent-teal)', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {mod.clause}
                      </span>
                      {rec?.certified && <Award size={12} style={{ color: '#f59e0b' }} />}
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{mod.title}</h4>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px',
                    borderRadius: '999px', background: badge.color + '20', color: badge.color,
                    whiteSpace: 'nowrap', marginLeft: '8px',
                  }}>
                    {badge.label}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{mod.description}</p>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} />{mod.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Target size={11} />
                    <span style={{ color: difficultyColor[mod.difficulty] }}>{mod.difficulty}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={11} />{mod.ownerName}
                  </span>
                </div>

                {/* Score bar */}
                {rec?.score !== null && rec?.score !== undefined && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Last score</span>
                      <span style={{ color: (rec.score >= PASS_THRESHOLD) ? 'var(--accent-teal)' : '#ef4444', fontWeight: 600 }}>
                        {rec.score}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'var(--bg-tertiary)', borderRadius: 999 }}>
                      <div style={{
                        height: '100%', borderRadius: 999,
                        width: rec.score + '%',
                        background: rec.score >= CERT_THRESHOLD ? '#f59e0b' : rec.score >= PASS_THRESHOLD ? 'var(--accent-teal)' : '#ef4444',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                )}

                {/* Department impact indicator */}
                {dept && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={11} style={{ color: 'var(--accent-teal)' }} />
                    Feeds → {dept.name} training subscore (currently {dept.subscores?.training ?? '—'}%)
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={() => !isLocked && startModule(mod)}
                  disabled={!!isLocked}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    background: isLocked ? 'var(--bg-tertiary)' : 'var(--accent-teal)',
                    color: isLocked ? 'var(--text-muted)' : '#0a0f1e',
                    fontSize: '12px', fontWeight: 700, cursor: isLocked ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    marginTop: 'auto',
                  }}
                >
                  {isLocked ? <><Lock size={12} /> Complete prerequisite first</>
                    : status === 'not_started' ? <><Play size={12} /> Start Training</>
                    : status === 'in_progress'  ? <><ArrowRight size={12} /> Continue</>
                    : status === 'failed'        ? <><RotateCcw size={12} /> Retry</>
                    : <><RotateCcw size={12} /> Retake</>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Department training impact summary */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 className="section-title" style={{ marginBottom: '16px' }}>
            <BarChart3 size={14} style={{ color: 'var(--accent-teal)' }} />
            Training Impact on Department Readiness
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {departments.map(dept => {
              const deptMods    = visibleModules.filter(m => m.deptId === dept.id);
              const deptDone    = deptMods.filter(m => records[m.id]?.status === 'completed').length;
              const deptTotal   = deptMods.length;
              const deptScore   = dept.subscores?.training ?? dept.score;
              const progress    = deptTotal > 0 ? Math.round((deptDone / deptTotal) * 100) : 0;

              return (
                <div key={dept.id} style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {dept.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>{deptDone}/{deptTotal} modules</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>Training: {deptScore}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 999 }}>
                    <div style={{
                      height: '100%', borderRadius: 999, width: progress + '%',
                      background: progress >= 80 ? 'var(--accent-teal)' : progress >= 50 ? '#f59e0b' : '#ef4444',
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {progress}% module coverage
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER — LEARN PHASE (lesson content)
  // ════════════════════════════════════════════════════════════
  if (phase === 'learn' && activeModule) {
    const totalPages = activeModule.content.length;
    const isLast     = contentPage >= totalPages - 1;

    return (
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Back */}
        <button onClick={() => setPhase('browse')} style={{
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
        }}>
          ← Back to Training Centre
        </button>

        {/* Module header */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '6px' }}>
            {activeModule.clause}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {activeModule.title}
          </h2>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{activeModule.duration}</span>
            <span><Users size={12} style={{ display: 'inline', marginRight: 4 }} />{activeModule.ownerName}</span>
            <span><Target size={12} style={{ display: 'inline', marginRight: 4 }} />{activeModule.difficulty}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Lesson {contentPage + 1} of {totalPages}</span>
            <span>{Math.round(((contentPage + 1) / totalPages) * 100)}% complete</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 999 }}>
            <div style={{
              height: '100%', borderRadius: 999,
              width: (((contentPage + 1) / totalPages) * 100) + '%',
              background: 'var(--accent-teal)', transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '28px', minHeight: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BookOpen size={16} style={{ color: 'var(--accent-teal)' }} />
            <span style={{ fontSize: '12px', color: 'var(--accent-teal)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Key Learning Point
            </span>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.7 }}>
            {activeModule.content[contentPage]}
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {contentPage > 0 && (
            <button onClick={() => setContentPage(p => p - 1)} style={{
              padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', color: 'var(--text-primary)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>
              ← Previous
            </button>
          )}
          <button onClick={() => isLast ? setPhase('quiz') : setContentPage(p => p + 1)} style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none',
            background: 'var(--accent-teal)', color: '#0a0f1e',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            {isLast ? <><Sparkles size={14} /> Take Assessment</> : <>Next <ChevronRight size={14} /></>}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER — QUIZ PHASE
  // ════════════════════════════════════════════════════════════
  if (phase === 'quiz' && activeModule) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button onClick={() => setPhase('learn')} style={{
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
        }}>
          ← Back to Lesson
        </button>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ClipboardCheck size={18} style={{ color: 'var(--accent-teal)' }} />
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Knowledge Assessment
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {activeModule.questions.length} questions · Pass mark: {PASS_THRESHOLD}% · Certification: {CERT_THRESHOLD}%
          </p>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeModule.questions.map((q, qi) => (
            <div key={q.id} className="card" style={{ padding: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.5 }}>
                <span style={{ color: 'var(--accent-teal)', marginRight: '6px' }}>Q{qi + 1}.</span>
                {q.q}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const correct  = submitted && oi === q.correct;
                  const wrong    = submitted && selected && oi !== q.correct;

                  return (
                    <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))}
                      style={{
                        padding: '12px 16px', borderRadius: '8px', textAlign: 'left',
                        border: `1px solid ${correct ? 'var(--accent-teal)' : wrong ? '#ef4444' : selected ? 'var(--accent-teal)' : 'var(--border)'}`,
                        background: correct ? 'rgba(0,255,200,0.08)' : wrong ? 'rgba(239,68,68,0.08)' : selected ? 'rgba(0,255,200,0.05)' : 'var(--bg-tertiary)',
                        color: 'var(--text-primary)', fontSize: '13px', cursor: submitted ? 'default' : 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                      <span>{opt}</span>
                      {correct && <CheckCircle2 size={14} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />}
                      {wrong   && <XCircle      size={14} style={{ color: '#ef4444', flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--accent-teal)' }}>Explanation: </strong>{q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit / next */}
        {!submitted ? (
          <button onClick={submitQuiz}
            disabled={Object.keys(answers).length < activeModule.questions.length}
            style={{
              padding: '12px 28px', borderRadius: '8px', border: 'none',
              background: Object.keys(answers).length >= activeModule.questions.length ? 'var(--accent-teal)' : 'var(--bg-tertiary)',
              color: Object.keys(answers).length >= activeModule.questions.length ? '#0a0f1e' : 'var(--text-muted)',
              fontSize: '14px', fontWeight: 700,
              cursor: Object.keys(answers).length >= activeModule.questions.length ? 'pointer' : 'not-allowed',
              alignSelf: 'flex-end',
            }}>
            Submit Assessment ({Object.keys(answers).length}/{activeModule.questions.length} answered)
          </button>
        ) : (
          <button onClick={() => setPhase('result')} style={{
            padding: '12px 28px', borderRadius: '8px', border: 'none',
            background: 'var(--accent-teal)', color: '#0a0f1e',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-end',
          }}>
            View Results →
          </button>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER — RESULT PHASE
  // ════════════════════════════════════════════════════════════
  if (phase === 'result' && activeModule) {
    const { score, correct, total } = getQuizScore();
    const passed   = score >= PASS_THRESHOLD;
    const cert     = score >= CERT_THRESHOLD;
    const dept     = departments.find(d => d.id === activeModule.deptId);
    const newDept  = dept ? calculateNewDeptScore(dept, score) : null;

    return (
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Result card */}
        <div className="card" style={{
          padding: '36px', textAlign: 'center',
          border: `1px solid ${cert ? '#f59e0b40' : passed ? 'rgba(0,255,200,0.2)' : 'rgba(239,68,68,0.2)'}`,
        }}>
          <div style={{ fontSize: 48, marginBottom: '12px' }}>
            {cert ? '🏆' : passed ? '✅' : '❌'}
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {cert ? 'Certified!' : passed ? 'Passed!' : 'Failed — Retry Required'}
          </h2>
          <div style={{ fontSize: '48px', fontWeight: 800, color: cert ? '#f59e0b' : passed ? 'var(--accent-teal)' : '#ef4444', marginBottom: '8px' }}>
            {score}%
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {correct} correct out of {total} questions
          </p>
          {cert && (
            <div style={{ marginTop: '12px', padding: '8px 20px', background: '#f59e0b20', borderRadius: '999px', display: 'inline-block', fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
              <Award size={12} style={{ display: 'inline', marginRight: 6 }} />
              ISO Clause Certification Awarded
            </div>
          )}
        </div>

        {/* Department impact */}
        {passed && dept && newDept && (
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={14} style={{ color: 'var(--accent-teal)' }} />
              Performance Fed Back to System
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Training Subscore', before: dept.subscores?.training ?? 0, after: newDept.subscores!.training },
                { label: 'Overall Score',     before: dept.score,                    after: newDept.score! },
              ].map(({ label, before, after }) => (
                <div key={label} style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{dept.name} — {label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-muted)' }}>{before}%</span>
                    <ArrowRight size={14} style={{ color: 'var(--accent-teal)' }} />
                    <span style={{ fontSize: '22px', fontWeight: 800, color: after > before ? 'var(--accent-teal)' : '#ef4444' }}>{after}%</span>
                    <span style={{ fontSize: '11px', color: after > before ? 'var(--accent-teal)' : '#ef4444' }}>
                      {after > before ? '+' : ''}{after - before}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
              ↗ Department readiness dashboard has been updated with this training score in real-time.
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {!passed && (
            <button onClick={() => { setAnswers({}); setSubmitted(false); setContentPage(0); setPhase('learn'); }} style={{
              padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', color: 'var(--text-primary)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <RotateCcw size={13} /> Review & Retry
            </button>
          )}
          <button onClick={() => { setPhase('browse'); setActiveModule(null); }} style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none',
            background: 'var(--accent-teal)', color: '#0a0f1e',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>
            Back to Training Centre
          </button>
        </div>
      </div>
    );
  }

  return null;
};
