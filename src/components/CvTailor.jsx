import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Download, 
  Printer, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Layers, 
  Check, 
  Plus, 
  Flame,
  ShieldCheck,
  Eye,
  Sliders,
  UploadCloud,
  FileCheck,
  Paperclip
} from 'lucide-react';
import { 
  extractKeywords, 
  calculateAtsScore, 
  generateTailoredCv 
} from '../utils/atsEngine';
import { extractTextFromFile } from '../utils/fileExtractor';
import { SAMPLE_MASTER_CV, SAMPLE_JOB_OFFERS } from '../data/sampleData';
import confetti from 'canvas-confetti';

export default function CvTailor({ 
  onSaveToTracker, 
  onNavigateToCoverLetter, 
  onNavigateToInterview 
}) {
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [company, setCompany] = useState('Stripe');
  const [masterCv, setMasterCv] = useState(SAMPLE_MASTER_CV);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_OFFERS[0].description);
  const [tailoredCv, setTailoredCv] = useState('');
  const [activeView, setActiveView] = useState('tailored'); // 'tailored' | 'side-by-side' | 'original'
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState('');

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isExtractingFile, setIsExtractingFile] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtractingFile(true);
    try {
      const { text, fileName } = await extractTextFromFile(file);
      setMasterCv(text);
      setUploadedFileName(fileName);
      showToast(`Successfully extracted text from ${fileName}!`);
    } catch (err) {
      console.error(err);
      alert(`Could not parse file: ${err.message}`);
    } finally {
      setIsExtractingFile(false);
    }
  };

  // Extract job keywords
  const jobKeywords = useMemo(() => {
    return extractKeywords(jobDescription);
  }, [jobDescription]);

  // Compute live ATS score on active CV text (tailored if generated, else master)
  const currentCvForScoring = tailoredCv || masterCv;
  const atsAnalysis = useMemo(() => {
    return calculateAtsScore(currentCvForScoring, jobKeywords);
  }, [currentCvForScoring, jobKeywords]);

  // Initial generation on first mount if empty
  React.useEffect(() => {
    if (!tailoredCv && masterCv && jobKeywords.length > 0) {
      const generated = generateTailoredCv(
        masterCv, 
        jobTitle, 
        company, 
        jobKeywords, 
        atsAnalysis.missingKeywords
      );
      setTailoredCv(generated);
    }
  }, []);

  const handleGenerateTailored = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateTailoredCv(
        masterCv, 
        jobTitle, 
        company, 
        jobKeywords, 
        atsAnalysis.missingKeywords
      );
      setTailoredCv(generated);
      setIsGenerating(false);
      setActiveView('tailored');

      // Trigger celebration if high score
      const newScore = calculateAtsScore(generated, jobKeywords).score;
      if (newScore >= 85) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
      showToast('ATS CV tailored and keyword-optimized successfully!');
    }, 400);
  };

  const handleAddKeywordToCv = (keyword) => {
    const textToModify = tailoredCv || masterCv;
    // Append keyword into technical skills section
    const skillsRegex = /(SKILLS|TECHNICAL SKILLS)[\s\S]*?(?=(EXPERIENCE|WORK EXPERIENCE|PROJECTS|EDUCATION|$))/i;
    let updated;
    if (skillsRegex.test(textToModify)) {
      updated = textToModify.replace(skillsRegex, (match) => {
        return match.trim() + `, ${keyword}\n\n`;
      });
    } else {
      updated = textToModify + `\n\nTECHNICAL SKILLS: ${keyword}`;
    }
    setTailoredCv(updated);
    showToast(`Added "${keyword}" to CV keywords!`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredCv || masterCv);
    setCopied(true);
    showToast('CV text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format) => {
    const content = tailoredCv || masterCv;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `${company ? company.replace(/\s+/g, '_') : 'Company'}_${jobTitle ? jobTitle.replace(/\s+/g, '_') : 'Role'}_ATS_Resume.${format}`;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadSampleJob = (sample) => {
    setJobTitle(sample.title);
    setCompany(sample.company);
    setJobDescription(sample.description);
    showToast(`Loaded ${sample.company} job requirements!`);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSaveToTracker = () => {
    if (onSaveToTracker) {
      onSaveToTracker({
        company,
        role: jobTitle,
        status: 'Applied',
        atsScore: atsAnalysis.score,
        matchedKeywords: atsAnalysis.matchedKeywords,
        notes: `Tailored ATS CV created. Match score: ${atsAnalysis.score}%. Applied on ${new Date().toLocaleDateString()}`
      });
      showToast('Saved directly to Application Ledger!');
    }
  };

  // Color code based on score
  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--accent-emerald)';
    if (score >= 70) return 'var(--accent-cyan)';
    if (score >= 50) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  return (
    <div className="tab-page-container cv-tailor-page">
      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification no-print">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="page-header-banner no-print">
        <div className="header-text-content">
          <div className="badge-pill">
            <Sparkles size={14} />
            <span>AI & Rule-Based ATS Keyword Matcher</span>
          </div>
          <h1>Targeted ATS Resume Optimizer</h1>
          <p>
            Paste your master CV and target job offer. Our engine extracts crucial keywords, calculates real-time ATS match probability, and refactors your bullet points to match hiring algorithms.
          </p>
        </div>

        {/* ATS Scorecard Card */}
        <div className="ats-score-card">
          <div className="score-circular-wrapper">
            <svg viewBox="0 0 100 100" className="score-svg-meter">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="score-track-bg"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="score-track-fill"
                style={{
                  strokeDasharray: 264,
                  strokeDashoffset: 264 - (264 * (atsAnalysis.score / 100)),
                  stroke: getScoreColor(atsAnalysis.score)
                }}
              />
            </svg>
            <div className="score-inner-text">
              <span className="score-number" style={{ color: getScoreColor(atsAnalysis.score) }}>
                {atsAnalysis.score}%
              </span>
              <span className="score-label">ATS MATCH</span>
            </div>
          </div>

          <div className="score-breakdown-list">
            <div className="breakdown-item">
              <span className="breakdown-label">Keyword Match</span>
              <span className="breakdown-val">{atsAnalysis.details.keywordMatch}%</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Measurable Metrics</span>
              <span className="breakdown-val">{atsAnalysis.details.metricPoints}%</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">ATS Formatting</span>
              <span className="breakdown-val">{atsAnalysis.details.formattingScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow */}
      <div className="cv-tailor-layout no-print">
        {/* Left Column: Job Offer & Master CV Inputs */}
        <div className="cv-input-panel">
          {/* Target Job Info Card */}
          <div className="glass-card panel-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <FileText size={18} className="text-accent" />
                <h3>1. Target Job Offer</h3>
              </div>
              <div className="quick-sample-pills">
                <span className="sample-label">Load:</span>
                {SAMPLE_JOB_OFFERS.map(job => (
                  <button 
                    key={job.id} 
                    className="pill-btn"
                    onClick={() => handleLoadSampleJob(job)}
                  >
                    {job.company}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-grid-2">
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)}
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
                  placeholder="e.g. Stripe, Google, Startup"
                  className="custom-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Job Offer Description & Requirements</label>
                <span className="char-count">{jobKeywords.length} keywords detected</span>
              </div>
              <textarea 
                rows={7}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description, required skills, and qualifications here..."
                className="custom-textarea"
              />
            </div>
          </div>

          {/* Master CV Card */}
          <div className="glass-card panel-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <ShieldCheck size={18} className="text-accent" />
                <h3>2. Master CV / Resume Source</h3>
              </div>
              
              <div className="quick-sample-pills">
                <input 
                  type="file"
                  id="cv-tailor-upload-input"
                  accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="cv-tailor-upload-input" 
                  className="btn-glass pill-btn"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <UploadCloud size={13} />
                  <span>Upload File</span>
                </label>
                <button 
                  className="pill-btn" 
                  onClick={() => {
                    setMasterCv(SAMPLE_MASTER_CV);
                    setUploadedFileName('');
                  }}
                >
                  Sample CV
                </button>
              </div>
            </div>

            {/* Uploaded File Banner */}
            {isExtractingFile ? (
              <div className="file-status-banner loading">
                <RefreshCw size={15} className="spin text-accent" />
                <span>Extracting text from file...</span>
              </div>
            ) : uploadedFileName ? (
              <div className="file-status-banner success">
                <FileCheck size={15} className="text-emerald" />
                <span>Loaded <strong>{uploadedFileName}</strong> ({masterCv.split(/\s+/).filter(Boolean).length} words extracted)</span>
                <button 
                  type="button" 
                  className="clear-file-btn"
                  onClick={() => setUploadedFileName('')}
                >
                  ✕
                </button>
              </div>
            ) : null}

            <textarea 
              rows={9}
              value={masterCv}
              onChange={(e) => setMasterCv(e.target.value)}
              placeholder="Paste your existing resume text here or click 'Upload File' above (.pdf, .docx, .txt, .md)..."
              className="custom-textarea font-mono"
            />
          </div>

          {/* Keyword Matcher Status & Missing Keywords Injection */}
          <div className="glass-card panel-card keyword-analysis-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <Flame size={18} className="text-accent" />
                <h3>Keywords Extraction & Gap Analysis</h3>
              </div>
            </div>

            <div className="keywords-section-block">
              <div className="keyword-category-header">
                <span className="status-dot matched"></span>
                <strong>Matched in Your CV ({atsAnalysis.matchedKeywords.length})</strong>
              </div>
              <div className="keyword-tags-cloud">
                {atsAnalysis.matchedKeywords.length > 0 ? (
                  atsAnalysis.matchedKeywords.map((kw, i) => (
                    <span key={i} className="keyword-badge matched">
                      <Check size={12} />
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-muted text-sm">No keyword matches yet.</span>
                )}
              </div>
            </div>

            <div className="keywords-section-block" style={{ marginTop: '1rem' }}>
              <div className="keyword-category-header">
                <span className="status-dot missing"></span>
                <strong>Missing From CV ({atsAnalysis.missingKeywords.length})</strong>
                <span className="helper-hint">— Click (+) to inject into CV</span>
              </div>
              <div className="keyword-tags-cloud">
                {atsAnalysis.missingKeywords.length > 0 ? (
                  atsAnalysis.missingKeywords.slice(0, 14).map((kw, i) => (
                    <button 
                      key={i} 
                      className="keyword-badge missing clickable"
                      onClick={() => handleAddKeywordToCv(kw)}
                      title={`Click to add "${kw}" to CV skills section`}
                    >
                      <Plus size={12} />
                      {kw}
                    </button>
                  ))
                ) : (
                  <span className="text-emerald text-sm">Outstanding! All job keywords are present in your CV.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tailored ATS Resume & Live Actions */}
        <div className="cv-output-panel">
          <div className="glass-card output-card">
            {/* Action Bar */}
            <div className="output-header-bar">
              <div className="view-mode-tabs">
                <button 
                  className={`view-tab ${activeView === 'tailored' ? 'active' : ''}`}
                  onClick={() => setActiveView('tailored')}
                >
                  <Sparkles size={14} />
                  <span>Tailored ATS Resume</span>
                </button>
                <button 
                  className={`view-tab ${activeView === 'original' ? 'active' : ''}`}
                  onClick={() => setActiveView('original')}
                >
                  <FileText size={14} />
                  <span>Original CV</span>
                </button>
                <button 
                  className={`view-tab ${activeView === 'side-by-side' ? 'active' : ''}`}
                  onClick={() => setActiveView('side-by-side')}
                >
                  <Layers size={14} />
                  <span>Side-by-Side</span>
                </button>
              </div>

              <div className="output-action-buttons">
                <button 
                  className="btn-accent-gradient"
                  onClick={handleGenerateTailored}
                  disabled={isGenerating}
                >
                  <RefreshCw size={15} className={isGenerating ? 'spin' : ''} />
                  <span>{isGenerating ? 'Optimizing...' : 'Re-Optimize for ATS'}</span>
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={handleCopy}
                  title="Copy CV to Clipboard"
                >
                  {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleDownload('txt')}
                  title="Download plain text (.txt)"
                >
                  <Download size={15} />
                  <span>TXT</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={handlePrint}
                  title="Print or Save as PDF"
                >
                  <Printer size={15} />
                  <span>Print PDF</span>
                </button>
              </div>
            </div>

            {/* Resume Content View */}
            <div className="resume-editor-area">
              {activeView === 'side-by-side' ? (
                <div className="side-by-side-grid">
                  <div className="side-pane">
                    <div className="pane-header">Original CV (Before)</div>
                    <pre className="resume-pre-preview">{masterCv}</pre>
                  </div>
                  <div className="side-pane highlight-pane">
                    <div className="pane-header">Tailored ATS CV (After)</div>
                    <textarea 
                      className="resume-textarea font-mono"
                      value={tailoredCv || masterCv}
                      onChange={(e) => setTailoredCv(e.target.value)}
                    />
                  </div>
                </div>
              ) : activeView === 'original' ? (
                <div className="full-pane">
                  <pre className="resume-pre-preview">{masterCv}</pre>
                </div>
              ) : (
                <div className="full-pane">
                  <div className="editor-ribbon">
                    <span className="ribbon-tag">
                      <CheckCircle2 size={13} className="text-emerald" />
                      ATS-Standard Single Column Format
                    </span>
                    <span className="ribbon-tag">
                      <Flame size={13} className="text-amber" />
                      Google XYZ Accomplishment Bullet Points
                    </span>
                    <span className="ribbon-hint">Live Editable text area</span>
                  </div>
                  <textarea 
                    className="resume-textarea font-mono"
                    value={tailoredCv || masterCv}
                    onChange={(e) => setTailoredCv(e.target.value)}
                    placeholder="Your tailored ATS resume will be displayed here..."
                  />
                </div>
              )}
            </div>

            {/* Next Step Integrations Footer */}
            <div className="card-footer-action-strip">
              <div className="footer-status-pill">
                <CheckCircle2 size={16} className="text-emerald" />
                <span>Ready for <strong>{company || 'Job Offer'}</strong></span>
              </div>
              <div className="footer-buttons-group">
                <button 
                  className="btn-glass"
                  onClick={handleSaveToTracker}
                >
                  <Layers size={15} />
                  <span>Save to Application Ledger</span>
                </button>
                <button 
                  className="btn-primary-gradient"
                  onClick={() => {
                    if (onNavigateToCoverLetter) {
                      onNavigateToCoverLetter({
                        company,
                        role: jobTitle,
                        matchedSkills: atsAnalysis.matchedKeywords
                      });
                    }
                  }}
                >
                  <span>Generate Cover Letter & Email</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden container specifically styled for ATS PDF Print */}
      <div className="printable-resume">
        <pre>{tailoredCv || masterCv}</pre>
      </div>
    </div>
  );
}
