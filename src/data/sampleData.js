// Sample Data for Instant Testing and Immediate WOW Experience

export const SAMPLE_MASTER_CV = `ALEX MORGAN
San Francisco, CA | (555) 234-5678 | alex.morgan@email.com | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Dynamic and results-driven Software Engineer with 5+ years of experience designing, architecting, and deploying distributed web applications and high-throughput microservices. Proven expertise in React, TypeScript, Node.js, and cloud platforms. Adept at transforming complex product requirements into resilient, test-driven systems while mentoring teammates and improving developer velocity.

TECHNICAL SKILLS
• Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3/Sass
• Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Vite, Jest, Cypress
• Backend & APIs: Node.js, Express, REST APIs, GraphQL, PostgreSQL, Redis, Prisma
• Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, GitHub Actions, CI/CD Pipelines
• Methodologies: Agile/Scrum, System Architecture, Test-Driven Development (TDD), Microservices

PROFESSIONAL EXPERIENCE

Senior Full Stack Engineer | CloudScale Systems | 2022 - Present
• Spearheaded the re-architecture of the core payments analytics dashboard using React and TypeScript, resulting in a 42% decrease in page load times and serving 250,000+ daily active users.
• Engineered a resilient distributed event processing pipeline with Node.js and Redis, handling 15,000+ concurrent requests per second with 99.98% uptime.
• Automated end-to-end integration testing via GitHub Actions and Cypress, cutting production release defects by 30% and accelerating sprint release cycles from bi-weekly to daily.
• Mentored 4 junior engineers on clean code architecture, code reviews, and API contract design.

Full Stack Software Engineer | Horizon Fintech | 2020 - 2022
• Developed modular microservices in Node.js and PostgreSQL to process multi-currency transactions, ensuring PCI-DSS compliance and zero data discrepancies across $12M+ monthly transaction volume.
• Built responsive, accessible UI components adhering to WCAG 2.1 AA standards, increasing enterprise mobile conversion by 18%.
• Optimized complex PostgreSQL queries and added multi-column indexes, reducing database CPU load by 35% during peak trading hours.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2016 - 2020
`;

