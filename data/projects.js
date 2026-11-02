export const PROJECTS = [
  {
    slug: 'sofol',
    title: 'SOFOL',
    eyebrow: 'Farmer credit profile platform',
    date: 'Jul–Oct 2026',
    type: 'Role-based mobile fintech app',
    outcome: 'A four-role credit profile and field-verification workflow for farmer lending.',
    role: 'Team project with contribution details intentionally left unlisted until provided.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Express.js', 'Supabase/PostgreSQL'],
    links: { live: null, backend: 'https://sofol-backend.vercel.app', github: 'https://github.com/atik806/MADFinalProject' },
    team: true,
    contribution: null,
    visual: { type: 'diagram', diagram: 'roles' },
    caseStudy: {
      problem:
        'Farmer lending needs a shared, trustworthy view of financial records and verification work across people with different responsibilities.',
      approach:
        'The product separates responsibilities into four roles and routes credit-profile work through a secure Express.js API backed by Supabase/PostgreSQL.',
      features: [
        'Financial records and transaction history',
        'Loan application workflow',
        'Field verification across four roles',
        'Role-based access to credit profiles',
      ],
      improve:
        'I would deepen automated test coverage around permission boundaries and make verification states even easier to audit as the product grows.',
      architecture: 'React Native / Expo → Express.js role-aware API → Supabase/PostgreSQL',
      note: 'The deployed backend link is a JSON REST API behind the mobile app, not a visual web demo.',
    },
  },
  {
    slug: 'car-rent-management',
    title: 'Car Rent Management System',
    eyebrow: 'Full-stack rental operations',
    date: 'Apr–May 2026',
    type: 'Web application',
    outcome: 'Rental operations organized around authentication, bookings, payment tracking, and history.',
    role: 'Full-stack developer responsible for the MVC application and responsive workflows.',
    stack: ['PHP', 'MySQL', 'MVC', 'HTML/CSS/JS', 'AJAX'],
    links: { live: 'https://car-rental-system.fwh.is', backend: null, github: 'https://github.com/AxisAkash/Car-Rent-Management' },
    team: false,
    contribution: null,
    visual: { type: 'diagram', diagram: 'mvc' },
    caseStudy: {
      problem:
        'A rental workflow needs more than a booking form: access, availability, payment state, and history have to stay coherent for admins and customers.',
      approach:
        'An MVC structure keeps request handling and data access organized, while role-based access, sessions, prepared statements, and AJAX support the main booking workflows.',
      features: [
        'Authentication and role-based access control',
        'Admin dashboard and booking workflow',
        'Payment tracking and rental history',
        'Responsive, validated interface',
      ],
      improve:
        'I would add a more explicit domain layer for booking state transitions and expand integration tests around payment tracking.',
      architecture: 'Browser → PHP MVC request → RBAC/session gate → MySQL',
    },
  },
  {
    slug: 'ai-calculator',
    title: 'AI Calculator',
    eyebrow: 'Natural-language math interface',
    date: 'Mar–Jun 2025',
    type: 'NLP application',
    outcome: 'Natural-language math translated into an evaluable expression and result.',
    role: 'Developer of the NLP parsing pipeline, model evaluation, and minimal interface.',
    stack: ['Python', 'TensorFlow', 'NLP'],
    links: { live: 'https://axisakash.github.io/Ai_Calculator/', backend: null, github: 'https://github.com/AxisAkash/Ai_Calculator' },
    team: false,
    contribution: null,
    visual: { type: 'diagram', diagram: 'nlp' },
    caseStudy: {
      problem:
        'A calculator can accept a question in the way people naturally ask it, rather than requiring a strict symbolic input format.',
      approach:
        'The pipeline parses natural-language math, evaluates iterative model choices through hyperparameter tuning, and returns a minimal result.',
      features: [
        'Natural-language input parsing',
        'Questions such as “what is 20% of 350”',
        'Hyperparameter tuning and iterative evaluation',
        'Minimal interface around the pipeline',
      ],
      improve:
        'I would broaden the evaluation set and make ambiguous expressions explain their interpretation before returning a result.',
      architecture: 'Natural-language query → NLP parser → TensorFlow pipeline → result',
    },
  },
  {
    slug: 'rental-management',
    title: 'Rental Management System',
    eyebrow: 'Desktop property operations',
    date: 'Oct 2024–Jan 2025',
    type: 'Desktop application',
    outcome: 'Tenant, lease, unit, invoice, and payment workflows in one role-aware desktop system.',
    role: 'Developer of the .NET desktop application and SQL Server data workflows.',
    stack: ['C#', '.NET Framework', 'SQL Server'],
    links: { live: null, backend: null, github: 'https://github.com/AxisAkash/Rental-Management-System' },
    team: false,
    contribution: null,
    visual: { type: 'diagram', diagram: 'entities' },
    caseStudy: {
      problem:
        'Property operations benefit from connected records: tenants, leases, units, invoices, and payment status should be managed together.',
      approach:
        'A C#/.NET Framework desktop app models those workflows against SQL Server, with hashed credentials and role-based access for admins and tenants.',
      features: [
        'Tenant registration and lease tracking',
        'Unit management',
        'Hashed-credential authentication',
        'Automated invoices and payment tracking',
      ],
      improve:
        'I would separate more of the domain logic from the desktop views and add broader tests for invoice generation edge cases.',
      architecture: 'Desktop client → .NET application layer → SQL Server entities',
    },
  },
];
