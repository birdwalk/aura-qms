import React from 'react';
import { AlertCircle, ShieldAlert, ShieldCheck, CheckSquare, Settings, Sliders, Key, Network, Database, Layers, Lock } from 'lucide-react';

interface FindingsViewProps {
  findings?: any[];
}

export const FindingsView: React.FC<FindingsViewProps> = ({ findings: propFindings }) => {
  const initialFindings = [
    {
      id: 'AF-001',
      dept: 'Operations (DEPT-004)',
      clause: 'Clause 8.1 - Operational Planning & Control',
      severity: 'Major Nonconformity',
      status: 'Open',
      desc: 'The operations division has failed to produce an approved Operational Control Plan. No robust procedural checklists are current for standard shift handovers.',
      owner: 'PO-004 (Ops Manager)',
      remediation: 'Draft and approve DOC-007 (Operational Control Plan). Conduct Clause 8 competency training for operators.'
    },
    {
      id: 'AF-002',
      dept: 'Procurement (DEPT-006)',
      clause: 'Clause 8.4.1 - Control of Externally Provided Processes',
      severity: 'Major Nonconformity',
      status: 'Open',
      desc: 'Annual evaluation audits of high-risk parts supplier vendors are currently 18 months overdue. No valid assessment records exist since Q3 2024.',
      owner: 'PO-006 (Procurement Mgr)',
      remediation: 'Execute supplier checklist audits for top-5 strategic vendors. Reactivate DOC-005 evaluation guidelines immediately.'
    },
    {
      id: 'AF-003',
      dept: 'Information Technology (DEPT-002)',
      clause: 'Clause 8.1.3 - Change Control Redundancy',
      severity: 'Minor Nonconformity',
      status: 'In Progress',
      desc: 'Server migration records did not log formal user performance validation tests before active system handover.',
      owner: 'PO-002 (ICT Manager)',
      remediation: 'Update central logging guidelines (DOC-004) to mandate recovery test validation checklists.'
    }
  ];

  const findings = propFindings || initialFindings;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h3 className="section-title">
          <ShieldAlert size={16} style={{ color: 'var(--accent-red)' }} />
          Enterprise Audit Findings Tracker
        </h3>
        <p className="section-subtitle">Real-time nonconformities and opportunities for improvement (OFIs)</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="findings-container">
        {findings.map((item) => (
          <div
            key={item.id}
            className="alert-item-card"
            style={{ borderLeft: `4px solid ${item.severity.includes('Major') ? 'var(--accent-red)' : 'var(--accent-amber)'}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-teal)' }}>{item.id}</span>
                <span className="badge badge-teal" style={{ fontSize: '9px' }}>{item.status}</span>
              </div>
              <span className={`badge ${item.severity.includes('Major') ? 'badge-red' : 'badge-amber'}`}>
                {item.severity}
              </span>
            </div>

            <div style={{ marginTop: '8px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.clause}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Department: {item.dept} · Lead Owner: {item.owner}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '8px', lineHeight: '1.5' }}>{item.desc}</p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '10px 14px', borderRadius: '6px', border: '1px dashed var(--border)', marginTop: '8px' }}>
              <strong style={{ fontSize: '12px', color: 'var(--accent-indigo)' }}>Mandated Corrective Actions:</strong>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.remediation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ComplianceClausesView: React.FC = () => {
  const clauses = [
    { num: 'Chapter 4', title: 'Context of the Organisation', score: 92, status: 'Satisfied' },
    { num: 'Chapter 5', title: 'Leadership & Committment', score: 89, status: 'Satisfied' },
    { num: 'Chapter 6', title: 'Quality Planning & Risks', score: 81, status: 'Satisfied' },
    { num: 'Chapter 7', title: 'Support & Process Resources', score: 78, status: 'On Track' },
    { num: 'Chapter 8', title: 'Operational Controls & Execution', score: 58, status: 'Critical Violation' },
    { num: 'Chapter 9', title: 'Performance Evaluation Metrics', score: 73, status: 'On Track' },
    { num: 'Chapter 10', title: 'Continual Improvement Loops', score: 84, status: 'Satisfied' }
  ];

  return (
    <div className="card">
      <h3 className="section-title">
        <ShieldCheck size={16} style={{ color: 'var(--accent-teal)' }} />
        ISO 9001:2015 Clause Index & Verification
      </h3>
      <p className="section-subtitle">Real-time global compliance scores segmented by ISO Chapters</p>

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table" id="compliance-chapters-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '8px' }}>Chapter</th>
              <th>Requirement Title</th>
              <th>Global Score</th>
              <th>Status Badge</th>
              <th>Verification Loop</th>
            </tr>
          </thead>
          <tbody>
            {clauses.map((c, i) => {
              const isCrit = c.score < 60;
              const isSatisfied = c.score >= 80;

              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, paddingLeft: '8px', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>{c.num}</td>
                  <td style={{ fontWeight: 500 }}>{c.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: isCrit ? 'var(--accent-red)' : isSatisfied ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{c.score}%</span>
                      <div className="progress-container" style={{ width: '80px' }}>
                        <div className="progress-bar" style={{ width: `${c.score}%`, backgroundColor: isCrit ? 'var(--accent-red)' : isSatisfied ? 'var(--accent-green)' : 'var(--accent-amber)' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${isCrit ? 'badge-red' : isSatisfied ? 'badge-green' : 'badge-amber'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {isCrit ? '⚠️ 3 Agents checking hourly' : '✓ Agent verified'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cards rows */}
      <div className="two-col-grid-50-50" style={{ marginBottom: 0 }}>
        {/* Card Left: Agent Config */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="section-title">
            <Sliders size={16} style={{ color: 'var(--accent-teal)' }} />
            Foundry Reasoning Agents Parameters
          </h3>
          <p className="section-subtitle">Manage agent execution loops, sample frequency, and confidence thresholds.</p>

          <div className="form-group">
            <label className="form-label">Audit Readiness Agent Scanning Frequency</label>
            <select className="form-select">
              <option value="15">Every 15 Minutes (High Priority)</option>
              <option value="60">Hourly</option>
              <option value="360">Daily</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Compliance Agent Minimum Confidence Threshold</label>
            <select className="form-select">
              <option value="90">90% confidence or greater (Standard)</option>
              <option value="80">80% confidence or greater</option>
              <option value="95">95% confidence (Strict Azure Core policy)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Alert Escalation Channel</label>
            <select className="form-select">
              <option value="teams">Microsoft Teams Adaptive Cards</option>
              <option value="email">Direct Executive Email Brief</option>
              <option value="both">Both Channels Combined</option>
            </select>
          </div>

          <button className="btn btn-teal" style={{ padding: '10px 14px', alignSelf: 'flex-start' }} onClick={() => alert('Agent execution parameters updated!')}>
            Save Agent Policies
          </button>
        </div>

        {/* Card Right: Credentials & Foundry integration */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="section-title">
            <Network size={16} style={{ color: 'var(--accent-indigo)' }} />
            Microsoft Foundry Connectivity Engine
          </h3>
          <p className="section-subtitle">Integration credentials for Azure Fabric databases, cognitive workspaces, and telemetry logs.</p>

          <div className="form-group">
            <label className="form-label">Microsoft Foundry Project Identifier</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="text" className="form-input" value="foundry-project-aura-qms-prod" readOnly style={{ color: 'var(--text-secondary)' }} />
              <Lock size={15} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Azure Fabric Connection Status</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>Active Connected (Sync interval: 5 seconds)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ISO 9001:2015 Semantic Schema Database</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Database size={15} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}>azure-cosmos-db-vector-store</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Submission category</span>
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px' }}>
              Microsoft Agents League — Reasoning Agents Challenge
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
