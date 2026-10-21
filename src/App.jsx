import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OneClickGenerator from './components/OneClickGenerator';
import CvTailor from './components/CvTailor';
import CoverLetterGen from './components/CoverLetterGen';
import InterviewPrep from './components/InterviewPrep';
import ApplicationTracker from './components/ApplicationTracker';
import { INITIAL_APPLICATIONS } from './data/sampleData';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('one-click'); // 'one-click' | 'cv' | 'cover-letter' | 'interview' | 'tracker'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('jobrdy_theme') || 'dark';
  });

  // Applications State with LocalStorage Persistence
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('jobrdy_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved applications:', e);
      }
    }
    return INITIAL_APPLICATIONS;
  });

  // Shared Context between Tabs
  const [selectedJobContext, setSelectedJobContext] = useState({
    company: 'Stripe',
    role: 'Senior Software Engineer',
    matchedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    keywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL']
  });

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jobrdy_theme', theme);
  }, [theme]);

  // Sync applications
  useEffect(() => {
    localStorage.setItem('jobrdy_applications', JSON.stringify(applications));
  }, [applications]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Status Change Handler
  const handleUpdateStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return app;
    }));
  };

  // Add Application Handler
  const handleAddApplication = (newApp) => {
    setApplications(prev => [newApp, ...prev]);
  };

  // Edit Application Handler
  const handleEditApplication = (updatedApp) => {
    setApplications(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  // Delete Application Handler
  const handleDeleteApplication = (appId) => {
    if (window.confirm('Are you sure you want to remove this application from the tracker?')) {
      setApplications(prev => prev.filter(app => app.id !== appId));
    }
  };

  // Navigation handlers
  const handleNavigateToCoverLetter = (jobData) => {
    setSelectedJobContext(prev => ({
      ...prev,
      ...jobData
    }));
    setActiveTab('cover-letter');
  };

  const handleNavigateToInterview = (jobData) => {
    setSelectedJobContext(prev => ({
      ...prev,
      ...jobData
    }));
    setActiveTab('interview');
  };

  const handleSelectFromTrackerForCv = (app) => {
    setSelectedJobContext({
      company: app.company,
      role: app.role,
      matchedSkills: app.matchedKeywords || [],
      keywords: app.matchedKeywords || []
    });
    setActiveTab('cv');
  };

  const handleSelectFromTrackerForInterview = (app) => {
    setSelectedJobContext({
      company: app.company,
      role: app.role,
      matchedSkills: app.matchedKeywords || [],
      keywords: app.matchedKeywords || []
    });
    setActiveTab('interview');
  };

  // Save tailored CV or cover letter directly into application tracker
  const handleSaveToTrackerFromTab = (data) => {
    setApplications(prev => {
      const existingIndex = prev.findIndex(
        a => a.company.toLowerCase() === (data.company || '').toLowerCase()
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          ...data,
          role: data.role || copy[existingIndex].role
        };
        return copy;
      } else {
        const newEntry = {
          id: `app-${Date.now()}`,
          company: data.company || 'New Company',
          role: data.role || 'Target Role',
          status: data.status || 'Applied',
          salary: data.salary || '$150,000+',
          location: 'Remote',
          appliedDate: new Date().toISOString().split('T')[0],
          atsScore: data.atsScore || 88,
          notes: data.notes || 'Created via JobRdy suite.',
          matchedKeywords: data.matchedKeywords || [],
          coverLetterSaved: data.coverLetterSaved || false
        };
        return [newEntry, ...prev];
      }
    });
  };

  // Backup & Export Data as JSON
  const handleExportData = () => {
    const backup = {
      applications,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JobRdy_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.applications)) {
          setApplications(data.applications);
          alert(`Successfully imported ${data.applications.length} applications!`);
        } else if (Array.isArray(data)) {
          setApplications(data);
          alert(`Successfully imported ${data.length} applications!`);
        } else {
          alert('Invalid backup format.');
        }
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-wrapper">
      {/* Universal Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        applicationsCount={applications.length}
        onNewApplication={() => setActiveTab('tracker')}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Main Tab View */}
      <main className="app-main-content">
        {activeTab === 'one-click' && (
          <OneClickGenerator 
            onSaveToApplications={handleAddApplication}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'cv' && (
          <CvTailor 
            onSaveToTracker={handleSaveToTrackerFromTab}
            onNavigateToCoverLetter={handleNavigateToCoverLetter}
            onNavigateToInterview={handleNavigateToInterview}
          />
        )}

        {activeTab === 'cover-letter' && (
          <CoverLetterGen 
            initialData={selectedJobContext}
            onSaveToTracker={handleSaveToTrackerFromTab}
            onNavigateToInterview={handleNavigateToInterview}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewPrep 
            initialData={selectedJobContext}
            onSaveToTracker={handleSaveToTrackerFromTab}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTracker 
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onAddApplication={handleAddApplication}
            onEditApplication={handleEditApplication}
            onDeleteApplication={handleDeleteApplication}
            onSelectForCvTailor={handleSelectFromTrackerForCv}
            onSelectForInterview={handleSelectFromTrackerForInterview}
          />
        )}
      </main>
    </div>
  );
}
