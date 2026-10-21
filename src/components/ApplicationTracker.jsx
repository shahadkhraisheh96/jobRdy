import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  Trophy, 
  ChevronRight,
  Kanban,
  Table as TableIcon,
  X,
  Calendar,
  DollarSign,
  MapPin,
  TrendingUp,
  Percent
} from 'lucide-react';
import { APPLICATION_STATUS_OPTIONS } from '../data/sampleData';
import confetti from 'canvas-confetti';

export default function ApplicationTracker({ 
  applications, 
  onUpdateStatus, 
  onAddApplication, 
  onDeleteApplication,
  onEditApplication,
  onSelectForCvTailor,
  onSelectForInterview
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // New Application Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    salary: '',
    location: '',
    appliedDate: new Date().toISOString().split('T')[0],
    url: '',
    atsScore: 85,
    notes: ''
  });

  // Filtered and Sorted Applications
  const filteredApps = useMemo(() => {
    return applications
      .filter(app => {
        const matchesSearch = 
          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.notes && app.notes.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.appliedDate) - new Date(a.appliedDate);
        if (sortBy === 'date-asc') return new Date(a.appliedDate) - new Date(b.appliedDate);
        if (sortBy === 'score-desc') return (b.atsScore || 0) - (a.atsScore || 0);
        if (sortBy === 'company') return a.company.localeCompare(b.company);
        return 0;
      });
  }, [applications, searchQuery, statusFilter, sortBy]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(a => 
      ['Applied', 'HR Screening', 'Technical Interview', 'Final Round'].includes(a.status)
    ).length;
    const offers = applications.filter(a => a.status === 'Offer Received').length;
    const avgScore = total > 0 
      ? Math.round(applications.reduce((acc, a) => acc + (a.atsScore || 80), 0) / total) 
      : 0;

    return { total, active, offers, avgScore };
  }, [applications]);

  const handleStatusChange = (appId, newStatus) => {
    onUpdateStatus(appId, newStatus);
    if (newStatus === 'Offer Received') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleOpenAddModal = (app = null) => {
    if (app) {
      setEditingApp(app);
      setFormData({ ...app });
    } else {
      setEditingApp(null);
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        salary: '',
        location: '',
        appliedDate: new Date().toISOString().split('T')[0],
        url: '',
        atsScore: 85,
        notes: ''
      });
    }
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    if (editingApp) {
      onEditApplication({ ...formData, id: editingApp.id });
    } else {
      onAddApplication({
        ...formData,
        id: `app-${Date.now()}`
      });
      if (formData.status === 'Offer Received') {
        confetti({ particleCount: 70, spread: 60 });
      }
    }
    setShowAddModal(false);
  };

  const exportCsv = () => {
    const headers = ['Company', 'Role', 'Status', 'Applied Date', 'Salary', 'Location', 'ATS Score', 'Job URL', 'Notes'];
    const rows = filteredApps.map(a => [
      `"${a.company.replace(/"/g, '""')}"`,
      `"${a.role.replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${a.appliedDate}"`,
      `"${a.salary || ''}"`,
      `"${a.location || ''}"`,
      `"${a.atsScore || ''}"`,
      `"${a.url || ''}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JobRdy_Applications_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="tab-page-container tracker-page">
      {/* Top Banner & Stats Overview */}
      <div className="page-header-banner no-print">
        <div className="header-text-content">
          <div className="badge-pill">
            <Layers size={14} />
            <span>Application Ledger & Pipeline</span>
          </div>
          <h1>Job Applications Document & Status Tracker</h1>
          <p>
            Track every job you have applied for, change interview stages in real-time, link tailored ATS resumes, and monitor your career pipeline.
          </p>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="stats-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Tracked</span>
            <span className="kpi-value">{stats.total}</span>
          </div>
          <div className="kpi-card active-interviews">
            <span className="kpi-label">Active Pipeline</span>
            <span className="kpi-value">{stats.active}</span>
          </div>
          <div className="kpi-card offers-card">
            <span className="kpi-label">Offers Received</span>
            <span className="kpi-value text-emerald">{stats.offers}</span>
            <Trophy size={14} className="trophy-icon text-emerald" />
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Avg. ATS Match</span>
            <span className="kpi-value">{stats.avgScore}%</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Modes, Add Button */}
      <div className="tracker-control-bar no-print">
        <div className="control-left-group">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by company, role, or notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown-wrapper">
            <Filter size={15} className="filter-icon" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter-select"
            >
              <option value="ALL">All Statuses ({applications.length})</option>
              {APPLICATION_STATUS_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest ATS Score</option>
            <option value="company">Company (A-Z)</option>
          </select>
        </div>

        <div className="control-right-group">
          {/* View Mode Toggle: Table vs Kanban */}
          <div className="view-toggle-capsule">
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Document / Table Spreadsheet View"
            >
              <TableIcon size={15} />
              <span>Ledger</span>
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <Kanban size={15} />
              <span>Pipeline</span>
            </button>
          </div>

          {/* Export CSV */}
          <button 
            className="btn-secondary" 
            onClick={exportCsv}
            title="Export applications to CSV / Excel spreadsheet"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {/* Add Application CTA */}
          <button 
            className="btn-primary-gradient"
            onClick={() => handleOpenAddModal()}
          >
            <Plus size={16} />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Main Content: Table / Document Spreadsheet View */}
      {viewMode === 'table' ? (
        <div className="tracker-table-card glass-card no-print">
          <div className="table-responsive-wrapper">
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Company & Role</th>
                  <th>Status (Changeable)</th>
                  <th>Date Applied</th>
                  <th>Salary & Location</th>
                  <th>ATS Match</th>
                  <th>Notes & Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => {
                    const statusOpt = APPLICATION_STATUS_OPTIONS.find(s => s.id === app.status) || APPLICATION_STATUS_OPTIONS[0];

                    return (
                      <tr key={app.id} className="ledger-row">
                        {/* Company & Role */}
                        <td className="col-company">
                          <div className="company-info-cell">
                            <span className="company-name">{app.company}</span>
                            <span className="role-title">{app.role}</span>
                            {app.url && (
                              <a 
                                href={app.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="job-url-link"
                              >
                                <ExternalLink size={12} />
                                <span>Posting</span>
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="col-status">
                          <div className="status-select-container">
                            <select 
                              className="interactive-status-select"
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              style={{ 
                                color: statusOpt.color, 
                                borderColor: statusOpt.color,
                                backgroundColor: statusOpt.bg 
                              }}
                            >
                              {APPLICATION_STATUS_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.icon} {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Date Applied */}
                        <td className="col-date">
                          <span className="date-text">
                            <Calendar size={13} className="text-muted" />
                            {app.appliedDate || '—'}
                          </span>
                        </td>

                        {/* Salary & Location */}
                        <td className="col-comp">
                          <div className="comp-cell">
                            {app.salary && (
                              <span className="salary-tag">
                                <DollarSign size={12} /> {app.salary}
                              </span>
                            )}
                            {app.location && (
                              <span className="location-tag">
                                <MapPin size={12} /> {app.location}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* ATS Score */}
                        <td className="col-score">
                          {app.atsScore ? (
                            <span 
                              className="ats-badge"
                              style={{ 
                                backgroundColor: app.atsScore >= 85 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: app.atsScore >= 85 ? 'var(--accent-emerald)' : 'var(--accent-primary)'
                              }}
                            >
                              <Percent size={12} />
                              {app.atsScore}%
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        {/* Notes & Row Actions */}
                        <td className="col-actions">
                          <div className="actions-cell">
                            <p className="app-notes-snippet" title={app.notes}>
                              {app.notes || 'No notes added.'}
                            </p>
                            <div className="row-action-buttons">
                              {/* Jump to CV */}
                              <button 
                                className="row-btn" 
                                title="Tailor CV for this company"
                                onClick={() => onSelectForCvTailor && onSelectForCvTailor(app)}
                              >
                                <FileText size={14} />
                              </button>
                              {/* Jump to Interview */}
                              <button 
                                className="row-btn" 
                                title="Prepare interview questions"
                                onClick={() => onSelectForInterview && onSelectForInterview(app)}
                              >
                                <HelpCircle size={14} />
                              </button>
                              {/* Edit Modal */}
                              <button 
                                className="row-btn" 
                                title="Edit details"
                                onClick={() => handleOpenAddModal(app)}
                              >
                                <Edit3 size={14} />
                              </button>
                              {/* Delete */}
                              <button 
                                className="row-btn text-rose" 
                                title="Delete application"
                                onClick={() => onDeleteApplication(app.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-table-state">
                      <Sparkles size={28} className="text-muted" />
                      <p>No applications match your filter or search criteria.</p>
                      <button 
                        className="btn-accent-gradient"
                        onClick={() => handleOpenAddModal()}
                      >
                        <Plus size={15} /> Add Application
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div className="kanban-pipeline-board no-print">
          {APPLICATION_STATUS_OPTIONS.map((statusOpt) => {
            const columnApps = filteredApps.filter(a => a.status === statusOpt.id);

            return (
              <div key={statusOpt.id} className="kanban-column glass-card">
                <div className="kanban-column-header">
                  <div className="col-title-group">
                    <span className="status-emoji">{statusOpt.icon}</span>
                    <span className="col-title">{statusOpt.label}</span>
                  </div>
                  <span className="col-count-badge" style={{ backgroundColor: statusOpt.bg, color: statusOpt.color }}>
                    {columnApps.length}
                  </span>
                </div>

                <div className="kanban-cards-stack">
                  {columnApps.length > 0 ? (
                    columnApps.map((app) => (
                      <div key={app.id} className="kanban-item-card">
                        <div className="card-top-row">
                          <span className="kanban-company">{app.company}</span>
                          {app.atsScore && (
                            <span className="kanban-score-pill">{app.atsScore}%</span>
                          )}
                        </div>
                        <h4 className="kanban-role">{app.role}</h4>

                        {app.salary && (
                          <div className="kanban-meta-item">
                            <DollarSign size={12} />
                            <span>{app.salary}</span>
                          </div>
                        )}

                        {app.notes && (
                          <p className="kanban-notes">{app.notes}</p>
                        )}

                        {/* Quick Advance Status Dropdown */}
                        <div className="kanban-status-footer">
                          <select 
                            className="kanban-status-dropdown"
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          >
                            {APPLICATION_STATUS_OPTIONS.map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
                            ))}
                          </select>

                          <div className="kanban-mini-actions">
                            <button 
                              className="mini-icon-btn" 
                              title="Edit"
                              onClick={() => handleOpenAddModal(app)}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button 
                              className="mini-icon-btn text-rose" 
                              title="Delete"
                              onClick={() => onDeleteApplication(app.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="kanban-empty-slot">
                      <span>No jobs in {statusOpt.label}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Application Modal */}
      {showAddModal && (
        <div className="modal-backdrop no-print" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Sparkles size={18} className="text-accent" />
                <h3>{editingApp ? 'Edit Job Application' : 'Log New Job Application'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="input-grid-2">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Stripe, Apple, Google"
                    className="custom-input"
                  />
                </div>
                <div className="form-group">
                  <label>Role / Job Title *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="input-grid-2">
                <div className="form-group">
                  <label>Current Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="custom-select"
                  >
                    {APPLICATION_STATUS_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date Applied</label>
                  <input 
                    type="date" 
                    value={formData.appliedDate}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="input-grid-2">
                <div className="form-group">
                  <label>Salary Range / Compensation</label>
                  <input 
                    type="text" 
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $160,000 - $190,000"
                    className="custom-input"
                  />
                </div>
                <div className="form-group">
                  <label>Location / Work Mode</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote (US) / San Francisco"
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="input-grid-2">
                <div className="form-group">
                  <label>Job Posting URL</label>
                  <input 
                    type="url" 
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="custom-input"
                  />
                </div>
                <div className="form-group">
                  <label>ATS Match Score (%)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={formData.atsScore}
                    onChange={(e) => setFormData({ ...formData, atsScore: parseInt(e.target.value) || 0 })}
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Interview Notes / Next Steps</label>
                <textarea 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Recruiter screen scheduled for Tuesday, highlight Kubernetes experience..."
                  className="custom-textarea"
                />
              </div>

              <div className="modal-actions-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary-gradient"
                >
                  <CheckCircle2 size={16} />
                  <span>{editingApp ? 'Save Changes' : 'Create Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
