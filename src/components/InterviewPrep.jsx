import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Award, 
  Sparkles, 
  BookOpen, 
  Terminal, 
  MessageSquare, 
  Printer, 
  Check, 
  Flame, 
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { generateInterviewKit } from '../utils/atsEngine';

export default function InterviewPrep({ 
  initialData, 
  onSaveToTracker 
}) {
  const [role, setRole] = useState(initialData?.role || 'Senior Software Engineer');
  const [company, setCompany] = useState(initialData?.company || 'Stripe');
  const [activeCategory, setActiveCategory] = useState('hr'); // 'hr' | 'technical' | 'reverse'
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [masteredItems, setMasteredItems] = useState({});
  const [candidateNotes, setCandidateNotes] = useState({});

  const interviewKit = useMemo(() => {
    return generateInterviewKit(role, company, initialData?.keywords || ['TypeScript', 'React', 'Node.js', 'PostgreSQL']);
  }, [role, company, initialData]);

  const toggleReveal = (id) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleMastered = (id) => {
    setMasteredItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNoteChange = (id, text) => {
    setCandidateNotes(prev => ({
      ...prev,
      [id]: text
    }));
  };

  const currentQuestions = activeCategory === 'hr' 
    ? interviewKit.hrQuestions 
    : activeCategory === 'technical' 
      ? interviewKit.technicalQuestions 
      : interviewKit.questionsToAskInterviewer;

  const totalQuestions = interviewKit.hrQuestions.length + interviewKit.technicalQuestions.length;
  const masteredCount = Object.values(masteredItems).filter(Boolean).length;
  const masteryPercentage = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  return (
    <div className="tab-page-container interview-page">
      {/* Header */}
      <div className="page-header-banner no-print">
        <div className="header-text-content">
          <div className="badge-pill">
            <HelpCircle size={14} />
            <span>Role-Specific Interview Simulator</span>
          </div>
          <h1>Targeted Interview Q&A Kit</h1>
          <p>
            Master both behavioral HR questions (structured using the gold-standard <strong>STAR Framework</strong>) and deep-dive technical architecture challenges tailored for <strong>{company}</strong>.
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="interview-readiness-card">
          <div className="readiness-header">
            <Award size={18} className="text-emerald" />
            <span>Interview Readiness</span>
            <span className="readiness-pct">{masteryPercentage}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
          <span className="readiness-subtitle">
            {masteredCount} of {totalQuestions} questions mastered
          </span>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="interview-nav-strip no-print">
        <div className="category-tabs-group">
          <button 
            className={`cat-tab ${activeCategory === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveCategory('hr')}
          >
            <MessageSquare size={16} />
            <span>HR & Behavioral ({interviewKit.hrQuestions.length})</span>
          </button>
          <button 
            className={`cat-tab ${activeCategory === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveCategory('technical')}
          >
            <Terminal size={16} />
            <span>Technical & Architecture ({interviewKit.technicalQuestions.length})</span>
          </button>
          <button 
            className={`cat-tab ${activeCategory === 'reverse' ? 'active' : ''}`}
            onClick={() => setActiveCategory('reverse')}
          >
            <Sparkles size={16} />
            <span>Questions to Ask Them ({interviewKit.questionsToAskInterviewer.length})</span>
          </button>
        </div>

        <div className="interview-actions-group">
          <button 
            className="btn-secondary"
            onClick={() => window.print()}
            title="Print complete interview cheat sheet"
          >
            <Printer size={15} />
            <span>Print Cheat Sheet</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-container no-print">
        {activeCategory === 'hr' && (
          <div className="questions-list">
            {interviewKit.hrQuestions.map((q, idx) => {
              const isRevealed = revealedAnswers[q.id];
              const isMastered = masteredItems[q.id];

              return (
                <div key={q.id} className={`glass-card question-card ${isMastered ? 'mastered' : ''}`}>
                  <div className="question-header">
                    <div className="q-badge-row">
                      <span className="q-number">Q{idx + 1}</span>
                      <span className="q-category-tag">{q.category}</span>
                      {isMastered && (
                        <span className="q-mastered-tag">
                          <Check size={12} /> Mastered
                        </span>
                      )}
                    </div>
                    <h3 className="question-text">{q.question}</h3>
                    <div className="hr-intent-box">
                      <strong>🎯 What HR is testing:</strong> {q.whatHrLooksFor}
                    </div>
                  </div>

                  {/* Reveal / Hide Action */}
                  <div className="question-action-bar">
                    <button 
                      className="btn-reveal"
                      onClick={() => toggleReveal(q.id)}
                    >
                      {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                      <span>{isRevealed ? 'Hide Model Answer' : 'Reveal STAR Framework Answer'}</span>
                    </button>

                    <button 
                      className={`btn-mastery ${isMastered ? 'active' : ''}`}
                      onClick={() => toggleMastered(q.id)}
                    >
                      <CheckCircle2 size={15} />
                      <span>{isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}</span>
                    </button>
                  </div>

                  {/* Revealed STAR Answer */}
                  {isRevealed && (
                    <div className="star-answer-block">
                      <div className="star-grid">
                        <div className="star-card">
                          <span className="star-label s">S - Situation</span>
                          <p>{q.starAnswer.situation}</p>
                        </div>
                        <div className="star-card">
                          <span className="star-label t">T - Task</span>
                          <p>{q.starAnswer.task}</p>
                        </div>
                        <div className="star-card">
                          <span className="star-label a">A - Action</span>
                          <p>{q.starAnswer.action}</p>
                        </div>
                        <div className="star-card">
                          <span className="star-label r">R - Result</span>
                          <p>{q.starAnswer.result}</p>
                        </div>
                      </div>

                      <div className="pro-tip-banner">
                        <Flame size={15} className="text-amber" />
                        <span><strong>Pro-Tip:</strong> {q.proTip}</span>
                      </div>

                      {/* Candidate Personal Notes */}
                      <div className="candidate-notes-area">
                        <label>Your Personal Example / Talking Points:</label>
                        <textarea 
                          rows={2}
                          placeholder="Jot down a real story from your past experience to use for this question..."
                          value={candidateNotes[q.id] || ''}
                          onChange={(e) => handleNoteChange(q.id, e.target.value)}
                          className="custom-textarea note-textarea"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'technical' && (
          <div className="questions-list">
            {interviewKit.technicalQuestions.map((q, idx) => {
              const isRevealed = revealedAnswers[q.id];
              const isMastered = masteredItems[q.id];

              return (
                <div key={q.id} className={`glass-card question-card tech-q-card ${isMastered ? 'mastered' : ''}`}>
                  <div className="question-header">
                    <div className="q-badge-row">
                      <span className="q-number tech">Q{idx + 1}</span>
                      <span className="q-category-tag tech">{q.category}</span>
                      {isMastered && (
                        <span className="q-mastered-tag">
                          <Check size={12} /> Mastered
                        </span>
                      )}
                    </div>
                    <h3 className="question-text">{q.question}</h3>
                    <div className="concepts-pills-row">
                      <span className="concepts-label">Core Concepts:</span>
                      {q.keyConcepts.map((concept, i) => (
                        <span key={i} className="concept-pill">{concept}</span>
                      ))}
                    </div>
                  </div>

                  <div className="question-action-bar">
                    <button 
                      className="btn-reveal"
                      onClick={() => toggleReveal(q.id)}
                    >
                      {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                      <span>{isRevealed ? 'Hide Architectural Solution' : 'Reveal Model Solution & Code Architecture'}</span>
                    </button>

                    <button 
                      className={`btn-mastery ${isMastered ? 'active' : ''}`}
                      onClick={() => toggleMastered(q.id)}
                    >
                      <CheckCircle2 size={15} />
                      <span>{isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="tech-answer-block">
                      <div className="model-answer-pre">
                        <pre>{q.modelAnswer}</pre>
                      </div>

                      <div className="pro-tip-banner watchout-banner">
                        <Flame size={15} className="text-rose" />
                        <span><strong>Interviewer Trap / Watchout:</strong> {q.interviewerWatchout}</span>
                      </div>

                      <div className="candidate-notes-area">
                        <label>Your Architectural Notes:</label>
                        <textarea 
                          rows={2}
                          placeholder="Type reminders or custom trade-offs you want to highlight during the technical interview..."
                          value={candidateNotes[q.id] || ''}
                          onChange={(e) => handleNoteChange(q.id, e.target.value)}
                          className="custom-textarea note-textarea"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'reverse' && (
          <div className="reverse-questions-grid">
            <div className="reverse-intro-banner glass-card">
              <Sparkles size={20} className="text-accent" />
              <div>
                <h4>Why Reverse Questions Win Job Offers:</h4>
                <p>The questions you ask at the end of the interview signal your seniority, critical thinking, and genuine passion for the team's engineering velocity.</p>
              </div>
            </div>

            {interviewKit.questionsToAskInterviewer.map((item, idx) => (
              <div key={idx} className="glass-card reverse-q-card">
                <span className="reverse-cat-tag">{item.category}</span>
                <p className="reverse-text">"{item.question}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Printable Cheat Sheet for Physical / Paper Review */}
      <div className="printable-resume">
        <h1 style={{ borderBottom: '2px solid black', paddingBottom: '6px' }}>
          Interview Preparation Cheat Sheet — {role} @ {company}
        </h1>
        <h2 style={{ marginTop: '14px' }}>Behavioral HR Questions (STAR Framework)</h2>
        {interviewKit.hrQuestions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: '14px' }}>
            <p><strong>Q{i + 1}: {q.question}</strong></p>
            <p><em>STAR Answer:</em></p>
            <ul>
              <li><strong>S:</strong> {q.starAnswer.situation}</li>
              <li><strong>T:</strong> {q.starAnswer.task}</li>
              <li><strong>A:</strong> {q.starAnswer.action}</li>
              <li><strong>R:</strong> {q.starAnswer.result}</li>
            </ul>
          </div>
        ))}

        <h2 style={{ marginTop: '16px' }}>Technical Architecture Questions</h2>
        {interviewKit.technicalQuestions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: '14px' }}>
            <p><strong>Q{i + 1}: {q.question}</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '9pt' }}>{q.modelAnswer}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
