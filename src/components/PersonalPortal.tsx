import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAura } from '../services/foundryAgent';
import {
  ShieldCheck,
  TrendingUp,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  Activity,
  Send,
  MessageSquare,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Check,
  FileCode,
  Shield,
} from 'lucide-react';
import { DepartmentReadiness, DocumentItem, ChatMessage, AssessmentResult } from '../types';

interface PersonalPortalProps {
  role: 'Operations' | 'ICT' | 'HSE' | 'Procurement';
  department: DepartmentReadiness;
  documents: DocumentItem[];
  findingsList: any[];
  assessments: AssessmentResult[];
  onUpdateDepartmentScore: (deptId: string, updates: Partial<DepartmentReadiness>) => void;
  onUpdateDocumentStatus: (docId: string, status: any) => void;
  onResolveFinding: (findingId: string) => void;
  onAddAssessmentResult: (result: AssessmentResult) => void;
  setToast: (toast: { message: string; type: 'success' | 'info' | 'warning' } | null) => void;
  onNavigateToView?: (view: any) => void;
}

// Map roles to their key meta variables
const ROLE_DETAILS = {
  Operations: {
    roleTitle: 'Operations Manager',
    code: 'PO-004',
    clause: 'Clause 8.1 (Operational controls)',
    modules: [
      { id: 'ops-mod-1', name: 'Clause 8.1 - Operational Planning & Control', status: 'completed', score: 90 },
      { id: 'ops-mod-2', name: 'Clause 8.5 - Production & Service Provision', status: 'in_progress', progress: 40 },
      { id: 'ops-mod-3', name: 'Clause 8.6 - Release of Products & Services', status: 'not_started' },
      { id: 'ops-mod-4', name: 'Clause 9.1 - Monitoring & Handover analysis', status: 'not_started' }
    ],
    nextAssessmentTopic: 'Clause 8.1 Operational controls',
    quiz: {
      topic: 'Clause 8.1 - Operational controls quiz',
      questions: [
        {
          q: 'Which document is explicitly missing for operations under Clause 8.1?',
          options: [
            'Supplier standard agreement',
            'Internal audit policy document',
            'Operational Control Plan (DOC-007)',
            'Disaster Recovery protocol'
          ],
          correct: 2,
          explanation: 'DOC-007 (Operational Control Plan) is a vital missing artifact flagged as nonconformant AF-001.'
        },
        {
          q: 'In ISO 9001:2015, what must Clause 8.1 establish?',
          options: [
            'Financial audit intervals',
            'Criteria for processes and product acceptance',
            'Marketing communication metrics',
            'HR code of conduct guidelines'
          ],
          correct: 1,
          explanation: 'Clause 8.1 demands establishing criteria for both processes and product/service acceptance.'
        }
      ]
    }
  },
  ICT: {
    roleTitle: 'ICT Manager',
    code: 'PO-002',
    clause: 'Clause 8.1.3 (Change Control & Redundancy)',
    modules: [
      { id: 'it-mod-1', name: 'Clause 8.1.3 - Change Control Redundancy', status: 'in_progress', progress: 60 },
      { id: 'it-mod-2', name: 'Clause 7.1.3 - Infrastructure & Environments', status: 'completed', score: 85 },
      { id: 'it-mod-3', name: 'Clause 7.5.3 - Control of Documented Information', status: 'not_started' }
    ],
    nextAssessmentTopic: 'Clause 8.1.3 Change controls',
    quiz: {
      topic: 'Clause 8.1.3 - Change control backup quiz',
      questions: [
        {
          q: 'What corrective action is required for server backup compliance?',
          options: [
            'Complete server validation redundancy drills',
            'Order new external hard drives',
            'Hire temporary cloud consultant',
            'Delete older system logs'
          ],
          correct: 0,
          explanation: 'Redundancy backup drills and user validations must be logged according to AF-003.'
        },
        {
          q: 'Which of the following falls under ISO Clause 7.1.3 Infrastructure?',
          options: [
            'Shareholder meeting minutes',
            'Hardware servers, workstations, and software validation',
            'Supplier negotiation guidelines',
            'Social media guidelines'
          ],
          correct: 1,
          explanation: 'Information technology systems, hardware, and server setups represent critical infrastructure components.'
        }
      ]
    }
  },
  HSE: {
    roleTitle: 'HSE Manager',
    code: 'PO-003',
    clause: 'Clause 7.2 (Competency Registers)',
    modules: [
      { id: 'hse-mod-1', name: 'Clause 7.2 - Competency Matrix standards', status: 'completed', score: 95 },
      { id: 'hse-mod-2', name: 'Clause 8.2 - Emergency Response Planning', status: 'completed', score: 91 },
      { id: 'hse-mod-3', name: 'Clause 10.2 - Safety Incident Reporting', status: 'in_progress', progress: 85 }
    ],
    nextAssessmentTopic: 'Clause 10.2 Continual feedback',
    quiz: {
      topic: 'Clause 7.2 & 10.2 - Risk validation quiz',
      questions: [
        {
          q: 'Which document represents your core approved register?',
          options: [
            'Supplier Evaluation Standard',
            'Disaster Recovery Plan',
            'HSE Competency Register (DOC-006)',
            'Operations handbooks'
          ],
          correct: 2,
          explanation: 'DOC-006 is the HSE Competency Register, which keeps HSE at a high compliance rating.'
        },
        {
          q: 'Under ISO 9001:2015, what does competency mandate?',
          options: [
            'Hiring only doctoral candidates',
            'Documented evidence of education, training, or experience',
            'Weekly employee surveys',
            'Strict dress code parameters'
          ],
          correct: 1,
          explanation: 'ISO requires organizations to retain appropriate documented information as evidence of user competence.'
        }
      ]
    }
  },
  Procurement: {
    roleTitle: 'Procurement Manager',
    code: 'PO-006',
    clause: 'Clause 8.4.1 (Externally Provided Controls)',
    modules: [
      { id: 'proc-mod-1', name: 'Clause 8.4.1 - External Supplier audits', status: 'in_progress', progress: 20 },
      { id: 'proc-mod-2', name: 'Clause 8.4.2 - Supplier Scope and Extent of Controls', status: 'not_started' },
      { id: 'proc-mod-3', name: 'Clause 8.4.3 - Information shared with external providers', status: 'not_started' }
    ],
    nextAssessmentTopic: 'Clause 8.4 Vendor Evaluations',
    quiz: {
      topic: 'Clause 8.4 - External supplier audits quiz',
      questions: [
        {
          q: 'Annual strategic vendor checklists are currently how many months overdue?',
          options: ['3 months', '6 months', '12 months', '18 months'],
          correct: 3,
          explanation: 'Strategic assessments are 18 months overdue, leading to the major nonconformity AF-002.'
        },
        {
          q: 'Which document specifies the criteria for vendor approvals?',
          options: [
            'Supplier Evaluation Procedure (DOC-005)',
            'Onboarding Manual',
            'IT Backup policy',
            'Sales projection framework'
          ],
          correct: 0,
          explanation: 'DOC-005 contains the official procedures and scorecard criteria needed to rectify AF-002.'
        }
      ]
    }
  }
} as const;

