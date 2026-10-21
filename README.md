# JobRdy — AI-Powered ATS Resume, Cover Letter, Interview Prep & Application Tracker

**JobRdy** is an all-in-one career preparation platform designed to help candidates prepare for job offers, pass Applicant Tracking Systems (ATS), ace behavioral and technical interviews, and track every application in a centralized document pipeline.

---

## 🌟 Key Features

### 1. 📄 Targeted ATS CV Tailor & Keyword Matcher
- **Live ATS Match Gauge (0 - 100%):** Evaluates keyword frequency, measurable impact metrics, and ATS format compliance.
- **Keyword Gap Analysis:** Automatically extracts hard technical skills, tools, and methodologies from the target job description. Differentiates matched keywords (green) from missing keywords (amber).
- **One-Click Missing Keyword Injection:** Click the `+` button on any missing keyword to immediately add it into your CV's technical skills section.
- **Google "XYZ Formula" Bullet Optimization:** Re-architects bullet points into quantified accomplishments (`Accomplished [X] as measured by [Y], by doing [Z]`).
- **Flexible Views:** Side-by-Side comparison (Original vs. ATS Tailored) and tabbed views with live editable textarea.
- **Export Formats:** Copy to clipboard, download `.txt` / `.md`, or print a clean black-and-white ATS-standard PDF via browser print.

### 2. ✉️ Cover Letter & HR Cold Outreach Generator
- **Multi-Channel Templates:**
  - **Standard Cover Letter:** Formally formatted for application portals and PDF attachments.
  - **HR Cold Email:** High-converting 3-paragraph outreach with punchy subject lines designed for recruiter inboxes.
  - **LinkedIn InMail:** Short-form, concise direct message for hiring managers.
- **Tone Customization:** Select between *Confident & Impact-Driven*, *Enthusiastic & Modern*, or *Executive & Formal*.
- **Integrated Skills Injection:** Automatically pulls matching skills from the ATS CV analysis.

### 3. 🎯 Targeted Interview Q&A Kit
- **HR & Behavioral Questions (STAR Framework):**
  - High-yield behavioral questions (Conflict resolution, project setbacks, career trajectory, why this company).
  - Four-quadrant model answers: **Situation**, **Task**, **Action**, **Result**.
  - Insider hints on *"What HR is secretly testing"* and pro-tips.
- **Technical & Architecture Questions:**
  - Deep system design, concurrency, security, and performance questions tailored to the job's tech stack.
  - Architectural blueprints and model solutions with "Interviewer Trap" warnings.
- **Questions to Ask Them:** Strategic questions to impress the hiring committee.
- **Interactive Practice Mode:** Hide/reveal answers to test yourself, mark questions as "Mastered", and print a consolidated Cheat Sheet.

### 4. 📊 Applications Document Ledger & Pipeline Tracker
- **Document / Table View:** Complete ledger showing Company, Role, Status dropdown, Applied Date, Salary, Location, ATS Score, and Notes.
- **Kanban Pipeline Board:** Drag/stage column board tracking positions from *Wishlist* ➔ *Applied* ➔ *HR Screening* ➔ *Tech Interview* ➔ *Final Round* ➔ *Offer Received* ➔ *Rejected*.
- **Instant Status Changer:** Update any application's status in real time. Changing status to **"Offer Received"** triggers a celebratory confetti blast!
- **Data Persistence & Portability:** Auto-saves to `localStorage`. Includes 1-click **Export CSV** (for Excel/Google Sheets) and **Backup / Restore JSON**.

---

## 🚀 Running the Application

### Option A: Using the double-click batch file
Double-click [`start-jobrdy.bat`](file:///D:/ReactProjects/jobRdy/start-jobrdy.bat) in the project folder.

### Option B: Using terminal commands
```powershell
cd D:\ReactProjects\jobRdy
npm install
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:5174/](http://localhost:5174/)** (or the port displayed in your terminal).
