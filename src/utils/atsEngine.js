// Comprehensive ATS Analysis & Career Preparation Engine

// Standard Tech, Business, and Soft Skill Keyword Dictionaries
export const SKILL_CATEGORIES = {
  frontend: ['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'Webpack', 'Vite', 'GraphQL', 'REST APIs', 'Responsive Design', 'Web Accessibility (a11y)', 'State Management', 'Jest', 'Cypress'],
  backend: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'Go', 'Golang', 'Ruby on Rails', 'PHP', 'Microservices', 'Event-Driven Architecture', 'Kafka', 'RabbitMQ', 'gRPC', 'API Design'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'SQL Server', 'Oracle', 'Prisma', 'TypeORM', 'Database Indexing', 'Query Optimization', 'Data Modeling'],
  cloudDevops: ['AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Terraform', 'Serverless', 'Linux', 'Nginx', 'Prometheus', 'Grafana', 'Security Compliance'],
  methodologies: ['Agile', 'Scrum', 'Kanban', 'TDD', 'Test-Driven Development', 'CI/CD Pipelines', 'Code Reviews', 'System Architecture', 'Design Patterns', 'Cross-Functional Collaboration'],
  softSkills: ['Problem Solving', 'Communication', 'Leadership', 'Mentorship', 'Critical Thinking', 'Project Management', 'Stakeholder Management', 'Adaptability', 'Time Management', 'Ownership', 'Analytical Skills']
};

// Common Action Verbs for ATS Google XYZ Resume Bullet Points
export const ACTION_VERBS = [
  'Architected', 'Spearheaded', 'Optimized', 'Engineered', 'Accelerated',
  'Automated', 'Scaled', 'Implemented', 'Orchestrated', 'Delivered',
  'Revamped', 'Streamlined', 'Enhanced', 'Reduced', 'Increased'
];

/**
 * Extract keywords from job description text
 */
export function extractKeywords(jobText) {
  if (!jobText || typeof jobText !== 'string') return [];
  const normalizedText = jobText.toLowerCase();

  const found = new Set();
  const allDictionarySkills = Object.values(SKILL_CATEGORIES).flat();

  // 1. Match from curated technology and skill dictionary
  allDictionarySkills.forEach(skill => {
    // Escape regex characters
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(jobText)) {
      found.add(skill);
    }
  });

  // 2. Extract capitalized high-frequency technical patterns (e.g., CI/CD, AWS, APIs)
  const capitalizedMatches = jobText.match(/\b[A-Z][a-zA-Z0-9+#.]{2,}\b/g) || [];
  const stopwords = new Set(['The', 'And', 'For', 'With', 'You', 'Will', 'Our', 'Job', 'Team', 'Role', 'Work', 'Join', 'This', 'That', 'Have', 'Must', 'Plus', 'Nice', 'About', 'What', 'Need', 'Year', 'Years', 'Self', 'Both', 'From', 'Each', 'High', 'Fast']);
  
  capitalizedMatches.forEach(word => {
    if (!stopwords.has(word) && word.length > 2 && isNaN(word)) {
      // Check if reasonably technical or skill-like
      if (/^[A-Z]{2,}$/.test(word) || /[A-Z][a-z]+[A-Z]/.test(word)) {
        found.add(word);
      }
    }
  });

  return Array.from(found);
}

/**
 * Calculate ATS Match Score between Master CV and Job Description
 */
export function calculateAtsScore(cvText, jobKeywords) {
  if (!cvText || !jobKeywords || jobKeywords.length === 0) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      details: { keywordMatch: 0, metricPoints: 0, formattingScore: 70 }
    };
  }

  const cvLower = cvText.toLowerCase();
  const matched = [];
  const missing = [];

  jobKeywords.forEach(kw => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(cvText)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  // Keyword match percentage (weight: 60%)
  const keywordRatio = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) : 0;
  const keywordScore = Math.round(keywordRatio * 100);

  // Measurable metrics detection (e.g., %, $, numbers, "reduced latency by 40%") (weight: 25%)
  const metricMatches = (cvText.match(/(\d+%\s*|\$\s*\d+|\b\d+\s*(ms|x|k|users|clients|requests|projects|members)\b)/gi) || []).length;
  const metricScore = Math.min(100, metricMatches * 15 + 40);

  // ATS Formatting Compliance check (weight: 15%)
  let formattingScore = 100;
  if (cvText.includes('<table>') || cvText.includes('<column>')) formattingScore -= 20;
  if (!/experience|work history/i.test(cvText)) formattingScore -= 20;
  if (!/skills|technical skills/i.test(cvText)) formattingScore -= 20;
  if (!/education/i.test(cvText)) formattingScore -= 10;
  if (!/email|phone|linkedin/i.test(cvText)) formattingScore -= 10;
  formattingScore = Math.max(30, formattingScore);

  // Weighted total score
  const totalScore = Math.round((keywordScore * 0.6) + (metricScore * 0.25) + (formattingScore * 0.15));

  return {
    score: Math.min(98, Math.max(10, totalScore)),
    matchedKeywords: matched,
    missingKeywords: missing,
    details: {
      keywordMatch: keywordScore,
      metricPoints: metricScore,
      formattingScore: formattingScore,
      metricsCount: metricMatches
    }
  };
}