export const PersonalPortal: React.FC<PersonalPortalProps> = ({
  role,
  department,
  documents,
  findingsList,
  assessments,
  onUpdateDepartmentScore,
  onUpdateDocumentStatus,
  onResolveFinding,
  onAddAssessmentResult,
  setToast,
  onNavigateToView,
}) => {
  const meta = ROLE_DETAILS[role];

  // Scoped documents
  const myDocs = documents.filter((doc) => doc.department === department.name);

  // Scoped findings
  const myFindings = findingsList.filter(
    (f) => f.owner.includes(meta.code) || f.dept.includes(department.name)
  );

  // Scoped assessments
  const myAssessmentsList = assessments.filter(
    (asm) => asm.owner === meta.code || asm.role.toLowerCase().includes(role.toLowerCase())
  );

  // Scoped Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Interactive Quiz State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize Scoped AURA chatbot welcome message on role switch
  useEffect(() => {
    const welcomeText = `Welcome back, ${meta.roleTitle}! 

I have initialized AURA scoped specifically to **${department.name}** and **${meta.clause}**.

Here is my current security & readiness brief for you:
• **Current Score**: ${department.score}% (Status: ${department.status})
• **Critical Alerts**: You have ${myFindings.length} open audit findings.
• **Overdue actions**: ${myDocs.filter(d => d.status === 'missing' || d.status === 'overdue_review').length} document items pending validation.

Ask me anything about drafting templates, resolving findings ${myFindings.map(f => f.id).join(', ') || ''}, or preparing for assessment!`;
    
    setChatHistory([
      {
        id: `pp-welcome-${Date.now()}`,
        sender: 'aura',
        text: welcomeText,
        sources: 'Grounded in: ISO 9001:2015 Chapter 7/8 · Central Compliance Database'
      }
    ]);
  }, [role, department.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Handle interactive document draft/review simulation
  const handleSimulateDocumentResolution = (doc: DocumentItem) => {
    if (doc.status === 'approved') return;

    // Transition from state
    let targetStatus: 'approved' | 'draft' = 'approved';
    onUpdateDocumentStatus(doc.id, targetStatus);

    // Calculate new subscores & overall department score logic
    const oldScore = department.score;
    const isMissing = doc.status === 'missing';
    const increaseAmount = isMissing ? 18 : 10;
    const newScore = Math.min(98, oldScore + increaseAmount);
    
    // Update parent state
    const currentSubscores = department.subscores || { documents: 60, training: 60, audit: 60, process: 60 };
    const newDocSubscore = Math.min(100, currentSubscores.documents + (isMissing ? 30 : 15));
    
    onUpdateDepartmentScore(department.id, {
      score: newScore,
      status: newScore >= 85 ? 'Ready' : newScore >= 70 ? 'On Track' : 'At Risk',
      risk: newScore >= 85 ? 'Low' : newScore >= 70 ? 'Medium' : 'High',
      subscores: {
        ...currentSubscores,
        documents: newDocSubscore
      }
    });

    setToast({
      message: `Document "${doc.id} - ${doc.title}" was submitted and approved by central auditor. Deep AI checks completed.`,
      type: 'success'
    });

    // Append AI conversation intelligence response
    setChatHistory(prev => [
      ...prev,
      {
        id: `pp-sys-${Date.now()}`,
        sender: 'aura',
        text: `🤖 **AURA agent activity logged**: Approved document metadata for **${doc.title}**. We recalculating real-time readiness. 
        
Your direct department readiness index successfully rose from **${oldScore}%** to **${newScore}%**! Information fed upwards to executive dashboard.`,
        sources: 'AURA Quality Intelligence Platform'
      }
    ]);
  };

  // Handle corrective action resolution for findings
  const handleSimulateFindingResolution = (finding: any) => {
    if (finding.status === 'Resolved') return;

    onResolveFinding(finding.id);

    // Increase departmental score (specifically audits subscore)
    const oldScore = department.score;
    const newScore = Math.min(95, oldScore + 12);
    const currSub = department.subscores || { documents: 60, training: 60, audit: 60, process: 60 };
    
    onUpdateDepartmentScore(department.id, {
      score: newScore,
      status: newScore >= 85 ? 'Ready' : newScore >= 70 ? 'On Track' : 'At Risk',
      risk: newScore >= 85 ? 'Low' : newScore >= 70 ? 'Medium' : 'High',
      subscores: {
        ...currSub,
        audit: Math.min(100, currSub.audit + 25)
      }
    });

    setToast({
      message: `Corrective actions validated. Audit finding ${finding.id} marked as RESOLVED!`,
      type: 'success'
    });

    // Feed to chat
    setChatHistory(prev => [
      ...prev,
      {
        id: `pp-sys-f-${Date.now()}`,
        sender: 'aura',
        text: `🎉 Great job! Corrective Action Plan for **${finding.id}** has been successfully parsed and verified by automated audit workflows. 
        
Your audit readiness risk evaluation was updated downwards. Real-time scores shifted from **${oldScore}%** to **${newScore}%**. Outstanding NCs remaining: 0.`,
        sources: 'Manager Insights Sync Agent'
      }
    ]);
  };

  // Submit Scoped AURA chat queries
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const query = textToSend.toLowerCase();
      let responseText = '';
      let sources = 'ISO 9001:2015 Requirements Mapping';

      if (query.includes('finding') || query.includes('remediation') || query.includes('cap') || query.includes('af-')) {
        if (myFindings.length > 0) {
          const mainF = myFindings[0];
          responseText = `To fully remediate nonconformity **${mainF.id}** (${mainF.clause}), we need to fulfill the corrective actions:
          
1. **Develop Document**: Submit and validate corresponding procedures (${mainF.remediation.split('.')[0]}).
2. **Assign Training**: Ensure everyone in **${department.name}** completes the latest chapter learning paths.
3. **Run Drills**: Document at least one audit compliance mock test.

Once done, click the "Address/Remediate" buttons inside your portal to update central registry.`;
        } else {
          responseText = `You currently have NO active audit findings assigned in ${department.name}. Outstanding! Keep maintaining high quality governance.`;
        }
      } else if (query.includes('document') || query.includes('missing') || query.includes('doc-')) {
        const pending = myDocs.filter(d => d.status !== 'approved');
        if (pending.length > 0) {
          responseText = `I detected ${pending.length} documents requiring review or creation in ${department.name}:
          
${pending.map(d => `• **${d.id} - ${d.title}** (${d.status === 'missing' ? 'Missing entirely' : 'Current Draft'}): Scoped to ${d.isoClause}`).join('\n')}

**To resolve**: You can click the "Draft & Submit" button directly on your dashboard. My LLM engine will automatically generate the structural compliant template for your department!`;
        } else {
          responseText = `All documents registered for **${department.name}** are confirmed as Approved. There are zero outstanding gaps.`;
        }
      } else if (query.includes('assessment') || query.includes('test') || query.includes('quiz') || query.includes('learn')) {
        responseText = `Your current personal role track assigns **${meta.modules[0].name}** as primary certification.
        
I highly recommend taking the interactive **Clause Quiz** available in your portal on the right! Upon passing, your training readiness subscore rises immediately, which feeds directly into the master leadership dashboard.`;
      } else if (query.includes('score') || query.includes('readiness') || query.includes('percent')) {
        responseText = `Your department **${department.name}** is at **${department.score}%** compliance readiness. 
        
Breakdown:
• Documents subscore: ${department.subscores?.documents || 60}%
• Staff training competency: ${department.subscores?.training || 60}%
• Audits correctness: ${department.subscores?.audit || 60}%
• Operational Handover processes: ${department.subscores?.process || 60}%`;
      } else {
        responseText = `Hello! As ${meta.roleTitle}, you are responsible for maintaining systems compliant under Clause **${meta.clause}**. 
        
I have full document control and action logs scoped. You can ask me how to:
1. Address and resolve finding ${myFindings[0]?.id || 'gaps'}.
2. Check ISO requirements for Chapter 8 and Chapter 7 support structures.
3. Draft the missing procedural requirements for ${department.name}.`;
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: `aura-res-${Date.now()}`,
          sender: 'aura',
          text: responseText,
          sources: sources
        }
      ]);
    }, 1200);
  };

  // Interactive Quiz Submission
  const handleQuizAnswerSelection = (optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer === meta.quiz.questions[currentQuestionIndex].correct;
    const addedPoints = isCorrect ? 50 : 0;
    const currentPoints = quizScore + addedPoints;

    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQuestionIndex + 1 < meta.quiz.questions.length) {
      setQuizScore(currentPoints);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed Quiz!
      const finalScore = currentPoints;
      setQuizScore(finalScore);
      setQuizSubmitted(true);

      // Save/Publish state updates to parent
      const resultObj: AssessmentResult = {
        id: `asm-pp-${Date.now()}`,
        owner: meta.code,
        role: meta.roleTitle,
        score: finalScore,
        result: finalScore >= 50 ? 'Pass' : 'Fail',
        date: 'Jun 2026'
      };

      onAddAssessmentResult(resultObj);

      if (finalScore >= 50) {
        // Boost training subscores
        const currentSubscores = department.subscores || { documents: 60, training: 60, audit: 60, process: 60 };
        const oldScore = department.score;
        const newScore = Math.min(99, oldScore + 15);
        
        onUpdateDepartmentScore(department.id, {
          score: newScore,
          status: newScore >= 85 ? 'Ready' : newScore >= 70 ? 'On Track' : 'At Risk',
          risk: newScore >= 85 ? 'Low' : newScore >= 70 ? 'Medium' : 'High',
          subscores: {
            ...currentSubscores,
            training: 95
          }
        });

        setToast({
          message: `Congratulations! Assessment completed with ${finalScore}% Score. ISO training updated!`,
          type: 'success'
        });

        setChatHistory(prev => [
          ...prev,
          {
            id: `asm-res-log-${Date.now()}`,
            sender: 'aura',
            text: `🎓 **ISO Competency Verified!** 
            
You scored **${finalScore}%** on your adaptive Knowledge Certification!
Your training subscore leaped to **95%**.
Your department overall readiness boosted from **${oldScore}%** to **${newScore}%**. 
All audit profiles updated dynamically in real time and synced with the central QMS registry!`,
            sources: 'Auditor Learning Validation Engine'
          }
        ]);
      } else {
        setToast({
          message: `Assessment completed. Score: ${finalScore}%. Passing threshold is 50%.`,
          type: 'warning'
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setShowExplanation(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* REAL-TIME NOTICE BAR */}
      <div
        style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          animation: 'fade-in 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={18} style={{ color: 'var(--accent-indigo)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 500 }}>
            Viewing personal portal for <strong style={{ color: 'var(--accent-indigo)' }}>{meta.roleTitle}</strong> ({meta.code} · {department.name}). 
            Your activity updates the management dashboard in real time via the Manager Insights Agent.
          </span>
        </div>
        <span
          className="badge badge-indigo"
          style={{ cursor: 'pointer', fontSize: '10.5px' }}
          onClick={() => onNavigateToView?.('command_center')}
        >
          View Central QMS →
        </span>
      </div>

      {/* PORTAL CORE BENTO GRID */}
      <div className="two-col-grid-60-40" style={{ marginBottom: 0 }}>
        
        {/* LEFT COMPONENT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. STATE & READINESS SCORE */}
          <div className="card hoverable" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-indigo" style={{ fontSize: '11px', marginBottom: '8px' }}>
                  {department.id} · {department.name}
                </span>
                <h3 className="section-title" style={{ marginTop: '4px' }}>My Divisional Readiness Score</h3>
                <p className="section-subtitle">Real-time localized ISO 9001 compliance rating</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="metric-value-gradient" style={{ fontSize: '48px', lineHeight: 1 }}>
                  {department.score}%
                </span>
                <div style={{ color: department.score >= 85 ? 'var(--accent-green)' : department.score >= 70 ? 'var(--accent-amber)' : 'var(--accent-red)', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>
                  Status: {department.status}
                </div>
              </div>
            </div>

            {/* Subscore bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '18px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Quality Documents</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{department.subscores?.documents || 60}%</strong>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${department.subscores?.documents || 60}%`, backgroundColor: 'var(--accent-teal)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Staff Competency</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{department.subscores?.training || 60}%</strong>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${department.subscores?.training || 60}%`, backgroundColor: 'var(--accent-indigo)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Internal Audits</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{department.subscores?.audit || 60}%</strong>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${department.subscores?.audit || 60}%`, backgroundColor: 'var(--accent-amber)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Process Handovers</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{department.subscores?.process || 80}%</strong>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${department.subscores?.process || 80}%`, backgroundColor: 'var(--accent-green)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 2. MY DOCUMENTS */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 className="section-title">
                  <FileText size={16} className="text-teal" style={{ color: 'var(--accent-teal)' }} />
                  My Owned Quality Documents
                </h3>
                <p className="section-subtitle">Manage, draft, and review compliance manuals assigned to your division</p>
              </div>
              <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                {myDocs.length} total
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '8px' }}>Doc Code & Title</th>
                    <th>ISO Chapter</th>
                    <th>Status</th>
                    <th>Last Reviewed</th>
                    <th style={{ textAlign: 'right' }}>Audited Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myDocs.map((doc) => {
                    let isPending = doc.status !== 'approved';
                    return (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 600, paddingLeft: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <FileCode size={14} style={{ color: isPending ? 'var(--accent-amber)' : 'var(--accent-green)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '13px' }}>{doc.title}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.id} · {doc.type}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}>{doc.isoClause}</td>
                        <td>
                          <span className={`badge ${
                            doc.status === 'approved' ? 'badge-green' :
                            doc.status === 'draft' ? 'badge-indigo' :
                            doc.status === 'overdue_review' ? 'badge-amber' : 'badge-red'
                          }`} style={{ fontSize: '10px' }}>
                            {doc.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{doc.lastReviewed}</td>
                        <td style={{ textAlign: 'right' }}>
                          {isPending ? (
                            <button
                              className="btn btn-teal"
                              style={{ fontSize: '11px', padding: '5px 10px' }}
                              onClick={() => handleSimulateDocumentResolution(doc)}
                            >
                              Draft & Approve
                            </button>
                          ) : (
                            <span style={{ color: 'var(--accent-green)', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={12} /> Approved
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. MY AUDIT FINDINGS */}
          <div className="card">
            <h3 className="section-title">
              <AlertTriangle size={16} style={{ color: 'var(--accent-red)' }} />
              My Audit Findings & Urgent Gaps
            </h3>
            <p className="section-subtitle">Required corrective action logs from registrars</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {myFindings.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--accent-green)', margin: '0 auto 8px auto' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Perfect Compliance State!</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your division has no active major or minor nonconformities.</p>
                </div>
              ) : (
                myFindings.map((finding) => {
                  const isResolved = finding.status === 'Resolved' || finding.status === 'Closed';
                  return (
                    <div
                      key={finding.id}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border)',
                        borderLeft: `4px solid ${isResolved ? 'var(--accent-green)' : 'var(--accent-red)'}`,
                        borderRadius: '0 8px 8px 0',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)' }}>{finding.id}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span className={`badge ${isResolved ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '9px' }}>
                            {finding.severity || 'Major NC'}
                          </span>
                          <span className={`badge ${isResolved ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '9px' }}>
                            {finding.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{finding.clause}</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>{finding.desc}</p>
                      </div>

                      <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border)', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                        <div>
                          <strong style={{ fontSize: '11px', color: 'var(--accent-indigo)' }}>Remediation Action Required:</strong>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{finding.remediation}</p>
                        </div>
                        {!isResolved && (
                          <button
                            className="btn btn-teal"
                            style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                            onClick={() => handleSimulateFindingResolution(finding)}
                          >
                            Resolve NC Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 4. MY LEARNING PATH */}
          <div className="card">
            <h3 className="section-title">
              <BookOpen size={16} style={{ color: 'var(--accent-indigo)' }} />
              My Assigned Learning Path
            </h3>
            <p className="section-subtitle">Complete to certify compliance competency</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {meta.modules.map((mod) => (
                <div
                  key={mod.id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{mod.name}</span>
                    {mod.status === 'completed' ? (
                      <span className="badge badge-green" style={{ fontSize: '9px' }}>Certified ({mod.score}%)</span>
                    ) : mod.status === 'in_progress' ? (
                      <span className="badge badge-amber" style={{ fontSize: '9px' }}>In Progress ({mod.progress}%)</span>
                    ) : (
                      <span className="badge badge-gray" style={{ fontSize: '9px' }}>Locked</span>
                    )}
                  </div>

                  {mod.status === 'in_progress' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="progress-container" style={{ flex: 1, height: '6px' }}>
                        <div className="progress-bar" style={{ width: `${mod.progress}%`, backgroundColor: 'var(--accent-amber)' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{mod.progress}%</span>
                    </div>
                  )}

                  {mod.status === 'completed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '11.5px' }}>
                      <Award size={13} /> Completed training verified by LMS.
                    </div>
                  )}
                  
                  {mod.status === 'not_started' && (
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Prerequisite module active.</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. MY ASSESSMENTS & ADAPTIVE QUIZ */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="section-title">
                <ClipboardCheck size={16} style={{ color: 'var(--accent-indigo)' }} />
                My Assessments
              </h3>
              <span className="badge badge-indigo" style={{ fontSize: '9px' }}>Grounded</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Active Quiz Action Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '12px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={15} style={{ color: 'var(--accent-teal)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Training Requisite
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{meta.quiz.topic}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '14px' }}>
                  Fulfill this adaptive knowledge matrix to pass training requirements and increase your division score.
                </p>

                {showQuizModal ? (
                  /* INLINE INTERACTIVE QUIZ INTERFACE */
                  <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', marginTop: '10px' }}>
                    {!quizSubmitted ? (
                      <div>
                        {/* Progress */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          <span>Question {currentQuestionIndex + 1} of {meta.quiz.questions.length}</span>
                          <span>Score: {quizScore} pts</span>
                        </div>
                        
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                          {meta.quiz.questions[currentQuestionIndex].q}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {meta.quiz.questions[currentQuestionIndex].options.map((option, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrect = idx === meta.quiz.questions[currentQuestionIndex].correct;
                            let btnBg = 'rgba(255,255,255,0.02)';
                            let btnBorder = 'var(--border)';
                            
                            if (showExplanation) {
                              if (isCorrect) {
                                btnBg = 'rgba(20, 184, 166, 0.1)';
                                btnBorder = 'var(--accent-teal)';
                              } else if (isSelected) {
                                btnBg = 'rgba(239, 68, 68, 0.1)';
                                btnBorder = 'var(--accent-red)';
                              }
                            } else if (isSelected) {
                              btnBg = 'rgba(99, 102, 241, 0.15)';
                              btnBorder = 'var(--accent-indigo)';
                            }

                            return (
                              <button
                                key={idx}
                                style={{
                                  backgroundColor: btnBg,
                                  border: `1px solid ${btnBorder}`,
                                  borderRadius: '6px',
                                  padding: '10px 12px',
                                  fontSize: '12.5px',
                                  color: 'var(--text-primary)',
                                  textAlign: 'left',
                                  cursor: quizSubmitted ? 'default' : 'pointer',
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                                onClick={() => handleQuizAnswerSelection(idx)}
                                disabled={showExplanation}
                              >
                                <span>{option}</span>
                                {showExplanation && isCorrect && <Check size={14} style={{ color: 'var(--accent-teal)' }} />}
                                {showExplanation && isSelected && !isCorrect && <X size={14} style={{ color: 'var(--accent-red)' }} />}
                              </button>
                            );
                          })}
                        </div>

                        {showExplanation && (
                          <div style={{ marginTop: '12px', fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '4px', borderLeft: '2px solid var(--accent-teal)' }}>
                              {meta.quiz.questions[currentQuestionIndex].explanation}
                            </div>
                            <button
                              className="btn btn-indigo"
                              style={{ padding: '6px 12px', fontSize: '11px', alignSelf: 'flex-end' }}
                              onClick={handleNextQuestion}
                            >
                              {currentQuestionIndex + 1 < meta.quiz.questions.length ? 'Next Question →' : 'Finish Quiz ✓'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* RESULT CONTAINER */
                      <div style={{ textAlign: 'center', padding: '14px 0' }}>
                        <Award size={36} style={{ color: 'var(--accent-teal)', margin: '0 auto 10px auto' }} />
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Certification Cleared!</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          You scored **{quizScore}/100** points and fulfilled compliance training standards for Chapter 8.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '14px' }}>
                          <button className="btn" style={{ fontSize: '11px', padding: '6px 10px' }} onClick={handleResetQuiz}>
                            <RotateCcw size={12} style={{ marginRight: '4px' }} /> Retake
                          </button>
                          <button className="btn btn-teal" style={{ fontSize: '11px', padding: '6px 10px' }} onClick={() => setShowQuizModal(false)}>
                            Close Profile
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-indigo w-full"
                    style={{ justifySelf: 'center', gap: '6px' }}
                    onClick={() => {
                      handleResetQuiz();
                      setShowQuizModal(true);
                    }}
                  >
                    <Play size={12} style={{ fill: 'currentColor' }} /> Start Competency Quiz
                  </button>
                )}
              </div>

              {/* Quiz History List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <span style={{ fontSize: '11.5px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Completion History
                </span>
                
                {myAssessmentsList.length === 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No historical assessment sessions found.</span>
                ) : (
                  myAssessmentsList.map((asm) => (
                    <div
                      key={asm.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12.5px',
                        backgroundColor: 'rgba(255,255,255,0.01)',
                        border: '1px solid var(--border)',
                        padding: '8px 12px',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{asm.role}</span>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Date: {asm.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{asm.score}%</span>
                        <span className={`badge ${asm.result === 'Pass' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                          {asm.result}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 6. ASK AURA CHAT */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-teal)' }} />
              <h3 className="section-title" style={{ margin: 0 }}>Ask AURA Scoped Assistant</h3>
              <span className="badge badge-teal" style={{ fontSize: '9px', textTransform: 'lowercase', padding: '1px 5px' }}>
                grounded
              </span>
            </div>
            <p className="section-subtitle">Grounded compliance advisor for {department.name}</p>

            <div className="chat-section" style={{ minHeight: '340px' }}>
              
              {/* Chat History Container */}
              <div className="chat-history" id="personal-portal-chat-history" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'}`}
                    style={{ padding: '10px 12px', marginBottom: '8px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--accent-teal)' }}>
                      {msg.sender === 'user' ? (
                        <span>YOU</span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} /> Scoped AURA Assistant
                        </span>
                      )}
                    </div>
                    
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {msg.text}
                    </div>

                    {msg.sources && (
                      <div className="chat-sources" style={{ fontSize: '10px', marginTop: '6px' }}>
                        {msg.sources}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="typing-indicator" style={{ padding: '6px' }}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Scoped Pill options for quick assistance */}
              <div className="suggested-prompts" style={{ gap: '6px', marginBottom: '8px' }}>
                {role === 'Operations' && (
                  <>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('How do I resolve AF-001?')}>
                      How do I resolve AF-001?
                    </button>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('Draft Operational Control Plan DOC-007')}>
                      Draft Operational Control Plan DOC-007
                    </button>
                  </>
                )}
                {role === 'Procurement' && (
                  <>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('How to remediate AF-002 supplier review?')}>
                      How to remediate AF-002 supplier review?
                    </button>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('What is required under Clause 8.4.1?')}>
                      What is required under Clause 8.4.1?
                    </button>
                  </>
                )}
                {role === 'ICT' && (
                  <>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('Show server validation backups checklist?')}>
                      Show server validation backups checklist?
                    </button>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('Draft feedback checklist for DOC-004')}>
                      Draft feedback checklist for DOC-004
                    </button>
                  </>
                )}
                {role === 'HSE' && (
                  <>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('Verify Clause 7.2 audit logs competency')}>
                      Verify Clause 7.2 audit logs competency
                    </button>
                    <button className="prompt-pill" style={{ fontSize: '11.5px', padding: '4px 10px' }} onClick={() => handleSendMessage('Ensure emergency compliance registers are validated')}>
                      Ensure emergency registers are validated
                    </button>
                  </>
                )}
              </div>

              {/* Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(chatInput);
                }}
                className="chat-input-wrapper"
                style={{ padding: '6px 12px' }}
              >
                <MessageSquare size={14} style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask scoped compliance questions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isTyping}
                  style={{ fontSize: '12.5px' }}
                />
                <button type="submit" className="btn btn-teal" style={{ padding: '6px 12px', fontSize: '11.5px' }} disabled={isTyping}>
                  Send
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
