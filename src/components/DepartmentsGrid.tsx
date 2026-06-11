import React from 'react';
import { Building2, User, ChevronRight, Award, Flame, AlertCircle } from 'lucide-react';
import { DepartmentReadiness } from '../types';

interface DepartmentsGridProps {
  departments: DepartmentReadiness[];
  onSelectDepartment: (dept: DepartmentReadiness) => void;
}

export const DepartmentsGrid: React.FC<DepartmentsGridProps> = ({
  departments,
  onSelectDepartment
}) => {
  return (
    <div>
      <div className="depts-grid" id="departments-main-grid">
        {departments.map((dept) => {
          let pillClass = 'badge-green';
          if (dept.score < 70) pillClass = 'badge-red';
          else if (dept.score < 85) pillClass = 'badge-amber';

          let riskBg = 'badge-green';
          if (dept.risk === 'High') riskBg = 'badge-red';
          else if (dept.risk === 'Medium') riskBg = 'badge-amber';

          const sub = dept.subscores || { documents: 50, training: 50, audit: 50, process: 50 };

          return (
            <div className="card hoverable" key={dept.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header block */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{dept.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    <User size={13} />
                    <span style={{ fontSize: '12px' }}>{dept.head}</span>
                  </div>
                </div>
                <span className={`badge ${pillClass}`} style={{ fontSize: '14px', padding: '4px 10px' }}>
                  {dept.score}%
                </span>
              </div>

              {/* Sub-scores metrics block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="dept-subscore-row">
                  <div className="dept-subscore-label">
                    <span>Documents Integrity</span>
                    <span>{sub.documents}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${sub.documents}%`, backgroundColor: sub.documents < 70 ? 'var(--accent-red)' : 'var(--accent-teal)' }}></div>
                  </div>
                </div>

                <div className="dept-subscore-row">
                  <div className="dept-subscore-label">
                    <span>Training Completion</span>
                    <span>{sub.training}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${sub.training}%`, backgroundColor: sub.training < 70 ? 'var(--accent-red)' : 'var(--accent-teal)' }}></div>
                  </div>
                </div>

                <div className="dept-subscore-row">
                  <div className="dept-subscore-label">
                    <span>Audit Readiness</span>
                    <span>{sub.audit}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${sub.audit}%`, backgroundColor: sub.audit < 70 ? 'var(--accent-red)' : 'var(--accent-teal)' }}></div>
                  </div>
                </div>

                <div className="dept-subscore-row">
                  <div className="dept-subscore-label">
                    <span>Process Adherence</span>
                    <span>{sub.process}%</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${sub.process}%`, backgroundColor: sub.process < 70 ? 'var(--accent-red)' : 'var(--accent-teal)' }}></div>
                  </div>
                </div>
              </div>

              {/* Badges footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`badge ${riskBg}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                    {dept.risk} Risk
                  </span>
                  <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '2px 8px', fontSize: '10px', border: '1px solid var(--border)' }}>
                    {dept.openFindings} {dept.openFindings === 1 ? 'Finding' : 'Findings'}
                  </span>
                </div>

                <button
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => onSelectDepartment(dept)}
                >
                  View Details <ChevronRight size={13} style={{ marginLeft: '2px' }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