/**
 * Intelligent ATS Resume Re-writer:
 * Enhances CV summary and experiences with missing keywords and quantified impact
 */
export function generateTailoredCv(masterCv, jobTitle, company, jobKeywords, missingKeywords) {
  if (!masterCv) return '';

  const topTargetKeywords = jobKeywords.slice(0, 8);
  const keywordsToInject = missingKeywords.slice(0, 5);

  let tailored = masterCv;

  // 1. Optimize Professional Summary if present
  const summaryRegex = /(SUMMARY|PROFESSIONAL SUMMARY|ABOUT ME)[\s\S]*?(?=(EXPERIENCE|WORK EXPERIENCE|SKILLS|TECHNICAL SKILLS|PROJECTS|EDUCATION))/i;
  const summaryMatch = tailored.match(summaryRegex);

  const cleanTitle = jobTitle || 'Target Role';
  const cleanCompany = company ? `at ${company}` : '';

  const newSummary = `PROFESSIONAL SUMMARY
Results-driven ${cleanTitle} with a proven track record in architecting high-performance systems and delivering scalable software solutions ${cleanCompany}. Expertise across ${topTargetKeywords.slice(0, 4).join(', ')}, with demonstrated success accelerating product velocity, reducing latency, and collaborating across cross-functional teams to exceed business objectives. Dedicated to clean code, robust system reliability, and driving continuous innovation.\n\n`;

  if (summaryMatch) {
    tailored = tailored.replace(summaryRegex, newSummary);
  } else {
    tailored = newSummary + tailored;
  }

  // 2. Enhance or update Technical Skills section
  const skillsRegex = /(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)[\s\S]*?(?=(EXPERIENCE|WORK EXPERIENCE|PROJECTS|EDUCATION|$))/i;
  const skillsMatch = tailored.match(skillsRegex);

  if (skillsMatch && keywordsToInject.length > 0) {
    const existingSkillsBlock = skillsMatch[0];
    const updatedSkillsBlock = existingSkillsBlock.trim() + `\n- Additional Core Proficiencies: ${keywordsToInject.join(', ')}\n\n`;
    tailored = tailored.replace(skillsRegex, updatedSkillsBlock);
  }

  // 3. Ensure bullet points contain action verbs and quantified impact
  const lines = tailored.split('\n');
  const enhancedLines = lines.map(line => {
    const trimmed = line.trim();
    // If it's a weak bullet point starting with '-' or '•'
    if (/^[•\-*]\s*(Responsible for|Worked on|Assisted in|Helped with)\b/i.test(trimmed)) {
      const verb = ACTION_VERBS[Math.floor(Math.random() * ACTION_VERBS.length)];
      return trimmed.replace(/^[•\-*]\s*(Responsible for|Worked on|Assisted in|Helped with)\b/i, `• ${verb}`);
    }
    return line;
  });

  return enhancedLines.join('\n');
}

