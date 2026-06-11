import React from 'react';
import { X, ShieldAlert, User, Award, CheckSquare, Target, Activity } from 'lucide-react';
import { DepartmentReadiness } from '../types';

interface DepartmentDetailDrawerProps {
  dept: DepartmentReadiness | null;
  onClose: () => void;
}

export const DepartmentDetailDrawer: React.FC<DepartmentDetailDrawerProps> = ({
  dept,
  onClose
}) => {
  if (!dept) return null;

  let pillClass = 'badge-green';
  if (dept.score < 70) pillClass = 'badge-red';
  else if (dept.score < 85) pillClass = 'badge-amber';

  let riskColor = 'var(--accent-green)';
  if (dept.risk === 'High') riskColor = 'var(--accent-red)';
  else if (dept.risk === 'Medium') riskColor = 'var(--accent-amber)';

  const sub = dept.subscores || { documents: 50, training: 50, audit: 50, process: 50 };

  return (
    <>
      {/* Backdrop */}
      <div className="slide-panel-backdrop" onClick={onClose} />

      {/* Slide tray */}
      <div className="sliding-panel" id="dept-sliding-tray">
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {dept.id} DIVISION PROFILE
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {dept.name}
            </h3>
          </div>
          <button className="icon-button" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
          {/* Main big circle & key info stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', gap: '16px', backgroundColor: 'rgba(255, 255, 255, 0.015)', border: '1px solid var(--border)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', border: '2px solid var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-teal)' }}>
                {dept.score}%
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge ${pillClass}`} style={{ fontSize: '10px' }}>
                  {dept.status}
                </span>
                <span style={{ fontSize: '12px', color: riskColor, fontWeight: 700 }}>
                  {dept.risk} Risk Status
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px', marginTop: '6px' }}>
                <User size={13} />
                <span>{dept.head}</span>
              </div>
            </div>
          </div>

          {/* Detailed synthetic text */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Divisional Overview
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6', backgroundColor: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
              {dept.details || "No complex descriptive notes specified. This sector is actively monitored under high-frequency Microsoft Foundry reasoning audits."}
            </p>
          </div>

          {/* Subdivision scores bar metrics */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Quality Sub-indices
              </h4>
              <span className="badge badge-teal" style={{ fontSize: '9px' }}>4 channels logged</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Documentation coverage</span>
                  <span style={{ fontWeight: 600 }}>{sub.documents}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${sub.documents}%`, backgroundColor: 'var(--accent-teal)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Required Owner training score</span>
                  <span style={{ fontWeight: 600 }}>{sub.training}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${sub.training}%`, backgroundColor: 'var(--accent-teal)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Internal audit checklist score</span>
                  <span style={{ fontWeight: 600 }}>{sub.audit}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${sub.audit}%`, backgroundColor: 'var(--accent-teal)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Core process controls check</span>
                  <span style={{ fontWeight: 600 }}>{sub.process}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${sub.process}%`, backgroundColor: 'var(--accent-teal)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Active findings action trigger check */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Open Deviations
            </h4>
            {dept.openFindings > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '10px 12px', borderRadius: '6px' }}>
                  <ShieldAlert size={15} style={{ color: 'var(--accent-red)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-red)' }}>MAJOR NC: Clause 8 Violation</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Auditor flagged high-risk lack of active compliance plan on Clause {dept.id === 'DEPT-004' ? '8.1' : '8.4.1'}. Corrective training requires completion.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'rgba(34, 197, 94, 0.03)', border: '1px solid rgba(34, 197, 94, 0.1)', padding: '10px 12px', borderRadius: '6px' }}>
                <Target size={15} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                  Zero active findings detected for {dept.name}. Perfect compliance rating.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
