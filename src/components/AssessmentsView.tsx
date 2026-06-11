import React, { useState } from 'react';
import { Play, ClipboardCheck, Sparkles, AlertCircle, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { AssessmentResult } from '../types';

interface AssessmentsViewProps {
  initialResults: AssessmentResult[];
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({ initialResults }) => {
  const [results, setResults] = useState<AssessmentResult[]>(initialResults);

  // Selector Form state
  const [role, setRole] = useState('Operations Manager');
  const [dept, setDept] = useState('Operations (DEPT-004)');
  const [clause, setClause] = useState('Clause 8.1 - Operational Planning');
  
  // Simulated quiz generation state
  const [launching, setLaunching] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);
  const [newQuizDetails, setNewQuizDetails] = useState<any>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLaunching(true);
    setLaunchSuccess(false);

    // Simulate Agent compiling custom adaptive ISO questionnaire
    setTimeout(() => {
      setLaunching(false);
      setLaunchSuccess(true);
      
      const mockedNewQuizCode = `ISO-ASM-${Math.floor(100 + Math.random() * 900)}`;
      setNewQuizDetails({
        code: mockedNewQuizCode,
        target: role,
        focus: clause,
        questions: 15,
        timeLimit: '25 mins'
      });

      // Add a simulated new pending fail/pass assessment to history for visual richness
      const mockResult: AssessmentResult = {
        id: `asm-${Date.now()}`,
        owner: role.substring(0, 3).toUpperCase() + '-NEW',
        role: role,
        score: Math.floor(65 + Math.random() * 32),
        result: Math.random() > 0.4 ? 'Pass' : 'Fail',
        date: 'Jun 2026'
      };

      setResults(prev => [mockResult, ...prev]);
    }, 1500);
  };

  return (
    <div className="assessments-layout" id="assessments-wrapper">
      {/* LEFT: Assessment launcher form */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 className="section-title">
          <Sparkles size={16} style={{ color: 'var(--accent-teal)' }} />
          Adaptive Assessor
        </h3>
        <p className="section-subtitle" style={{ marginBottom: '12px' }}>
          Compile custom ISO training assessments powered by Microsoft Foundry Reasoning Agents.
        </p>

        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label className="form-label">Select Process Target Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Operations Manager">Operations Manager (PO-004)</option>
              <option value="Procurement Manager">Procurement Manager (PO-006)</option>
              <option value="ICT Manager">ICT Manager (PO-002)</option>
              <option value="HR Manager">HR Manager (PO-005)</option>
              <option value="HSE Manager">HSE Manager (PO-003)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subject Department</label>
            <select className="form-select" value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="Operations (DEPT-004)">Operations (DEPT-004)</option>
              <option value="Procurement (DEPT-006)">Procurement (DEPT-006)</option>
              <option value="Information Technology (DEPT-002)">Information Technology (DEPT-002)</option>
              <option value="Human Resources (DEPT-005)">Human Resources (DEPT-005)</option>
              <option value="HSE (DEPT-003)">HSE (DEPT-003)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">ISO 9001:2015 Clause Focus</label>
            <select className="form-select" value={clause} onChange={(e) => setClause(e.target.value)}>
              <option value="Clause 8.1 - Operational Planning">Clause 8.1 - Operational Planning</option>
              <option value="Clause 8.4 - External Processes">Clause 8.4 - External Processes</option>
              <option value="Clause 7.2 - Competency Training">Clause 7.2 - Competency Training</option>
              <option value="Clause 9.2 - Internal Quality Audits">Clause 9.2 - Internal Quality Audits</option>
              <option value="Clause 6.1 - Risk Control Actions">Clause 6.1 - Risk Control Actions</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-teal"
            style={{ width: '100%', marginTop: '8px', padding: '10px 14px' }}
            disabled={launching}
          >
            {launching ? (
              <>
                <RefreshCw size={14} className="animate-spin" style={{ marginRight: '6px', animation: 'spin 1.5s linear infinite' }} />
                Compiling quiz...
              </>
            ) : (
              <>
                <Play size={14} style={{ marginRight: '6px' }} />
                Generate Assessment
              </>
            )}
          </button>
        </form>

        {/* Real-time Launch details callback feedback */}
        {launchSuccess && newQuizDetails && (
          <div
            className="alert-item-card"
            style={{
              marginTop: '12px',
              borderLeft: '3px solid var(--accent-green)',
              backgroundColor: 'rgba(34, 197, 94, 0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)' }}>
              <CheckCircle size={15} />
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Assessment Dispatched</span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '4px' }}>
              Quiz **{newQuizDetails.code}** focuses on {newQuizDetails.focus}. Sent to <strong>{newQuizDetails.target}</strong>.
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '12px', marginTop: '4px' }}>
              <span>Questions: {newQuizDetails.questions}</span>
              <span>Time: {newQuizDetails.timeLimit}</span>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Recent Assessment Results */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h3 className="section-title">
          <ClipboardCheck size={16} style={{ color: 'var(--accent-indigo)' }} />
          Recent Assessment Results
        </h3>
        <p className="section-subtitle">Process owner competency benchmarks and pass ratios</p>

        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table className="custom-table" id="assessments-results-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '8px' }}>Owner ID</th>
                <th>Role</th>
                <th>Score</th>
                <th>Result</th>
                <th>Date Sent</th>
              </tr>
            </thead>
            <tbody>
              {results.map((asm) => {
                const isPass = asm.result === 'Pass';
                return (
                  <tr key={asm.id}>
                    <td style={{ fontWeight: 600, paddingLeft: '8px', fontFamily: 'var(--font-mono)' }}>{asm.owner}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{asm.role}</td>
                    <td style={{ fontWeight: 700 }}>
                      <span style={{ color: isPass ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {asm.score}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isPass ? 'badge-green' : 'badge-red'}`}>
                        {asm.result}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{asm.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