/**
 * Generate Tailored Cover Letter & Cold HR Email
 */
export function generateCoverLetter(candidateName, role, company, jobDesc, matchedSkills) {
  const cName = candidateName || 'Candidate';
  const targetRole = role || 'Senior Specialist';
  const targetCompany = company || 'your organization';
  const keySkills = matchedSkills && matchedSkills.length > 0 
    ? matchedSkills.slice(0, 4).join(', ') 
    : 'software engineering, scalable architecture, and cross-functional leadership';

  const coverLetter = `Dear Hiring Team at ${targetCompany},

I am writing to express my strong enthusiasm for the ${targetRole} position at ${targetCompany}. Having followed ${targetCompany}'s technological milestones and commitment to excellence, I am confident that my background in ${keySkills} directly aligns with your team's goals and technical roadmap.

Throughout my career, I have focused on building robust, scalable solutions that drive measurable business outcomes. In my recent roles, I have:
• Spearheaded high-impact initiatives leveraging ${matchedSkills[0] || 'core technologies'}, improving system throughput by 35% and enhancing reliability.
• Collaborated closely with product managers, designers, and engineering peers to deliver mission-critical features on accelerated schedules.
• Mentored junior engineers and championed engineering best practices, including automated testing, CI/CD observability, and clean architecture.

What excites me most about joining ${targetCompany} is the opportunity to tackle complex challenges alongside a world-class team. The requirements listed in your job description for ${targetRole}—specifically regarding hands-on ownership and technical innovation—resonate deeply with my professional trajectory.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my technical expertise and problem-solving mindset can contribute to ${targetCompany}'s continued success.

Sincerely,
${cName}
`;

  const coldEmail = `Subject: Application: ${targetRole} - ${cName} (Excited about ${targetCompany})

Hi [Hiring Manager / Recruiter Name],

I hope this email finds you well.

I recently noticed the opening for the ${targetRole} role at ${targetCompany} and felt compelled to reach out directly. With deep hands-on expertise in ${keySkills}, I have consistently helped engineering teams scale platforms, reduce system bottlenecks, and deliver high-visibility user-facing products.

A few quick highlights of how I can add immediate value:
1. Proven experience delivering production-grade systems using ${matchedSkills[0] || 'modern tech stacks'}.
2. Track record of optimizing performance and reducing latency across distributed architectures.
3. Rapid adaptability in agile, high-growth engineering environments.

I have attached my tailored resume for your review. Would you or someone on the recruiting team have 10-15 minutes this week for a brief introductory call?

Best regards,

${cName}
[LinkedIn Profile Link] | [Phone Number] | [GitHub / Portfolio]
`;

  const linkedInMessage = `Hi [Name],

I came across the ${targetRole} opening at ${targetCompany} and was very impressed by your team's recent work. Given my background in ${keySkills}, I believe I could make an immediate positive contribution.

I'd love to connect and share a brief overview of my recent projects if you are open to a quick chat. Thank you for your time!

Best,
${cName}
`;

  return { coverLetter, coldEmail, linkedInMessage };
}

/**
 * Generate Interview Prep Kit (HR Behavioral + Technical Q&A + Questions to Ask)
 */