export const SAMPLE_JOB_OFFERS = [
  {
    id: 'stripe-senior-eng',
    title: 'Senior Software Engineer - Core Platform',
    company: 'Stripe',
    location: 'San Francisco, CA (Hybrid / Remote)',
    salary: '$165,000 - $210,000 + Equity',
    description: `About the Role:
Stripe builds economic infrastructure for the internet. As a Senior Software Engineer on our Core Platform team, you will design, build, and scale mission-critical backend services and interactive developer dashboards that power billions of dollars in global commerce.

Responsibilities:
• Architect, build, and maintain high-throughput, low-latency microservices using TypeScript, Node.js, and Go.
• Collaborate with cross-functional teams (Product, Design, Security) to ship intuitive developer interfaces using React, Next.js, and modern state management.
• Design resilient relational database schemas in PostgreSQL, utilizing Redis caching and event-driven architecture to guarantee high availability (99.99%).
• Drive best engineering practices: code reviews, automated CI/CD pipelines, Docker containerization, Kubernetes orchestration, and comprehensive unit/integration testing with Jest.
• Lead incident response and performance optimization to diagnose and resolve production bottlenecks.

Requirements:
• 4+ years of professional software engineering experience building scalable web applications.
• Strong proficiency in TypeScript, React, Node.js, and RESTful / GraphQL APIs.
• Solid background with relational databases (PostgreSQL or MySQL) and query optimization.
• Hands-on experience with cloud infrastructure (AWS or GCP), Docker, and CI/CD pipelines.
• Passion for clean code, system architecture, security compliance, and mentoring junior engineers.
• Exceptional communication and cross-functional collaboration skills in an agile environment.`
  },
  {
    id: 'airbnb-fullstack',
    title: 'Full Stack Engineer - Guest Experience',
    company: 'Airbnb',
    location: 'Remote (US/Canada)',
    salary: '$150,000 - $195,000 + RSUs',
    description: `Join Airbnb's Guest Experience engineering organization! We are looking for a skilled Full Stack Engineer passionate about building seamless, accessible, and delightful booking experiences.

Key Responsibilities:
• Build responsive and fluid web interfaces using React, TypeScript, Tailwind CSS, and Next.js.
• Develop robust backend APIs using Node.js, Python, and GraphQL to power real-time availability and dynamic pricing.
• Scale data layer operations with PostgreSQL, Redis caching, and Kafka streaming pipelines.
• Champion web accessibility (a11y), responsive design, and core web vitals optimization.
• Participate in Agile sprints, automated testing with Jest and Cypress, and continuous deployment via AWS.`
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Senior Software Engineer - Core Platform',
    status: 'Final Round',
    salary: '$180,000 - $210,000',
    location: 'San Francisco (Hybrid)',
    appliedDate: '2026-10-08',
    url: 'https://stripe.com/jobs/senior-software-engineer',
    atsScore: 94,
    notes: 'Technical system design passed with flying colors! Final round with VP of Engineering scheduled for Thursday at 2 PM.',
    matchedKeywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'CI/CD', 'Microservices', 'System Architecture'],
    coverLetterSaved: true
  },
  {
    id: 'app-2',
    company: 'Airbnb',
    role: 'Full Stack Engineer - Guest Experience',
    status: 'Technical Interview',
    salary: '$165,000 - $190,000',
    location: 'Remote',
    appliedDate: '2026-10-12',
    url: 'https://careers.airbnb.com/positions',
    atsScore: 89,
    notes: 'Recruiter screen went great. Live coding round scheduled focusing on React performance and GraphQL query optimization.',
    matchedKeywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'PostgreSQL', 'Jest'],
    coverLetterSaved: true
  },
  {
    id: 'app-3',
    company: 'Datadog',
    role: 'Staff Infrastructure Engineer',
    status: 'Offer Received',
    salary: '$205,000 + $80k Equity',
    location: 'New York, NY / Remote',
    appliedDate: '2026-09-28',
    url: 'https://datadoghq.com/careers',
    atsScore: 92,
    notes: 'Received formal written offer! Benefits package includes 401(k) match and generous signing bonus. Deciding by next week.',
    matchedKeywords: ['Go', 'Kubernetes', 'Docker', 'AWS', 'Prometheus', 'CI/CD', 'Distributed Systems'],
    coverLetterSaved: true
  },
  {
    id: 'app-4',
    company: 'Shopify',
    role: 'Senior Frontend Developer',
    status: 'HR Screening',
    salary: '$155,000 - $185,000',
    location: 'Remote (Anywhere)',
    appliedDate: '2026-10-16',
    url: 'https://shopify.com/careers',
    atsScore: 87,
    notes: 'Call with Talent Acquisition partner on Tuesday morning. Emphasize merchant dashboard performance metrics.',
    matchedKeywords: ['React', 'TypeScript', 'GraphQL', 'Vite', 'Web Accessibility (a11y)', 'State Management'],
    coverLetterSaved: false
  },
  {
    id: 'app-5',
    company: 'Figma',
    role: 'Product Engineer - Design Systems',
    status: 'Applied',
    salary: '$170,000 - $200,000',
    location: 'San Francisco, CA',
    appliedDate: '2026-10-19',
    url: 'https://figma.com/careers',
    atsScore: 91,
    notes: 'Submitted tailored ATS resume highlighting design token architecture and WebGL performance gains.',
    matchedKeywords: ['TypeScript', 'React', 'CSS3', 'System Architecture', 'Jest'],
    coverLetterSaved: true
  },
  {
    id: 'app-6',
    company: 'Vercel',
    role: 'Developer Experience Engineer',
    status: 'Wishlist',
    salary: '$160,000 - $190,000',
    location: 'Remote',
    appliedDate: '2026-10-20',
    url: 'https://vercel.com/careers',
    atsScore: 85,
    notes: 'Need to tailor resume focusing on Next.js 15, Turbopack, and edge runtime optimizations before applying.',
    matchedKeywords: ['Next.js', 'React', 'TypeScript', 'Vite', 'CI/CD'],
    coverLetterSaved: false
  }
];

export const APPLICATION_STATUS_OPTIONS = [
  { id: 'Wishlist', label: 'Wishlist', color: '#818cf8', icon: '📌', bg: 'rgba(129, 140, 248, 0.12)' },
  { id: 'Applied', label: 'Applied', color: '#38bdf8', icon: '✉️', bg: 'rgba(56, 189, 248, 0.12)' },
  { id: 'HR Screening', label: 'HR Screening', color: '#fbbf24', icon: '📞', bg: 'rgba(251, 191, 36, 0.12)' },
  { id: 'Technical Interview', label: 'Tech Interview', color: '#f97316', icon: '💻', bg: 'rgba(249, 115, 22, 0.12)' },
  { id: 'Final Round', label: 'Final Round', color: '#a855f7', icon: '🤝', bg: 'rgba(168, 85, 247, 0.12)' },
  { id: 'Offer Received', label: 'Offer Received', color: '#10b981', icon: '🎉', bg: 'rgba(16, 185, 129, 0.15)' },
  { id: 'Rejected', label: 'Rejected', color: '#f43f5e', icon: '❌', bg: 'rgba(244, 63, 94, 0.12)' },
  { id: 'Withdrawn', label: 'Withdrawn', color: '#64748b', icon: '⏸️', bg: 'rgba(100, 116, 139, 0.12)' }
];
