import React, { useState } from 'react';
import { Search, FileText, ChevronDown, CheckCircle2, FileEdit, AlertTriangle, AlertCircle, Eye, MoreVertical } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentsViewProps {
  documents: DocumentItem[];
  preSelectedDocId?: string;
  onReviewDoc: (docId: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  preSelectedDocId,
  onReviewDoc
}) => {
  const [filter, setFilter] = useState<'all' | 'approved' | 'draft' | 'overdue_review' | 'missing'>('all');
  const [search, setSearch] = useState(preSelectedDocId || '');

  const filteredDocs = documents.filter((doc) => {
    // Search match
    const matchesSearch =
      doc.id.toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.department.toLowerCase().includes(search.toLowerCase()) ||
      doc.isoClause.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Filter match
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  return (
    <div>
      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-pills">
          {(['all', 'approved', 'draft', 'overdue_review', 'missing'] as const).map((item) => (
            <button
              key={item}
              className={`filter-pill ${filter === item ? 'active' : ''}`}
              onClick={() => {
                setFilter(item);
                setSearch(''); // clear search when swapping filters to look neat
              }}
              style={{ textTransform: 'capitalize' }}
            >
              {item === 'overdue_review' ? 'Overdue' : item}
            </button>
          ))}
        </div>

        <div className="search-input-wrapper">
          <Search size={14} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search documents, clauses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Documents Table */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table" id="documents-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '20px' }}>Doc ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Type</th>
                <th>ISO Clause</th>
                <th>Last Reviewed</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No documents match the active search or validation filter.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isDOC007 = doc.id === 'DOC-007';

                  return (
                    <tr
                      key={doc.id}
                      style={{
                        borderLeft: isDOC007 ? '3px solid var(--accent-red)' : '3px solid transparent',
                        backgroundColor: isDOC007 ? 'rgba(239, 68, 68, 0.015)' : 'transparent'
                      }}
                    >
                      <td style={{ paddingLeft: '20px', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '13px', color: isDOC007 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                        {doc.id}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileText size={15} style={{ color: isDOC007 ? 'var(--accent-red)' : 'var(--accent-teal)' }} />
                          <span style={{ fontWeight: 600 }}>{doc.title}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{doc.department}</td>
                      <td>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>
                          {doc.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{doc.isoClause}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{doc.lastReviewed}</td>
                      <td>
                        {doc.status === 'approved' && (
                          <span className="badge badge-green">Approved</span>
                        )}
                        {doc.status === 'draft' && (
                          <span className="badge badge-amber">Draft</span>
                        )}
                        {doc.status === 'overdue_review' && (
                          <span className="badge badge-red">Overdue</span>
                        )}
                        {doc.status === 'missing' && (
                          <span className="badge badge-red" style={{ fontWeight: 700 }}>MISSING</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            className={`btn ${isDOC007 || doc.status === 'overdue_review' ? 'btn-teal' : ''}`}
                            onClick={() => onReviewDoc(doc.id)}
                            style={{ padding: '4px 10px', fontSize: '11.5px', height: '28px' }}
                          >
                            {doc.status === 'missing' ? 'Create' : 'Review'}
                          </button>
                          <button className="icon-button" style={{ height: '28px', width: '28px' }}>
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