export function generateInterviewKit(role, company, keywords) {
  const targetRole = role || 'Target Position';
  const targetCompany = company || 'the company';
  const primarySkill = keywords && keywords.length > 0 ? keywords[0] : 'System Architecture';
  const secondarySkill = keywords && keywords.length > 1 ? keywords[1] : 'Modern Frameworks';
  const thirdSkill = keywords && keywords.length > 2 ? keywords[2] : 'Agile & DevOps';

  const hrQuestions = [
    {
      id: 'hr-1',
      question: `Tell me about yourself and why you're interested in the ${targetRole} role at ${targetCompany}?`,
      category: 'Introduction & Motivation',
      whatHrLooksFor: 'Clear communication, career progression narrative, specific knowledge of the company, and genuine enthusiasm.',
      starAnswer: {
        situation: `Over the past several years, I have built a career specializing in ${primarySkill} and modern engineering practices.`,
        task: `I noticed ${targetCompany}'s rapid innovation in this space and sought an opportunity where I could take ownership of core technical challenges.`,
        action: `I have deepened my expertise across ${primarySkill} and ${secondarySkill}, while continuously delivering measurable results in fast-paced teams.`,
        result: `Joining ${targetCompany} as a ${targetRole} is the natural next step where my technical strengths and product-oriented mindset can directly accelerate your roadmap.`
      },
      proTip: 'Keep your answer under 2 minutes. Structure as: Past foundation -> Recent achievements -> Why this exact company right now.'
    },
    {
      id: 'hr-2',
      question: 'Describe a time you faced a major technical disagreement with a teammate or stakeholder. How did you resolve it?',
      category: 'Conflict & Collaboration',
      whatHrLooksFor: 'Emotional intelligence, objective data-driven decision making, humility, and prioritizing business goals over ego.',
      starAnswer: {
        situation: 'During a critical sprint, a senior colleague and I had opposing views on whether to use a monolithic approach vs. microservices for a new service.',
        task: 'We needed to finalize the architecture without delaying the quarterly milestone.',
        action: 'Rather than debating hypotheticals, I proposed building a rapid 1-day benchmark prototype measuring latency, developer ergonomics, and deployment complexity. We reviewed the telemetry data together with the team lead.',
        result: 'The data clearly demonstrated the optimal tradeoff. We aligned amicably, delivered on time, and established an objective benchmarking rubric used across subsequent projects.'
      },
      proTip: 'Never speak negatively about colleagues. Frame disagreements as healthy opportunities to test assumptions with data.'
    },
    {
      id: 'hr-3',
      question: 'Tell me about a time a project failed or went off-schedule. What happened, and what did you learn?',
      category: 'Resilience & Accountability',
      whatHrLooksFor: 'Radical accountability, blameless post-mortem analysis, and proactive corrective actions.',
      starAnswer: {
        situation: 'We deployed a major feature right before a holiday weekend, and unexpected traffic spikes caused latency degradation.',
        task: 'As the lead developer, I had to immediately stabilize the system and communicate transparently with stakeholders.',
        action: 'I rolled back to the stable release within 8 minutes, initiated an incident response channel, and conducted a thorough root cause analysis the following Monday.',
        result: 'We implemented automated load-testing into the CI/CD pipeline and established strict change freezes prior to holidays, achieving zero downtime on all subsequent releases.'
      },
      proTip: 'Acknowledge the mistake cleanly without defensive excuses. Highlight the permanent guardrails you put in place.'
    },
    {
      id: 'hr-4',
      question: `Where do you see yourself professionally in the next 2-3 years, and how does this position fit in?`,
      category: 'Career Growth',
      whatHrLooksFor: 'Ambition, commitment, realistic expectations, and alignment with the company\'s trajectory.',
      starAnswer: {
        situation: 'I am focused on mastering high-scale architecture while expanding my technical mentorship responsibilities.',
        task: 'In 2-3 years, I aim to be recognized as a go-to subject matter expert in our core stack at ${targetCompany}.',
        action: 'I plan to contribute not only by writing clean, resilient code, but by driving RFC architectural reviews and onboarding new engineers.',
        result: 'This allows me to grow into a senior leadership role while directly multiplying the productivity of the engineering organization.'
      },
      proTip: 'Express growth in terms of impact and leadership, rather than just job titles.'
    }
  ];

  const technicalQuestions = [
    {
      id: 'tech-1',
      question: `How would you architect a production-grade system using ${primarySkill} that handles high concurrency and ensures 99.99% availability?`,
      category: 'System Architecture',
      keyConcepts: ['Horizontal scaling', 'Stateless services', 'Caching (Redis)', 'Database read replicas', 'Circuit breakers'],
      modelAnswer: `To guarantee high availability and handle concurrency with ${primarySkill}:
1. **Stateless Service Layer**: Run multiple instances behind an elastic Application Load Balancer (ALB) with auto-scaling based on CPU and request queue depth.
2. **Caching Strategy**: Implement a multi-tier cache using in-memory local caches for hot data and a distributed Redis cluster with TTLs and cache-aside pattern to protect the database.
3. **Database Optimization**: Utilize connection pooling, read replicas for heavy query loads, and proper indexing. For write-heavy operations, introduce message queues (Kafka / RabbitMQ) to decouple and buffer ingestion.
4. **Fault Tolerance**: Integrate circuit breakers (e.g., Resilience4j) and health checks, with graceful degradation when downstream third-party APIs fail.
5. **Observability**: Comprehensive Prometheus/Grafana metrics, structured JSON logging, and distributed tracing with OpenTelemetry to isolate latency spikes immediately.`,
      interviewerWatchout: 'Be ready to discuss CAP theorem tradeoffs (Consistency vs. Availability) when network partitions occur.'
    },
    {
      id: 'tech-2',
      question: `Explain how you optimize performance bottlenecks when dealing with ${secondarySkill} or large-scale data rendering?`,
      category: 'Performance Engineering',
      keyConcepts: ['Profiling & flamegraphs', 'Virtualization / pagination', 'Memoization', 'Bundle splitting', 'Memory leak prevention'],
      modelAnswer: `Performance optimization must always begin with rigorous profiling rather than premature guesses:
1. **Measurement First**: Use DevTools Performance tab, Lighthouse, or backend APM agents to identify the exact critical path (e.g., heavy CPU cycles, re-renders, N+1 database queries, or I/O blocking).
2. **Data Virtualization & Pagination**: If rendering massive collections, virtualize the list (rendering only visible DOM elements) or implement cursor-based pagination.
3. **Memory & Lifecycle Management**: Prevent memory leaks by properly cleaning up event listeners, WebSocket subscriptions, and interval timers in component teardown phases.
4. **Network & Payload Minimization**: Implement compression (Gzip/Brotli), tree-shaking, dynamic code splitting/lazy loading, and HTTP/2 multiplexing.`,
      interviewerWatchout: 'Always emphasize measuring with numbers (e.g., "reduced initial bundle size from 2.4MB to 420KB, dropping LCP by 60%").'
    },
    {
      id: 'tech-3',
      question: `How do you handle security vulnerabilities, authentication, and data integrity in applications utilizing ${thirdSkill}?`,
      category: 'Security & Reliability',
      keyConcepts: ['OWASP Top 10', 'JWT with refresh tokens & HttpOnly cookies', 'Input sanitization / SQLi prevention', 'CORS & CSP', 'Rate limiting'],
      modelAnswer: `Security must be embedded across every layer of the software lifecycle:
1. **Authentication & Session Security**: Use cryptographically signed JWTs stored in HttpOnly, Secure, SameSite cookies to mitigate XSS attacks. Implement short token lifespans paired with rotating refresh tokens stored securely.
2. **Injection Defense**: Enforce parameterized queries or ORM abstractions to prevent SQL/NoSQL injection, and sanitize user-generated markup to thwart stored XSS.
3. **Transport & Network**: Enforce strict TLS 1.3, configure Content Security Policy (CSP) headers, and validate origin with strict CORS configurations.
4. **Rate Limiting & DoS Protection**: Implement token-bucket or sliding-window rate limiting on public and authentication endpoints (e.g., Redis-based rate limiting).
5. **Dependency Auditing**: Integrate automated vulnerability scanning (Snyk, Dependabot, npm audit) directly into the CI/CD pipeline to block builds on critical CVEs.`,
      interviewerWatchout: 'Explain why local storage should NEVER be used for sensitive JWT authentication tokens.'
    },
    {
      id: 'tech-4',
      question: 'What is your approach to automated testing and maintaining code quality in high-velocity agile sprints?',
      category: 'Testing & Quality Assurance',
      keyConcepts: ['Test Pyramid', 'Unit vs Integration vs E2E', 'Mocking strategies', 'Mutation testing', 'Coverage targets'],
      modelAnswer: `I advocate for a balanced Testing Pyramid that maximizes confidence without crippling development velocity:
1. **Unit Tests (70%)**: Fast, isolated tests for pure business logic, calculations, and utility functions using lightweight test runners.
2. **Integration Tests (20%)**: Testing API endpoints and database interactions using containerized test environments (e.g., Testcontainers) rather than excessive mocks.
3. **End-to-End Tests (10%)**: Critical user journeys (login, checkout, onboarding) verified through automated headless browser runs (Playwright / Cypress).
4. **CI Enforcement**: Automated pre-commit hooks (Husky, linter, typecheck) and pull request gates ensuring tests pass and coverage does not regress before any merge to main.`,
      interviewerWatchout: 'Emphasize testing behavior and contracts rather than brittle implementation details.'
    }
  ];

  const questionsToAskInterviewer = [
    {
      category: 'Engineering Culture & Architecture',
      question: `What are the biggest technical hurdles or architectural refactors the team is planning to tackle over the next 6 to 12 months?`
    },
    {
      category: 'Team Dynamics & Velocity',
      question: `How does the team balance shipping new product features versus addressing technical debt and infrastructure improvements?`
    },
    {
      category: 'Success Metrics',
      question: `What does a truly outstanding first 90 days look like for someone stepping into this ${targetRole} role?`
    },
    {
      category: 'Growth & Support',
      question: `Can you share an example of an engineer on this team who was promoted or championed a major cross-team project, and how the company supported them?`
    },
    {
      category: 'Strategic Vision',
      question: `What makes you personally most excited about ${targetCompany}'s direction right now compared to your competitors?`
    }
  ];

  return { hrQuestions, technicalQuestions, questionsToAskInterviewer };
}

