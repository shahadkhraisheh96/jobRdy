import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  FileText, 
  Mail, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  Copy, 
  Download, 
  Printer, 
  ArrowRight, 
  Flame, 
  Check, 
  ExternalLink,
  DollarSign,
  Briefcase,
  Building,
  RefreshCw,
  Plus,
  UploadCloud,
  FileCheck,
  Paperclip,
  X
} from 'lucide-react';
import { 
  extractKeywords, 
  calculateAtsScore, 
  generateTailoredCv, 
  generateCoverLetter, 
  generateInterviewKit,
  detectJobMeta
} from '../utils/atsEngine';
import { extractTextFromFile } from '../utils/fileExtractor';
import { SAMPLE_MASTER_CV, SAMPLE_JOB_OFFERS, APPLICATION_STATUS_OPTIONS } from '../data/sampleData';
import confetti from 'canvas-confetti';

export default function OneClickGenerator({ 
  onSaveToApplications, 
  onNavigateToTab 
}) {
  const [masterCv, setMasterCv] = useState(SAMPLE_MASTER_CV);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_OFFERS[0].description);
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer - Core Platform');
  const [company, setCompany] = useState('Stripe');
  const [salary, setSalary] = useState('$165,000 - $210,000 + Equity');

  // File Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cvInputTab, setCvInputTab] = useState('upload'); // 'upload' | 'paste'

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0); // 0 to 4
  const [generatedResults, setGeneratedResults] = useState(null);
  const [resultSubTab, setResultSubTab] = useState('cv'); // 'cv' | 'cover-letter' | 'interview' | 'tracker'
  const [copiedSection, setCopiedSection] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Handle CV File Upload (.pdf, .docx, .txt, .md, .rtf)
  const processUploadedFile = async (file) => {
    if (!file) return;
    setIsExtractingFile(true);
    try {
      const { text, fileName } = await extractTextFromFile(file);
      setMasterCv(text);
      setUploadedFileName(fileName);
      showToast(`Successfully extracted text from ${fileName}!`);
    } catch (err) {
      console.error(err);
      alert(`Could not read file: ${err.message}`);
    } finally {
      setIsExtractingFile(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Auto-detect metadata when job description changes
  const handleJobDescChange = (text) => {
    setJobDescription(text);
    const detected = detectJobMeta(text);
    if (detected.title && !jobTitle) setJobTitle(detected.title);
    if (detected.company && !company) setCompany(detected.company);
    if (detected.salary && !salary) setSalary(detected.salary);
  };

  const handleLoadSampleJob = (sample) => {
    setJobTitle(sample.title);
    setCompany(sample.company);
    setJobDescription(sample.description);
    setSalary(sample.salary || '');
    showToast(`Loaded ${sample.company} job offer!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ONE-CLICK GENERATE EVERYTHING PIPELINE
  const handleGenerateEverything = () => {
    if (!masterCv.trim() || !jobDescription.trim()) {
      alert('Please provide both your CV and the Job Offer description.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    // Step 1: Keywords & ATS extraction
    setTimeout(() => {
      setGenerationStep(2);
      const keywords = extractKeywords(jobDescription);
      const atsInitial = calculateAtsScore(masterCv, keywords);

      // Step 2: Tailor CV
      setTimeout(() => {
        setGenerationStep(3);
        const tailoredCv = generateTailoredCv(
          masterCv, 
          jobTitle || 'Target Role', 
          company || 'Target Company', 
          keywords, 
          atsInitial.missingKeywords
        );
        const atsFinal = calculateAtsScore(tailoredCv, keywords);

        // Step 3: Cover letter & Cold HR email
        setTimeout(() => {
          setGenerationStep(4);
          const outreach = generateCoverLetter(
            'Alex Morgan', 
            jobTitle || 'Target Role', 
            company || 'Target Company', 
            jobDescription, 
            atsFinal.matchedKeywords
          );

          // Step 4: Interview Kit
          const interviewKit = generateInterviewKit(
            jobTitle || 'Target Role', 
            company || 'Target Company', 
            keywords
          );

          // Create ledger application record
          const newAppId = `app-${Date.now()}`;
          const applicationRecord = {
            id: newAppId,
            company: company || 'Target Company',
            role: jobTitle || 'Target Role',
            status: 'Applied',
            salary: salary || '$150,000+',
            location: 'Remote / Hybrid',
            appliedDate: new Date().toISOString().split('T')[0],
            atsScore: atsFinal.score,
            notes: `Full package generated. ATS Score: ${atsFinal.score}%. Applied with tailored CV and Cover Letter.`,
            matchedKeywords: atsFinal.matchedKeywords,
            coverLetterSaved: true
          };

          // Save into master application tracker
          if (onSaveToApplications) {
            onSaveToApplications(applicationRecord);
          }

          setGeneratedResults({
            keywords,
            atsFinal,
            tailoredCv,
            coverLetter: outreach.coverLetter,
            coldEmail: outreach.coldEmail,
            linkedInMessage: outreach.linkedInMessage,
            interviewKit,
            applicationRecord
          });

          setIsGenerating(false);
          setGenerationStep(0);

          // Celebration
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          showToast('Everything generated & saved to your Applications Ledger!');
        }, 350);
      }, 350);
    }, 350);
  };

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    showToast(`Copied ${sectionName} to clipboard!`);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const handleDownloadAll = () => {
    if (!generatedResults) return;
    const combinedDossier = `========================================================================
JOBRDY APPLICATION PACKAGE: ${jobTitle} @ ${company}
Generated: ${new Date().toLocaleDateString()}
ATS Match Score: ${generatedResults.atsFinal.score}%
========================================================================

--- 1. TAILORED ATS RESUME ---
${generatedResults.tailoredCv}

========================================================================
--- 2. FORMAL COVER LETTER ---
${generatedResults.coverLetter}

========================================================================
--- 3. HR COLD OUTREACH EMAIL ---
${generatedResults.coldEmail}

========================================================================
--- 4. LINKEDIN INMAIL MESSAGE ---
${generatedResults.linkedInMessage}

========================================================================
--- 5. INTERVIEW CHEAT SHEET (BEHAVIORAL STAR ANSWERS) ---
${generatedResults.interviewKit.hrQuestions.map((q, i) => `
Q${i+1}: ${q.question}
Category: ${q.category}
STAR Answer:
  Situation: ${q.starAnswer.situation}
  Task:      ${q.starAnswer.task}
  Action:    ${q.starAnswer.action}
  Result:    ${q.starAnswer.result}
Pro-Tip: ${q.proTip}
`).join('\n')}

========================================================================
--- 6. TECHNICAL INTERVIEW ARCHITECTURE SOLUTIONS ---
${generatedResults.interviewKit.technicalQuestions.map((q, i) => `
Q${i+1}: ${q.question}
Solution:
${q.modelAnswer}
Interviewer Trap: ${q.interviewerWatchout}
`).join('\n')}
`;

    const blob = new Blob([combinedDossier], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JobRdy_Full_Package_${company.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Complete Application Dossier!');
  };

  return (
    <div className="tab-page-container one-click-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification no-print">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="page-header-banner no-print">
        <div className="header-text-content">
          <div className="badge-pill">
            <Zap size={14} />
            <span>1-Click Universal Generator</span>
          </div>
          <h1>Add CV & Job Offer — Generate Everything</h1>
          <p>
            Paste your CV and the job offer below. With one single click, JobRdy will tailor your ATS resume, write your cover letter and HR outreach email, prepare your STAR and technical interview answers, and log the application in your tracker ledger!
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="one-click-sample-box glass-card">
          <span className="sample-box-title">Try with 1-Click Samples:</span>
          <div className="sample-buttons-row">
            {SAMPLE_JOB_OFFERS.map(job => (
              <button 
                key={job.id} 
                className="btn-glass pill-btn"
                onClick={() => handleLoadSampleJob(job)}
              >
                {job.company} ({job.title.split('-')[0].trim()})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Side-by-Side Grid */}
      <div className="one-click-input-grid no-print">
        {/* Left Card: Master CV */}
        <div className="glass-card panel-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <FileText size={18} className="text-accent" />
              <h3>Step 1: Your Master CV / Resume</h3>
            </div>
            
            <div className="cv-mode-toggle-group">
              <button 
                type="button"
                className={`pill-btn ${cvInputTab === 'upload' ? 'active-pill' : ''}`}
                onClick={() => setCvInputTab('upload')}
              >
                <UploadCloud size={13} />
                <span>Upload File</span>
              </button>
              <button 
                type="button"
                className={`pill-btn ${cvInputTab === 'paste' ? 'active-pill' : ''}`}
                onClick={() => setCvInputTab('paste')}
              >
                <FileText size={13} />
                <span>Paste Text</span>
              </button>
              <button 
                type="button"
                className="pill-btn"
                onClick={() => {
                  setMasterCv(SAMPLE_MASTER_CV);
                  setUploadedFileName('');
                  showToast('Loaded sample Alex Morgan CV');
                }}
              >
                Sample CV
              </button>
            </div>
          </div>

          {/* Upload Dropzone (Visible in upload mode or when dragging) */}
          {cvInputTab === 'upload' ? (
            <div className="file-upload-section">
              <div 
                className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${uploadedFileName ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file"
                  id="cv-file-upload-input"
                  accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />

                {isExtractingFile ? (
                  <div className="upload-loading-state">
                    <RefreshCw size={28} className="spin text-accent" />
                    <p className="upload-main-text">Extracting text from resume...</p>
                    <span className="upload-sub-text">Parsing sections, experiences & skills</span>
                  </div>
                ) : uploadedFileName ? (
                  <div className="upload-success-state">
                    <FileCheck size={32} className="text-emerald" />
                    <div className="file-info-text">
                      <strong className="file-name">{uploadedFileName}</strong>
                      <span className="file-meta">
                        {masterCv ? `${masterCv.split(/\s+/).filter(Boolean).length} words extracted` : 'File loaded'}
                      </span>
                    </div>
                    <div className="upload-actions-row">
                      <label htmlFor="cv-file-upload-input" className="btn-secondary pill-btn" style={{ cursor: 'pointer' }}>
                        Change File
                      </label>
                      <button 
                        type="button" 
                        className="pill-btn"
                        onClick={() => setCvInputTab('paste')}
                      >
                        Edit Extracted Text
                      </button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="cv-file-upload-input" className="upload-idle-label">
                    <div className="upload-icon-wrapper">
                      <UploadCloud size={30} />
                    </div>
                    <p className="upload-main-text">
                      <strong>Click to upload</strong> or drag and drop your CV file
                    </p>
                    <span className="upload-sub-text">
                      Supports <strong>PDF (.pdf)</strong>, <strong>Word (.docx)</strong>, <strong>Text (.txt)</strong>, or <strong>Markdown (.md)</strong>
                    </span>
                    <span className="btn-primary-gradient upload-browse-btn">
                      Browse Computer
                    </span>
                  </label>
                )}
              </div>

              {/* Quick Preview of Extracted Content */}
              {masterCv && (
                <div className="extracted-text-preview-box">
                  <div className="preview-header">
                    <span>Extracted Resume Text Preview:</span>
                    <button 
                      type="button"
                      className="text-accent text-sm"
                      onClick={() => setCvInputTab('paste')}
                    >
                      Open Full Editor ➔
                    </button>
                  </div>
                  <pre className="extracted-snippet-pre font-mono">
                    {masterCv.slice(0, 320)}...
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* Direct Textarea Editor */
            <div className="paste-text-section">
              <div className="label-row" style={{ marginBottom: '0.4rem' }}>
                <span className="card-subtitle-hint">
                  {uploadedFileName ? `Extracted from ${uploadedFileName}` : 'Paste your resume text below:'}
                </span>
                <label htmlFor="cv-file-upload-input" className="text-accent text-sm" style={{ cursor: 'pointer' }}>
                  <Paperclip size={13} style={{ display: 'inline', marginRight: '3px' }} />
                  Upload file instead
                </label>
              </div>
              <textarea 
                rows={12}
                value={masterCv}
                onChange={(e) => setMasterCv(e.target.value)}
                placeholder="Paste your CV here (Experience, Skills, Education, Projects)..."
                className="custom-textarea font-mono"
              />
            </div>
          )}
        </div>

        {/* Right Card: Target Job Offer */}
        <div className="glass-card panel-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <Briefcase size={18} className="text-accent" />
              <h3>Step 2: Target Job Offer Description</h3>
            </div>
            <span className="char-count">{extractKeywords(jobDescription).length} skills found</span>
          </div>
          <p className="card-subtitle-hint">Paste the full job posting from LinkedIn, Indeed, or company site:</p>
          <textarea 
            rows={7}
            value={jobDescription}
            onChange={(e) => handleJobDescChange(e.target.value)}
            placeholder="Paste the job description, qualifications, and requirements here..."
            className="custom-textarea"
          />

          {/* Detected Job Details Fields */}
          <div className="detected-fields-grid">
            <div className="form-group">
              <label>Role / Position Title</label>
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
                placeholder="e.g. Stripe, Airbnb"
                className="custom-input"
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Compensation / Salary Range (Optional)</label>
              <input 
                type="text" 
                value={salary} 
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $165,000 - $210,000 + Equity"
                className="custom-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GIANT ONE-CLICK GENERATE BUTTON */}
      <div className="generate-cta-container no-print">
        <button 
          className="btn-giant-gradient"
          onClick={handleGenerateEverything}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={24} className="spin" />
              <span>Generating Your Complete Application Suite...</span>
            </>
          ) : (
            <>
              <Zap size={24} />
              <span>⚡ Generate Everything (CV + Cover Letter + Interview Q&A + Track)</span>
            </>
          )}
        </button>

        {/* Animated Progress Steps */}
        {isGenerating && (
          <div className="generation-progress-box glass-card">
            <div className={`gen-step-item ${generationStep >= 1 ? 'active' : ''}`}>
              <CheckCircle2 size={16} /> 1. Extracting ATS Keywords & Skills Match
            </div>
            <div className={`gen-step-item ${generationStep >= 2 ? 'active' : ''}`}>
              <CheckCircle2 size={16} /> 2. Tailoring CV with Google XYZ Bullet Points
            </div>
            <div className={`gen-step-item ${generationStep >= 3 ? 'active' : ''}`}>
              <CheckCircle2 size={16} /> 3. Composing Tailored Cover Letter & HR Outreach Email
            </div>
            <div className={`gen-step-item ${generationStep >= 4 ? 'active' : ''}`}>
              <CheckCircle2 size={16} /> 4. Generating STAR Behavioral & Technical Interview Q&A
            </div>
          </div>
        )}
      </div>

      {/* GENERATED RESULTS SHOWCASE */}
      {generatedResults && (
        <div className="generated-results-hub no-print">
          {/* Results Navigation Bar */}
          <div className="results-nav-bar glass-card">
            <div className="results-header-info">
              <span className="results-company-badge">
                <Building size={14} /> {company}
              </span>
              <h2 className="results-title">{jobTitle}</h2>
              <span className="results-score-pill">
                ATS Match: <strong>{generatedResults.atsFinal.score}%</strong>
              </span>
            </div>

            <div className="results-tabs-row">
              <button 
                className={`res-tab-btn ${resultSubTab === 'cv' ? 'active' : ''}`}
                onClick={() => setResultSubTab('cv')}
              >
                <FileText size={16} />
                <span>1. Tailored ATS CV</span>
              </button>

              <button 
                className={`res-tab-btn ${resultSubTab === 'cover-letter' ? 'active' : ''}`}
                onClick={() => setResultSubTab('cover-letter')}
              >
                <Mail size={16} />
                <span>2. Cover Letter & Email</span>
              </button>

              <button 
                className={`res-tab-btn ${resultSubTab === 'interview' ? 'active' : ''}`}
                onClick={() => setResultSubTab('interview')}
              >
                <HelpCircle size={16} />
                <span>3. Interview Q&A Kit</span>
              </button>

              <button 
                className={`res-tab-btn ${resultSubTab === 'tracker' ? 'active' : ''}`}
                onClick={() => setResultSubTab('tracker')}
              >
                <Layers size={16} />
                <span>4. Application Ledger Card</span>
              </button>
            </div>

            <div className="results-download-actions">
              <button 
                className="btn-accent-gradient"
                onClick={handleDownloadAll}
                title="Download all generated materials in a single file"
              >
                <Download size={15} />
                <span>Download All Files (.txt)</span>
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: Tailored ATS CV */}
          {resultSubTab === 'cv' && (
            <div className="glass-card result-content-card">
              <div className="card-top-action-bar">
                <div className="matched-keywords-summary">
                  <span className="summary-title">Keywords matched ({generatedResults.atsFinal.matchedKeywords.length}):</span>
                  {generatedResults.atsFinal.matchedKeywords.slice(0, 8).map((kw, i) => (
                    <span key={i} className="keyword-badge matched">
                      <Check size={11} /> {kw}
                    </span>
                  ))}
                </div>

                <div className="action-buttons-group">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleCopy(generatedResults.tailoredCv, 'Tailored CV')}
                  >
                    {copiedSection === 'Tailored CV' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                    <span>{copiedSection === 'Tailored CV' ? 'Copied!' : 'Copy CV'}</span>
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => window.print()}
                  >
                    <Printer size={14} />
                    <span>Print ATS PDF</span>
                  </button>
                </div>
              </div>

              <textarea 
                className="custom-textarea font-mono"
                rows={18}
                value={generatedResults.tailoredCv}
                onChange={(e) => setGeneratedResults({
                  ...generatedResults,
                  tailoredCv: e.target.value
                })}
              />
            </div>
          )}

          {/* Sub-Tab 2: Cover Letter & HR Cold Email */}
          {resultSubTab === 'cover-letter' && (
            <div className="one-click-two-col-grid">
              {/* Cover Letter */}
              <div className="glass-card result-content-card">
                <div className="card-top-action-bar">
                  <h4>Formal Cover Letter</h4>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleCopy(generatedResults.coverLetter, 'Cover Letter')}
                  >
                    {copiedSection === 'Cover Letter' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                    <span>{copiedSection === 'Cover Letter' ? 'Copied' : 'Copy Letter'}</span>
                  </button>
                </div>
                <textarea 
                  className="custom-textarea"
                  rows={15}
                  value={generatedResults.coverLetter}
                  onChange={(e) => setGeneratedResults({
                    ...generatedResults,
                    coverLetter: e.target.value
                  })}
                />
              </div>

              {/* HR Cold Outreach Email */}
              <div className="glass-card result-content-card">
                <div className="card-top-action-bar">
                  <h4>HR Recruiter Cold Email</h4>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleCopy(generatedResults.coldEmail, 'HR Cold Email')}
                  >
                    {copiedSection === 'HR Cold Email' ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                    <span>{copiedSection === 'HR Cold Email' ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <textarea 
                  className="custom-textarea"
                  rows={15}
                  value={generatedResults.coldEmail}
                  onChange={(e) => setGeneratedResults({
                    ...generatedResults,
                    coldEmail: e.target.value
                  })}
                />
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Interview Q&A Kit */}
          {resultSubTab === 'interview' && (
            <div className="interview-results-container">
              <h3 className="section-subheading">Behavioral HR Questions (STAR Framework Answers)</h3>
              <div className="interview-cards-grid">
                {generatedResults.interviewKit.hrQuestions.map((q, i) => (
                  <div key={q.id} className="glass-card question-card">
                    <div className="q-badge-row">
                      <span className="q-number">Q{i + 1}</span>
                      <span className="q-category-tag">{q.category}</span>
                    </div>
                    <h4 className="question-text">{q.question}</h4>

                    <div className="star-grid" style={{ marginTop: '0.75rem' }}>
                      <div className="star-card">
                        <span className="star-label s">Situation</span>
                        <p>{q.starAnswer.situation}</p>
                      </div>
                      <div className="star-card">
                        <span className="star-label t">Task</span>
                        <p>{q.starAnswer.task}</p>
                      </div>
                      <div className="star-card">
                        <span className="star-label a">Action</span>
                        <p>{q.starAnswer.action}</p>
                      </div>
                      <div className="star-card">
                        <span className="star-label r">Result</span>
                        <p>{q.starAnswer.result}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="section-subheading" style={{ marginTop: '1.5rem' }}>Technical Architecture Questions & Model Answers</h3>
              <div className="interview-cards-grid">
                {generatedResults.interviewKit.technicalQuestions.map((q, i) => (
                  <div key={q.id} className="glass-card question-card tech-q-card">
                    <div className="q-badge-row">
                      <span className="q-number tech">Tech Q{i + 1}</span>
                      <span className="q-category-tag tech">{q.category}</span>
                    </div>
                    <h4 className="question-text">{q.question}</h4>
                    <div className="model-answer-pre" style={{ marginTop: '0.75rem' }}>
                      <pre>{q.modelAnswer}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Application in Tracker */}
          {resultSubTab === 'tracker' && (
            <div className="glass-card result-content-card tracker-preview-card">
              <div className="card-top-action-bar">
                <div className="card-title-group">
                  <CheckCircle2 size={18} className="text-emerald" />
                  <h4>Saved in Applications Document Ledger</h4>
                </div>
                <button 
                  className="btn-primary-gradient"
                  onClick={() => onNavigateToTab('tracker')}
                >
                  <span>Open Full Tracker Ledger</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              <div className="tracker-card-summary">
                <div className="tracker-detail-row">
                  <span className="label">Company:</span>
                  <span className="val font-bold">{company}</span>
                </div>
                <div className="tracker-detail-row">
                  <span className="label">Role:</span>
                  <span className="val">{jobTitle}</span>
                </div>
                <div className="tracker-detail-row">
                  <span className="label">Current Status:</span>
                  <span className="status-pill-highlight">
                    {generatedResults.applicationRecord.status}
                  </span>
                  <span className="helper-hint">(You can change status in the Applications Ledger tab anytime)</span>
                </div>
                <div className="tracker-detail-row">
                  <span className="label">ATS Match Score:</span>
                  <span className="val text-emerald font-bold">{generatedResults.atsFinal.score}%</span>
                </div>
                <div className="tracker-detail-row">
                  <span className="label">Tracked Notes:</span>
                  <span className="val">{generatedResults.applicationRecord.notes}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden print container */}
      {generatedResults && (
        <div className="printable-resume">
          <pre>{generatedResults.tailoredCv}</pre>
        </div>
      )}
    </div>
  );
}
