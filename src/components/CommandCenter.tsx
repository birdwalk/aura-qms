import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Activity,
  ChevronRight,
  ShieldAlert,
  Search,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { sendMessageToAura } from '../services/foundryAgent';
import { isLiveMode } from '../config/foundry';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_ACTIVITY_FEED,
  COMPLIANCE_ALERTS,
  READINESS_TREND_DATA,
  INITIAL_CHAT_HISTORY
} from '../data';
import { DepartmentReadiness, AgentActivityItem, ComplianceAlert, ChatMessage } from '../types';

// Count-up animation component using requestAnimationFrame
const CountUp: React.FC<{ end: number; duration?: number }> = ({ end, duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Ease-out cubic calculation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(easeOutCubic(progress) * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}</span>;
};

interface CommandCenterProps {
  onNavigate: (view: any) => void;
  onSelectDepartment: (dept: DepartmentReadiness) => void;
  onSelectDocument: (docId: string) => void;
  departments?: DepartmentReadiness[];
  documents?: any[];
  findings?: any[];
  alerts?: ComplianceAlert[];
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onNavigate,
  onSelectDepartment,
  onSelectDocument,
  departments: propDepartments,
  documents: propDocuments,
  findings: propFindings,
  alerts: propAlerts
}) => {
  const [localDepartments, setLocalDepartments] = useState<DepartmentReadiness[]>(INITIAL_DEPARTMENTS);
  const [activityFeed, setActivityFeed] = useState<AgentActivityItem[]>(INITIAL_ACTIVITY_FEED);
  const [localAlerts, setLocalAlerts] = useState<ComplianceAlert[]>(COMPLIANCE_ALERTS);

  const departments = propDepartments || localDepartments;
  const alerts = propAlerts || localAlerts;

  const dynamicScore = Math.round(departments.reduce((acc, d) => acc + d.score, 0) / departments.length);
  const openFindingsCount = propFindings ? propFindings.filter(f => f.status !== 'Resolved' && f.status !== 'Closed').length : 5;
  const docsAtRiskCount = propDocuments ? propDocuments.filter(d => d.status === 'missing' || d.status === 'overdue_review').length : 3;
  const trainingCompletionPct = Math.round(departments.reduce((acc, d) => acc + (d.subscores?.training || 58), 0) / departments.length);

  // Dynamic filter for active alerts
  const activeAlerts = alerts.filter(alert => {
    if (propDocuments && alert.targetId.startsWith('DOC')) {
      const doc = propDocuments.find(d => d.id === alert.targetId);
      return doc ? doc.status !== 'approved' : true;
    }
    if (propFindings && alert.targetId.startsWith('AF')) {
      const finding = propFindings.find(f => f.id === alert.targetId);
      return finding ? (finding.status !== 'Resolved' && finding.status !== 'Closed') : true;
    }
    return true;
  });
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(INITIAL_CHAT_HISTORY);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Handle Chat Input & Hardcoded Response logic
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // Dynamic keyword matching response generator
    setTimeout(() => {
      setIsTyping(false);
      const query = textToSend.toLowerCase();
      let responseText = '';
      let sources = '';

      if (query.includes('risk') || query.includes('audit')) {
        responseText = `Based on current readiness data, two departments present HIGH audit risk:

🔴 Operations (DEPT-004) — Score: 61%
• Major nonconformity AF-001: No Operational Control Plan (Clause 8.1)
• Process owner training incomplete
• Recommendation: Immediate corrective action required

🔴 Procurement (DEPT-006) — Score: 55%  
• Major nonconformity AF-002: Supplier evaluations 18 months overdue (Clause 8.4.1)
• Document DOC-005 overdue for review
• Recommendation: Escalate to top management this week`;
        sources = 'Sources: audit_findings.json · readiness_scores.json · ISO 9001:2015 §8.1, §8.4.1';
      } else if (query.includes('document') || query.includes('doc')) {
        responseText = `Document Control Agent identified 3 documents requiring action:
  
        • **DOC-007** is missing entirely (Clause 8.1 — high risk) for Operations.
        • **DOC-005** review is 6 months overdue (Clause 8.4.1) for Procurement.
        • **DOC-003** remains in draft status (Clause 7.5) for Quality Management.
        
        Recommendation: Prioritise DOC-007 — it is a prerequisite for the Operational Control Plan required by external auditors.`;
        sources = 'Sources: document_inventory.json · clause_mapping.json · ISO 9001:2015 §8.1, §7.5';
      } else if (query.includes('training') || query.includes('learn')) {
        responseText = `Work IQ signals show PO-004 (Operations Manager) is currently overloaded with 35 meeting hours this week — no training capacity is available.
  
        Recommended action:
        1. Block 2 hours on Thursday morning (lowest meeting density) for ISO Clause 8 focused study.
        2. ISO Learning Path Agent has prepared a 6-week study plan for PO-004 targeting Clauses 8.1, 8.5, and 8.6.`;
        sources = 'Sources: work_iq_signals.json · training_assessment_log.json · ISO 9001:2015 §7.2';
      } else if (query.includes('score') || query.includes('readiness')) {
        responseText = `Current ISO 9001:2015 organizational readiness stand at:
  
        • **HSE**: 91% (Ready - Low Risk)
        • **Quality Management**: 87% (Ready - Low Risk)
        • **Human Resources**: 79% (On Track - Medium Risk)
        • **Information Technology**: 73% (At Risk - Medium Risk)
        • **Operations**: 61% (Not Ready - High Risk)
        • **Procurement**: 55% (Not Ready - High Risk)
        
        Combined Global Audit Readiness Level: **76%**`;
        sources = 'Sources: readiness_scores.json · department_registry.json';
      } else {
        responseText = `I've analysed the query across available compliance data. The most relevant observation relates to our upcoming external audit in 47 days. 
        
        Our current organizational readiness stands at 76%. Both Operations and Procurement are lagging and carrying open major nonconformities. For a full breakdown, try asking about specific departments, documents, or research assessments.`;
        sources = 'Sources: aura_q_intelligence_agent.json · ISO 9001:2015 clauses';
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'aura',
        text: responseText,
        sources: sources
      };

      setChatHistory(prev => [...prev, agentMsg]);
    }, 1500);
  };

  // Agent activity simulation (slowly prepend new reasoning blocks to show live intelligence)
  useEffect(() => {
    const freshSignals: Partial<AgentActivityItem>[] = [
      {
        agentType: 'assessment',
        agentName: 'Assessment Agent',
        actionText: 'Evaluated PO-004 on Clause 8 quiz: Score 57% — threshold failed',
        confidence: 94
      },
      {
        agentType: 'document',
        agentName: 'Document Control Agent',
        actionText: 'Analyzed DOC-003 draft metadata — compliance verified for Clause 6.1',
        confidence: 96
      },
      {
        agentType: 'insights',
        agentName: 'Manager Insights Agent',
        actionText: 'Detected correlation: Operations meeting load directly reduces document updates',
        confidence: 92
      }
    ];

    let checkIndex = 0;
    const interval = setInterval(() => {
      if (checkIndex < freshSignals.length) {
        const template = freshSignals[checkIndex];
        const newFeedItem: AgentActivityItem = {
          id: `sim-${Date.now()}`,
          agentType: template.agentType as any,
          agentName: template.agentName!,
          actionText: template.actionText!,
          timestamp: 'Just now',
          confidence: template.confidence!
        };

        setActivityFeed(prev => [newFeedItem, ...prev.slice(0, 8)]);
        checkIndex++;
      } else {
        clearInterval(interval);
      }
    }, 18000); // add a simulated signal every 18 seconds to keep feed lively

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* ROW 1: Metric Cards */}
      <div className="metrics-row" id="metrics-center">
        {/* Card 1: Org Readiness */}
        <div className="card hoverable" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Org Readiness Score
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                <span className="metric-value-gradient" style={{ fontSize: '32px' }}>
                  <CountUp end={dynamicScore} />%
                </span>
              </div>
            </div>
            {/* Custom SVG Arc representation */}
            <div style={{ width: '42px', height: '42px' }}>
              <svg className="radial-progress-svg" width="100%" height="100%" viewBox="0 0 36 36">
                <path
                  className="radial-progress-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeWidth="3.5"
                />
                <path
                  className="radial-progress-val"
                  strokeDasharray={`${dynamicScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  strokeWidth="3.5"
                />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Overall certification readiness</span>
            <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: '2px' }} /> +4%
            </span>
          </div>
        </div>

        {/* Card 2: Open Findings */}
        <div className="card hoverable" style={{ padding: '16px' }} onClick={() => onNavigate('findings')}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Open Findings</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
              <span className="metric-value-gradient" style={{ fontSize: '32px' }}>{openFindingsCount}</span>
              <span style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: 600 }}>Active NCs</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              2 major · 2 minor · 1 OFI
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                <TrendingDown size={12} style={{ marginRight: '2px' }} /> -1 vs last week
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Documents At Risk */}
        <div className="card hoverable" style={{ padding: '16px' }} onClick={() => onNavigate('documents')}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Documents At Risk</span>
            <div style={{ margin: '4px 0' }}>
              <span className="metric-value-gradient" style={{ fontSize: '32px' }}>{docsAtRiskCount}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Missing, draft, or overdue
            </div>
            <span className="badge badge-amber" style={{ fontSize: '10px' }}>Action required</span>
          </div>
        </div>

        {/* Card 4: Training Completion */}
        <div className="card hoverable" style={{ padding: '16px' }} onClick={() => onNavigate('assessments')}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Training Completion</span>
            <div style={{ margin: '4px 0' }}>
              <span className="metric-value-gradient" style={{ fontSize: '32px' }}>{trainingCompletionPct}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${trainingCompletionPct}%`, backgroundColor: 'var(--accent-teal)' }}></div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Process owners certified</span>
            </div>
          </div>
        </div>

        {/* Card 5: Days to Audit */}
        <div className="card hoverable" style={{ padding: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Days to Audit</span>
            <div style={{ margin: '4px 0' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-amber)' }}>47</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              External audit scheduled
            </div>
            <span className="badge badge-amber" style={{ fontSize: '10px' }}>Clause 8 & 9 Risk</span>
          </div>
        </div>
      </div>

      {/* ROW 2: Department Readiness Grid & Agent Activity Feed */}
      <div className="two-col-grid-60-40">
        {/* LEFT: Department Readiness */}
        <div className="card">
          <h2 className="section-title">
            <ShieldAlert size={16} className="text-teal" style={{ color: 'var(--accent-teal)' }} />
            Department Readiness
          </h2>
          <p className="section-subtitle">ISO 9001:2015 compliance scores by department</p>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" id="departments-landing-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '8px' }}>Department</th>
                  <th>Score</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => {
                  let pillClass = 'badge-green';
                  if (dept.score < 70) pillClass = 'badge-red';
                  else if (dept.score < 85) pillClass = 'badge-amber';

                  let riskColor = 'var(--accent-green)';
                  if (dept.risk === 'High') riskColor = 'var(--accent-red)';
                  else if (dept.risk === 'Medium') riskColor = 'var(--accent-amber)';

                  return (
                    <tr key={dept.id} onClick={() => onSelectDepartment(dept)}>
                      <td style={{ fontWeight: 600, paddingLeft: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{dept.name}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{dept.id}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${pillClass}`} style={{ fontSize: '12px', minWidth: '45px', justifyContent: 'center' }}>
                          {dept.score}%
                        </span>
                      </td>
                      <td style={{ color: riskColor, fontWeight: 600, fontSize: '13px' }}>{dept.risk}</td>
                      <td>
                        <span className={`badge ${
                          dept.status === 'Ready' ? 'badge-green' :
                          dept.status === 'On Track' ? 'badge-indigo' :
                          dept.status === 'At Risk' ? 'badge-amber' : 'badge-red'
                        }`}>
                          {dept.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: dept.trend.includes('−') || dept.trend.includes('↓') ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                        {dept.trend}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Live Agent Activity Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 className="section-title">
              <Activity size={16} style={{ color: 'var(--accent-indigo)' }} />
              Agent Activity
            </h2>
            <span className="badge badge-indigo" style={{ fontSize: '10px' }}>Active</span>
          </div>
          <p className="section-subtitle">Live reasoning feed</p>

          <div className="feed-container" id="agent-logs-feed">
            {activityFeed.map((item) => {
              let dotColor = 'var(--accent-teal)';
              if (item.agentType === 'audit') dotColor = 'var(--accent-indigo)';
              else if (item.agentType === 'document') dotColor = 'var(--accent-amber)';
              else if (item.agentType === 'insights') dotColor = 'var(--accent-indigo)';
              else if (item.agentType === 'learning') dotColor = 'var(--accent-teal)';
              else if (item.agentType === 'assessment') dotColor = 'var(--accent-green)';

              return (
                <div className="feed-item" key={item.id}>
                  <div className="dot-indicator" style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }} />
                  <div className="feed-content">
                    <div className="feed-metadata">
                      <span className="feed-agent-name" style={{ color: item.agentType === 'audit' || item.agentType === 'insights' ? 'var(--accent-indigo)' : 'var(--accent-teal)' }}>
                        {item.agentName}
                      </span>
                      <span className="feed-time">{item.timestamp}</span>
                    </div>
                    <p className="feed-action">{item.actionText}</p>
                    <div className="feed-footer">
                      <span className="badge badge-teal" style={{ fontSize: '9px', padding: '2px 6px', textTransform: 'none', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
                        {item.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 3: Compliance Alerts & Readiness Trend Chart */}
      <div className="two-col-grid-50-50">
        {/* LEFT: Compliance Alerts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 className="section-title">
              <AlertTriangle size={16} style={{ color: 'var(--accent-red)' }} />
              Compliance Alerts
            </h2>
            <span className="badge badge-red" style={{ fontSize: '10px' }}>{activeAlerts.filter(a => a.level === 'CRITICAL').length} critical</span>
          </div>
          <p className="section-subtitle">Real-time nonconformities detected by foundry agents</p>

          <div className="alerts-list">
            {activeAlerts.map((alert) => {
              const isCrit = alert.level === 'CRITICAL';
              return (
                <div
                  className="alert-item-card"
                  key={alert.id}
                  style={{ borderLeft: `3px solid ${isCrit ? 'var(--accent-red)' : 'var(--accent-amber)'}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {alert.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {alert.subtitle}
                      </p>
                    </div>
                    <span className={`badge ${isCrit ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '9px' }}>
                      {alert.level}
                    </span>
                  </div>
                  <button
                    className="btn"
                    style={{ alignSelf: 'flex-start', marginTop: '4px', fontSize: '11.5px', padding: '6px 12px' }}
                    onClick={() => {
                      if (alert.targetId.startsWith('DOC')) {
                        onSelectDocument(alert.targetId);
                      } else {
                        onNavigate('findings');
                      }
                    }}
                  >
                    {alert.targetId.startsWith('DOC') ? 'Review Document →' : 'View Finding →'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Readiness Trend Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="section-title">Readiness Trend</h2>
          <p className="section-subtitle">6-month organisational readiness score</p>

          <div style={{ flex: 1, minHeight: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={READINESS_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <XAxis
                  dataKey="month"
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                />
                <YAxis
                  domain={[60, 100]}
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: 'var(--accent-teal)' }}
                  labelStyle={{ color: 'var(--text-secondary)', fontWeight: 600 }}
                  formatter={(val) => [`${val}% Score`]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--accent-teal)"
                  strokeWidth={2.5}
                  dot={{ r: 4, strokeWidth: 1, fill: 'var(--bg-secondary)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 4: "Ask AURA" AI Chat Interface */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-teal)' }} />
          <h2 className="section-title" style={{ margin: 0 }}>Ask AURA</h2>
          <span className="badge badge-teal" style={{ fontSize: '9px', textTransform: 'lowercase', padding: '1px 6px' }}>
            grounded
          </span>
        </div>
        <p className="section-subtitle">Multi-agent compliance intelligence · Grounded in ISO 9001:2015</p>

        <div className="chat-section">
          {/* Messages Window */}
          <div className="chat-history" id="aura-chat-history">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--accent-teal)' }}>
                  {msg.sender === 'user' ? (
                    <span>YOU</span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={13} />
                      {msg.agentUsed || 'AURA COMPLIANCE SERVICE'}
                      {msg.isDemo && (
                        <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)', fontWeight: 600, marginLeft: '4px' }}>
                          DEMO
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {/* Clean lines parsing for pre-rendered answers */}
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '13.5px', color: 'var(--text-primary)' }}>
                  {msg.text}
                </div>
                {msg.sources && (
                  <div className="chat-sources">
                    {msg.sources}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="suggested-prompts">
            <button
              className="prompt-pill"
              onClick={() => handleSendMessage('Which departments need urgent attention?')}
            >
              Which departments need urgent attention?
            </button>
            <button
              className="prompt-pill"
              onClick={() => handleSendMessage('Show me all open major nonconformities')}
            >
              Show me all open major nonconformities
            </button>
            <button
              className="prompt-pill"
              onClick={() => handleSendMessage('Generate an audit readiness report')}
            >
              Generate an audit readiness report
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(chatInput);
            }}
            className="chat-input-wrapper"
          >
            <MessageSquare size={16} style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about compliance, readiness, documents, or assessments..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="btn btn-teal" style={{ padding: '8px 16px' }} disabled={isTyping}>
              <Send size={14} style={{ marginRight: '4px' }} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