/**
 * Smart Auto-detection of Job Title, Company, and Salary from Job Description text
 */
export function detectJobMeta(text) {
  if (!text) return { title: '', company: '', salary: '' };

  let title = '';
  let company = '';
  let salary = '';

  // 1. Detect Job Title patterns
  const titlePatterns = [
    /(?:Role|Title|Position|Job Title):\s*([^\n\r,]+)/i,
    /(?:looking for|seeking) (?:an?|our next)?\s*([A-Z][A-Za-z0-9\s\/-]{3,35}(?:Engineer|Developer|Architect|Lead|Manager|Specialist|Designer|Analyst|Scientist))/i,
    /^([A-Z][A-Za-z0-9\s\/-]{3,35}(?:Engineer|Developer|Architect|Lead|Manager|Specialist|Designer|Analyst|Scientist))/m
  ];

  for (const pat of titlePatterns) {
    const match = text.match(pat);
    if (match && match[1]) {
      title = match[1].trim();
      break;
    }
  }

  // 2. Detect Company patterns
  const companyPatterns = [
    /(?:Company|Organization):\s*([^\n\r,]+)/i,
    /(?:About|Join|Life at)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)?)/i,
    /(?:at|with)\s+([A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+)?)\b(?:\s+builds|\s+is)/i
  ];

  for (const pat of companyPatterns) {
    const match = text.match(pat);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (!['The', 'Our', 'This', 'We', 'You'].includes(candidate)) {
        company = candidate;
        break;
      }
    }
  }

  // 3. Detect Salary patterns
  const salaryMatch = text.match(/(\$\s*\d{2,3}(?:,\d{3})*(?:\s*-\s*\$?\s*\d{2,3}(?:,\d{3})*)?(?:\s*(?:k|yr|year|annually|\/year|\+ equity|\+ bonus))?)/i);
  if (salaryMatch) {
    salary = salaryMatch[1].trim();
  }

  return { title, company, salary };
}
