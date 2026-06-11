import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  GraduationCap,
  Shield,
  BarChart3,
  Settings,
  Bell,
  Sparkles,
  HelpCircle,
  TrendingUp,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Modular child components
import { CommandCenter } from './components/CommandCenter';
import { DepartmentsGrid } from './components/DepartmentsGrid';
import { DocumentsView } from './components/DocumentsView';
import { AssessmentsView } from './components/AssessmentsView';
import { ManagerInsightsView } from './components/ManagerInsightsView';
import { FindingsView, ComplianceClausesView, SettingsView } from './components/ExtraViews';
import { DepartmentDetailDrawer } from './components/DepartmentDetailDrawer';
import { PersonalPortal } from './components/PersonalPortal';
import { TrainingView } from './components/TrainingView';

// Static synthetic data and interfaces
import { INITIAL_DEPARTMENTS, INITIAL_DOCUMENTS, RECENT_ASSESSMENTS, WORKLOAD_SIGNALS } from './data';
import { ViewType, DepartmentReadiness, DocumentItem, AssessmentResult } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('command_center');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentReadiness | null>(null);
  
  // Custom Demo Mode User Roles and Status
  const [userRole, setUserRole] = useState<'QMS' | 'Operations' | 'ICT' | 'HSE' | 'Procurement'>('QMS');

  // compliance central mutable database
  const [departments, setDepartments] = useState<DepartmentReadiness[]>(INITIAL_DEPARTMENTS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [preSelectedDocId, setPreSelectedDocId] = useState<string>('');
  const [assessments, setAssessments] = useState<AssessmentResult[]>(RECENT_ASSESSMENTS);
  const [findingsList, setFindingsList] = useState([
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
  ]);

  // UI Toast notifications or modal indicators
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Auto-expire toast feedback
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Scoped views support helpers
  const getDeptForRole = (role: 'Operations' | 'ICT' | 'HSE' | 'Procurement') => {
    const map = {
      Operations: 'DEPT-004',
      ICT: 'DEPT-002',
      HSE: 'DEPT-003',
      Procurement: 'DEPT-006'
    };
    const deptId = map[role];
    return departments.find((d) => d.id === deptId) || departments[0];
  };

  const getRoleCode = (role: string) => {
    switch (role) {
      case 'Operations': return 'PO-004';
      case 'ICT': return 'PO-002';
      case 'HSE': return 'PO-003';
      case 'Procurement': return 'PO-006';
      default: return 'QMS';
    }
  };

  // State modification transmitters
  const handleUpdateDepartmentScore = (deptId: string, updates: Partial<DepartmentReadiness>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, ...updates } : d))
    );
  };

  const handleUpdateDocumentStatus = (docId: string, status: any) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, status: status, lastReviewed: 'Jun 2026' }
          : doc
      )
    );
  };

  const handleResolveFinding = (findingId: string) => {
    setFindingsList((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status: 'Resolved' } : f))
    );
  };

  const handleAddAssessmentResult = (result: AssessmentResult) => {
    setAssessments((prev) => [result, ...prev]);
  };

  // Role-aware sidebar navigation
  // QMS Manager sees everything. Process Owners see only their own items.
  const isManager = userRole === 'QMS';

  const managerNavItems = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'findings', label: 'Audit Findings', icon: AlertTriangle },
    { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
    { id: 'training', label: 'Training Centre', icon: GraduationCap },
    { id: 'compliance', label: 'Compliance Index', icon: Shield },
    { id: 'manager_insights', label: 'Manager Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const processOwnerNavItems = [
    { id: 'command_center', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'My Documents', icon: FileText },
    { id: 'findings', label: 'My Findings', icon: AlertTriangle },
    { id: 'assessments', label: 'My Assessments', icon: ClipboardCheck },
    { id: 'training', label: 'My Training', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const navItems = isManager ? managerNavItems : processOwnerNavItems;

  // Render view router
  const renderMainViewContent = () => {
    switch (activeView) {
      case 'command_center':
        if (userRole !== 'QMS') {
          return (
            <PersonalPortal
              role={userRole}
              department={getDeptForRole(userRole)}
              documents={documents}
              findingsList={findingsList}
              assessments={assessments}
              onUpdateDepartmentScore={handleUpdateDepartmentScore}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
              onResolveFinding={handleResolveFinding}
              onAddAssessmentResult={handleAddAssessmentResult}
              setToast={setToast}
              onNavigateToView={(view) => {
                if (view === 'command_center') {
                  setUserRole('QMS');
                } else {
                  setActiveView(view);
                }
              }}
            />
          );
        }
        return (
          <CommandCenter
            onNavigate={(view: ViewType) => {
              setActiveView(view);
              setPreSelectedDocId(''); // clean search link
            }}
            onSelectDepartment={(dept) => setSelectedDepartment(dept)}
            onSelectDocument={(docId) => {
              setPreSelectedDocId(docId);
              setActiveView('documents');
            }}
            departments={departments}
            documents={documents}
            findings={findingsList}
          />
        );
      case 'departments':
        return (
          <DepartmentsGrid
            departments={departments}
            onSelectDepartment={(dept) => setSelectedDepartment(dept)}
          />
        );
      case 'documents':
        return (
          <DocumentsView
            documents={userRole === 'QMS' ? documents : documents.filter(doc => doc.department === getDeptForRole(userRole).name)}
            preSelectedDocId={preSelectedDocId}
            onReviewDoc={(docId) => {
              handleUpdateDocumentStatus(docId, 'approved');
              setToast({
                message: `Status updated: ${docId} has been review-approved and validated.`,
                type: 'success'
              });
            }}
          />
        );
      case 'findings':
        return (
          <FindingsView 
            findings={userRole === 'QMS' ? findingsList : findingsList.filter(f => f.owner.includes(getRoleCode(userRole)))} 
          />
        );
      case 'assessments':
        return (
          <AssessmentsView 
            initialResults={userRole === 'QMS' ? assessments : assessments.filter(asm => asm.owner === getRoleCode(userRole))} 
          />
        );
      case 'training':
        return (
          <TrainingView
            departments={departments}
            onUpdateDepartmentScore={handleUpdateDepartmentScore}
            onAddAssessmentResult={handleAddAssessmentResult}
            setToast={setToast}
            userRole={userRole}
          />
        );
      case 'compliance':
        return <ComplianceClausesView />;
      case 'manager_insights':
        return (
          <ManagerInsightsView
            departments={departments}
            workloadSignals={WORKLOAD_SIGNALS}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>
            Selected Microsoft Foundry Agent view is currently compiling...
          </div>
        );
    }
  };

  // Role-aware page titles
  const getRoleLabel = () => {
    switch (userRole) {
      case 'Operations': return 'Operations Manager';
      case 'ICT': return 'ICT Manager';
      case 'HSE': return 'HSE Manager';
      case 'Procurement': return 'Procurement Manager';
      default: return 'QMS Manager';
    }
  };

  const getViewTitle = () => {
    if (!isManager) {
      switch (activeView) {
        case 'command_center': return `My Compliance Portal — ${getRoleLabel()}`;
        case 'documents':      return 'My Documents';
        case 'findings':       return 'My Audit Findings';
        case 'assessments':    return 'My Assessments';
        case 'training':       return 'My ISO Training Centre';
        case 'settings':       return 'Settings';
        default:               return `${getRoleLabel()} Portal`;
      }
    }
    switch (activeView) {
      case 'command_center':    return 'AURA QMS — Compliance Command Center';
      case 'departments':       return 'Divisional Readiness Profile & Subscores';
      case 'documents':         return 'Enterprise Quality Document Repository';
      case 'findings':          return 'Active Audit Findings & Remediation Plans';
      case 'assessments':       return 'Foundry Adaptive Knowledge Assessments';
      case 'training':          return 'Process Training & Competency Centre';
      case 'compliance':        return 'ISO 9001:2015 Clause Compliance Index';
      case 'manager_insights':  return 'Executive Manager Analytics & Workload Signals';
      case 'settings':          return 'AURA System Settings';
      default:                  return 'AURA QMS';
    }
  };

  return (
    <div className="app-container">
      {/* 1. FIXED LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Logo Brand Title Component */}
          <div className="logo-container">
            <div className="logo-dot" />
            <h1 className="logo-text">
              AURA <span>QMS</span>
            </h1>
          </div>

          {/* Role identity card — shows who is logged in */}
          {!isManager && (
            <div style={{
              margin: '0 0 12px 0',
              padding: '10px 12px',
              backgroundColor: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Logged in as
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {getRoleLabel()}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {userRole === 'Operations' ? 'DEPT-004' :
                 userRole === 'ICT' ? 'DEPT-002' :
                 userRole === 'HSE' ? 'DEPT-003' : 'DEPT-006'} · Process Owner
              </div>
            </div>
          )}

          {/* Navigation Links List */}
          <nav>
            <ul className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = activeView === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`nav-item ${isCurrent ? 'active' : ''}`}
                      onClick={() => {
                        setActiveView(item.id);
                        setPreSelectedDocId(''); // reset bridging params
                      }}
                      style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', fontFamily: 'var(--font-sans)' }}
                    >
                      <Icon size={16} />
                      <span style={{ fontSize: '13.5px' }}>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer block */}
        <div className="sidebar-bottom">
          {isManager ? (
            /* Manager: show org-wide readiness score */
            <div className="readiness-pill-container">
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>Org Readiness</span>
              <span className="sidebar-badge" style={{ fontSize: '11px' }}>
                <TrendingUp size={11} />
                {Math.round(departments.reduce((acc, d) => acc + d.score, 0) / departments.length)}% Ready
              </span>
            </div>
          ) : (
            /* Process Owner: show their own department score only */
            <div className="readiness-pill-container">
              <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>My Dept Score</span>
              <span className="sidebar-badge" style={{
                fontSize: '11px',
                backgroundColor: getDeptForRole(userRole as any).score >= 85
                  ? 'rgba(34,197,94,0.15)'
                  : getDeptForRole(userRole as any).score >= 70
                  ? 'rgba(245,158,11,0.15)'
                  : 'rgba(239,68,68,0.15)',
                color: getDeptForRole(userRole as any).score >= 85
                  ? 'var(--accent-green)'
                  : getDeptForRole(userRole as any).score >= 70
                  ? 'var(--accent-amber)'
                  : 'var(--accent-red)',
              }}>
                {getDeptForRole(userRole as any).score}% Ready
              </span>
            </div>
          )}
          <div className="sidebar-powered">
            Powered by Microsoft Foundry
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="main-wrapper">
        
        {/* TOPBAR HEADER BLOCK */}
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="topbar-title" style={{ color: 'var(--text-primary)' }}>{getViewTitle()}</h2>
          </div>
          
          <div className="topbar-right">
            {/* Context switch dropdown for competition judging mode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '6px' }} id="viewing-as-switcher">
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>Viewing as:</span>
              <select
                value={userRole}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setUserRole(val);
                  setActiveView('command_center');
                  setPreSelectedDocId('');
                  setToast({
                    message: val === 'QMS'
                      ? 'Switched to QMS Manager — full organisational dashboard'
                      : `Switched to ${val} Manager — personal compliance portal`,
                    type: 'success'
                  });
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
                className="role-selector-dropdown text-primary"
              >
                <option value="QMS">QMS Manager</option>
                <option value="Operations">Operations Manager (PO-004)</option>
                <option value="ICT">ICT Manager (PO-002)</option>
                <option value="HSE">HSE Manager (PO-003)</option>
                <option value="Procurement">Procurement Manager (PO-006)</option>
              </select>
            </div>

            {/* Agent Live Status dot */}
            <div className="agent-status-indicator" id="agent-online-display">
              <div className="status-dot pulsing" />
              <span>7 agents active</span>
            </div>

            {/* Notification triggers */}
            <button
              className="icon-button"
              onClick={() => {
                if (unreadNotifications > 0) {
                  setUnreadNotifications(0);
                  setToast({ message: 'All critical notifications marked as read.', type: 'info' });
                } else {
                  setUnreadNotifications(3);
                }
              }}
              title="Click to clear signals"
            >
              <Bell size={16} />
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>

            {/* AQ Initial Badge Avatar */}
            <div className="avatar" title="AURA QMS Workspace Operator">
              AQ
            </div>
          </div>
        </header>

        {/* scrollable viewport element */}
        <main className="view-content-area" id="main-scroll-panel">
          {renderMainViewContent()}
        </main>
      </div>

      {/* Slide tray detailed overlay */}
      <DepartmentDetailDrawer
        dept={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />

      {/* Elegant Micro-interaction Toast element */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: 'var(--bg-secondary)',
            borderLeft: `4px solid ${toast.type === 'success' ? 'var(--accent-green)' : 'var(--accent-teal)'}`,
            borderRadius: '4px 8px 8px 4px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 999,
            animation: 'slide-in-right 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          id="system-toast-feedback"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={16} style={{ color: 'var(--accent-green)' }} />
          ) : (
            <AlertCircle size={16} style={{ color: 'var(--accent-teal)' }} />
          )}
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
            {toast.message}
          </span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
