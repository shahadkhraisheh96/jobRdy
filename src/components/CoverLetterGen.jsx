import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  FileText, 
  Send, 
  Copy, 
  Download, 
  Check, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Layers,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { generateCoverLetter } from '../utils/atsEngine';

export default function CoverLetterGen({ 
  initialData, 
  onSaveToTracker, 
  onNavigateToInterview 
}) {
  const [candidateName, setCandidateName] = useState('Alex Morgan');
  const [role, setRole] = useState(initialData?.role || 'Senior Software Engineer');
  const [company, setCompany] = useState(initialData?.company || 'Stripe');
  const [activeMode, setActiveMode] = useState('cover-letter'); // 'cover-letter' | 'cold-email' | 'linkedin'
  const [tone, setTone] = useState('Confident & Impact-Driven');
  const [highlightSkills, setHighlightSkills] = useState(
    initialData?.matchedSkills?.slice(0, 4).join(', ') || 'React, TypeScript, Node.js, System Architecture'
  );

  const [coverLetterText, setCoverLetterText] = useState('');
  const [coldEmailText, setColdEmailText] = useState('');
  const [linkedInText, setLinkedInText] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Update when initialData changes from other tabs
  useEffect(() => {
    if (initialData?.role) setRole(initialData.role);
    if (initialData?.company) setCompany(initialData.company);
    if (initialData?.matchedSkills && initialData.matchedSkills.length > 0) {
      setHighlightSkills(initialData.matchedSkills.slice(0, 4).join(', '));
    }
  }, [initialData]);

  // Generate contents
  const regenerate = () => {
    const skillsArray = highlightSkills.split(',').map(s => s.trim()).filter(Boolean);
    const result = generateCoverLetter(candidateName, role, company, '', skillsArray);
    
    // Adjust tone if specified
    if (tone === 'Enthusiastic & Modern') {
      result.coverLetter = result.coverLetter.replace(
        'I am writing to express my strong enthusiasm', 
        `I am thrilled to apply for the ${role} opening at ${company}! As someone who has long admired ${company}'s fast-moving culture`
      );
    } else if (tone === 'Executive & Formal') {
      result.coverLetter = result.coverLetter.replace(
        'Dear Hiring Team', 
        `Dear Members of the Executive Hiring Committee`
      );
    }

    setCoverLetterText(result.coverLetter);
    setColdEmailText(result.coldEmail);
    setLinkedInText(result.linkedInMessage);
    showToast('Cover letter and HR outreach messages refreshed!');
  };

  useEffect(() => {
    regenerate();
  }, [role, company, tone]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const currentContent = activeMode === 'cover-letter' 
    ? coverLetterText 
    : activeMode === 'cold-email' 
      ? coldEmailText 
      : linkedInText;

  const setCurrentContent = (val) => {
    if (activeMode === 'cover-letter') setCoverLetterText(val);
    else if (activeMode === 'cold-email') setColdEmailText(val);
    else setLinkedInText(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const name = `${company.replace(/\s+/g, '_')}_${activeMode}_${candidateName.replace(/\s+/g, '_')}.txt`;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${name}`);
  };

  const handleSaveToTracker = () => {
    if (onSaveToTracker) {
      onSaveToTracker({
        company,
        role,
        status: 'Applied',
        coverLetterSaved: true,
        notes: `Cover letter and HR email prepared for ${company}.`
      });
      showToast('Application record updated with Cover Letter status!');
    }
  };

  return (
    <div className="tab-page-container cover-letter-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification no-print">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header-banner no-print">
        <div className="header-text-content">
          <div className="badge-pill">
            <Mail size={14} />
            <span>High-Conversion Outreach Generator</span>
          </div>
          <h1>Tailored Cover Letters & HR Outreach Emails</h1>
          <p>
            Generate targeted cover letters and concise cold emails for hiring managers. Emphasize matched keywords and quantify your past achievements to stand out in the inbox.
          </p>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="cover-letter-layout no-print">
        {/* Left Column: Settings & Parameters */}
        <div className="cl-settings-panel">
          <div className="glass-card panel-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <Sparkles size={18} className="text-accent" />
                <h3>Application Targeting</h3>
              </div>
            </div>

            <div className="form-group">
              <label>Your Full Name</label>
              <input 
                type="text" 
                value={candidateName} 
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="custom-input"
              />
            </div>

            <div className="input-grid-2">
              <div className="form-group">
                <label>Target Role</label>
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="custom-input"
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="custom-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Highlight Skills & Strengths (comma-separated)</label>
              <input 
                type="text" 
                value={highlightSkills} 
                onChange={(e) => setHighlightSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Cloud Architecture"
                className="custom-input"
              />
            </div>

            <div className="form-group">
              <label>Communication Tone</label>
              <select 
                value={tone} 
                onChange={(e) => setTone(e.target.value)}
                className="custom-select"
              >
                <option value="Confident & Impact-Driven">Confident & Impact-Driven (Recommended)</option>
                <option value="Enthusiastic & Modern">Enthusiastic & Modern (Startups / Fast Growth)</option>
                <option value="Executive & Formal">Executive & Formal (Enterprise / Finance)</option>
              </select>
            </div>

            <button 
              className="btn-accent-gradient"
              style={{ width: '100%', marginTop: '0.5rem' }}
              onClick={regenerate}
            >
              <RefreshCw size={15} />
              <span>Regenerate Content</span>
            </button>
          </div>

          {/* Quick Outreach Tips Card */}
          <div className="glass-card panel-card tips-card">
            <h4>💡 Pro HR Email Tips</h4>
            <ul className="tips-list">
              <li>Keep cold emails under <strong>150 words</strong> — recruiters read on mobile.</li>
              <li>Include 2-3 specific bullet points with measurable metrics (e.g., 35% faster, $12M volume).</li>
              <li>Always propose a brief 10-15 minute introductory chat with zero pressure.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Output Viewer & Editor */}
        <div className="cl-output-panel">
          <div className="glass-card output-card">
            {/* Header Tabs: Cover Letter vs Cold Email vs LinkedIn */}
            <div className="output-header-bar">
              <div className="view-mode-tabs">
                <button 
                  className={`view-tab ${activeMode === 'cover-letter' ? 'active' : ''}`}
                  onClick={() => setActiveMode('cover-letter')}
                >
                  <FileText size={15} />
                  <span>Standard Cover Letter</span>
                </button>
                <button 
                  className={`view-tab ${activeMode === 'cold-email' ? 'active' : ''}`}
                  onClick={() => setActiveMode('cold-email')}
                >
                  <Mail size={15} />
                  <span>HR Cold Outreach Email</span>
                </button>
                <button 
                  className={`view-tab ${activeMode === 'linkedin' ? 'active' : ''}`}
                  onClick={() => setActiveMode('linkedin')}
                >
                  <Send size={15} />
                  <span>LinkedIn InMail</span>
                </button>
              </div>

              <div className="output-action-buttons">
                <button 
                  className="btn-secondary" 
                  onClick={handleCopy}
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={handleDownload}
                  title="Download .txt"
                >
                  <Download size={15} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Editable Content */}
            <div className="cl-editor-wrapper">
              <div className="editor-info-bar">
                <span>Mode: <strong>{activeMode === 'cover-letter' ? 'Full Cover Letter' : activeMode === 'cold-email' ? 'Recruiter Direct Email' : 'LinkedIn Message'}</strong></span>
                <span>{currentContent.split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <textarea 
                className="custom-textarea cl-textarea"
                rows={18}
                value={currentContent}
                onChange={(e) => setCurrentContent(e.target.value)}
              />
            </div>

            {/* Bottom Actions */}
            <div className="card-footer-action-strip">
              <div className="footer-status-pill">
                <UserCheck size={16} className="text-emerald" />
                <span>Tailored for <strong>{company}</strong> HR</span>
              </div>

              <div className="footer-buttons-group">
                <button 
                  className="btn-glass"
                  onClick={handleSaveToTracker}
                >
                  <Layers size={15} />
                  <span>Link to Application Ledger</span>
                </button>

                <button 
                  className="btn-primary-gradient"
                  onClick={() => {
                    if (onNavigateToInterview) {
                      onNavigateToInterview({
                        company,
                        role,
                        keywords: highlightSkills.split(',').map(s => s.trim()).filter(Boolean)
                      });
                    }
                  }}
                >
                  <span>Practice Interview Questions</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
