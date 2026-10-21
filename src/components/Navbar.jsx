import React from 'react';
import { 
  FileText, 
  Mail, 
  HelpCircle, 
  Layers, 
  Sun, 
  Moon, 
  PlusCircle, 
  Sparkles,
  Download,
  Upload,
  Briefcase,
  Zap
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  onNewApplication, 
  applicationsCount,
  onExportData,
  onImportData
}) {
  const navItems = [
    { id: 'one-click', label: '1-Click Generator', icon: Zap, badge: '⚡ All-in-One' },
    { id: 'cv', label: 'ATS CV Tailor', icon: FileText, badge: 'ATS Match' },
    { id: 'cover-letter', label: 'Cover Letter & HR Email', icon: Mail, badge: 'Smart Copy' },
    { id: 'interview', label: 'Interview Q&A Kit', icon: HelpCircle, badge: 'STAR Method' },
    { id: 'tracker', label: 'Applications Ledger', icon: Layers, count: applicationsCount }
  ];

  return (
    <header className="navbar-container no-print">
      <div className="navbar-content">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab('cv')} role="button">
          <div className="brand-icon-wrapper">
            <Briefcase className="brand-icon" size={22} />
            <Sparkles className="sparkle-badge" size={12} />
          </div>
          <div className="brand-text-group">
            <div className="brand-title">
              Job<span>Rdy</span>
            </div>
            <span className="brand-tagline">Interview & ATS Suite</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-tab-button ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} className="tab-icon" />
                <span className="tab-label">{item.label}</span>
                {item.count !== undefined && (
                  <span className="tab-counter-badge">{item.count}</span>
                )}
                {item.badge && (
                  <span className="tab-sub-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="navbar-actions">
          {/* Export JSON / Backup */}
          <button 
            className="action-icon-btn" 
            title="Export & Backup All Applications & Resumes"
            onClick={onExportData}
          >
            <Download size={16} />
          </button>

          {/* Import JSON */}
          <label className="action-icon-btn" title="Import Applications Backup JSON">
            <Upload size={16} />
            <input 
              type="file" 
              accept=".json" 
              style={{ display: 'none' }} 
              onChange={onImportData} 
            />
          </label>

          {/* Theme Toggle */}
          <button 
            className="action-icon-btn theme-toggle" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Quick Add Application CTA */}
          <button 
            className="btn-primary-gradient quick-add-btn"
            onClick={onNewApplication}
          >
            <PlusCircle size={16} />
            <span>Track Application</span>
          </button>
        </div>
      </div>
    </header>
  );
}
