import type { ClientSite, MoreWorkItem, Project } from "./types";

const AISYNX = "AISYNX";

/** Featured case studies, in display order. */
export const featuredProjects: Project[] = [
  {
    slug: "architecture-erp",
    name: "Architectural Consultancy ERP",
    type: "Enterprise ERP",
    status: "in-development",
    tagline:
      "Web ERP, client portal and staff mobile app connecting leads, proposals, projects, drawings, time and finance.",
    stack: ["NestJS", "Next.js", "Expo", "React Native", "PostgreSQL", "Prisma"],
    links: {},
    employer: AISYNX,
    cover: {
      src: "/projects/architecture-erp/architectural-consultancy-erp-dashboard.webp",
      width: 1536,
      height: 1024,
      alt: "Architectural Consultancy ERP dashboard with project, proposal and finance widgets",
      concept: true,
    },
    secondary: {
      src: "/projects/architecture-erp/architectural-consultancy-erp-mobile.webp",
      width: 1536,
      height: 1024,
      alt: "Overview of the Architectural Consultancy ERP staff mobile app screens",
      concept: true,
    },
    gallery: [],
    caseStudy: {
      overview:
        "A complete operating system for an architectural consultancy: a Next.js web ERP for the office, a scoped client portal, and an Expo staff app, all backed by a NestJS API on PostgreSQL with Prisma.",
      problem:
        "A consultancy's work moves from a lead to a fee proposal, a project, drawings, hours and invoices. Each step has different people who may prepare, review, approve or only view it. The system has to model that chain faithfully and enforce who can do what, on the server.",
      built: [
        "CRM and lead pipeline with conversion into projects",
        "Fee proposals with server-calculated totals, versioning, review and approval",
        "Projects, phases, milestones and tasks",
        "Drawing register with revisions, review, approval and issue",
        "Timesheets, attendance and leave",
        "Finance: invoices, payments, expenses and project profitability",
        "A scoped client portal and a staff mobile app",
      ],
      decisions: [
        "Separation of duties: a proposal's preparer can't approve it, and architects can add scope but can't price it.",
        "Role-scoped data: directors see everything, staff see their assigned projects, clients see only their own.",
        "Permissions enforced on the server — JWT plus permission guards on every controller, with row-level scoping.",
        "Large files kept in object storage instead of the database.",
      ],
      statusNote:
        "Core workflows are demonstrated end to end; the final gaps are being closed before deployment.",
      architecture: {
        clients: ["Next.js web ERP", "Client portal", "Expo staff app"],
        api: "NestJS API · JWT + permission guards",
        services: ["PostgreSQL · Prisma", "Object storage"],
      },
    },
  },
  {
    slug: "construction-erp",
    name: "Construction ERP",
    type: "Enterprise ERP",
    status: "in-development",
    tagline: "A multi-company ERP for construction, MEP & HVAC businesses, from enquiry to project delivery.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Redis", "Docker", "AWS", "Nginx"],
    links: {},
    employer: AISYNX,
    cover: {
      src: "/projects/construction-erp/construction-erp-dashboard.webp",
      width: 1536,
      height: 1024,
      alt: "Construction ERP dashboard showing projects, enquiries and site activity",
      concept: true,
    },
    secondary: {
      src: "/projects/construction-erp/construction-erp-mobile.webp",
      width: 1536,
      height: 1024,
      alt: "Overview of the Construction ERP field staff app screens",
      concept: true,
    },
    gallery: [],
    caseStudy: {
      overview:
        "A multi-company ERP for construction, MEP and HVAC businesses that will take work from the first enquiry through to project delivery, built on a tenancy and permission foundation designed to be safe from day one.",
      problem:
        "Construction groups often run several companies and branches under one organisation. Data must never leak between tenants, roles differ by company, and every change needs to be traceable — before any business module can be trusted.",
      built: [
        "Multi-company tenancy: organisation → company → branch",
        "System and custom roles with granular permissions at any level",
        "Lead management data model with activity history",
      ],
      decisions: [
        "An organisation ID on every business table, with tenant isolation covered by automated tests.",
        "Hashed refresh tokens, so a database leak doesn't hand out live sessions.",
        "An append-only audit log, and soft deletes instead of destructive ones.",
      ],
      builtSoFar: [
        "Organisation → company → branch tenancy with tested isolation",
        "System and custom roles with granular permissions",
        "Hashed refresh tokens",
        "Append-only audit log",
        "Lead management data model with activity history",
        "Soft deletes",
      ],
      planned: [
        "CRM pipeline",
        "BOQ & quotations",
        "Procurement & inventory",
        "Drawings with revision tracking and a protected viewer",
        "Site management",
        "Finance and HR",
        "Warranty & AMC",
        "Analytics and approvals",
      ],
      architecture: {
        clients: ["Next.js web app"],
        api: "Next.js server · RBAC",
        services: ["PostgreSQL · Prisma", "Redis", "Docker · AWS · Nginx"],
      },
    },
  },
  {
    slug: "remora",
    name: "Remora",
    type: "Mobile App",
    status: "in-development",
    tagline: "A privacy-first app that organises subscriptions, bills, warranties, documents and renewals.",
    stack: ["React Native", "Expo", "Expo Router", "NestJS", "Redis", "BullMQ", "PostgreSQL", "Prisma", "S3"],
    links: {},
    employer: AISYNX,
    cover: {
      src: "/projects/remora/remora-dashboard-v2.webp",
      width: 1732,
      height: 920,
      alt: "Remora attention dashboard listing upcoming renewals and bills",
      concept: true,
    },
    phone: {
      src: "/projects/remora/remora-mobile.webp",
      width: 850,
      height: 1850,
      alt: "Remora mobile app home screen",
      concept: true,
    },
    gallery: [],
    caseStudy: {
      overview:
        "Remora keeps track of everything a person is committed to — subscriptions, bills, warranties, documents and renewals — and reminds them at the right moment, without ever asking for bank access.",
      problem:
        "Commitments are scattered across emails, PDFs and memory. Reminders fire at the wrong time, and most tracking apps want bank credentials to work. Remora needed to be useful from manual entry and documents alone.",
      built: [
        "A unified “commitment” model with recurrence history",
        "An attention dashboard: urgent → next 7/30 days → high-value",
        "AI extraction from documents, with confirm-before-create",
        "Offline manual entry",
        "Timezone-aware, server-scheduled reminders via Redis + BullMQ workers",
        "Signed, expiring document URLs on S3-compatible storage",
      ],
      decisions: [
        "No bank access, by design — privacy is the product.",
        "A provider-agnostic AI layer, so the extraction model can change without touching the app.",
        "Exact decimal money types instead of floating point.",
        "A Docker monorepo shared by the mobile app, API and workers.",
      ],
      statusNote: "The platform and database foundation is complete.",
      architecture: {
        clients: ["Expo app · Expo Router"],
        api: "NestJS API",
        services: ["PostgreSQL · Prisma", "Redis + BullMQ workers", "S3 storage", "AI provider layer"],
      },
    },
  },
  {
    slug: "nova-widget",
    name: "Nova Widgets",
    type: "Native Android",
    status: "in-development",
    tagline: "A collection of beautifully consistent Android home-screen widgets.",
    stack: ["Kotlin", "Jetpack Compose", "Jetpack Glance", "Hilt", "Room", "DataStore", "Android Keystore"],
    links: {},
    employer: AISYNX,
    cover: {
      src: "/projects/nova-widget/nova-showcase.webp",
      width: 1536,
      height: 1024,
      alt: "Nova widgets showcase with clock, calendar, battery and weather widgets",
      concept: true,
    },
    gallery: [],
    caseStudy: {
      overview:
        "Nova is a native Android app for discovering, configuring and placing a family of consistent home-screen widgets, built with Kotlin, Jetpack Compose and Glance on a 24-module Clean Architecture.",
      problem:
        "Home-screen widgets tend to be inconsistent and fragile. Nova needed one design language across every widget, live previews before placement, and a catalogue that still works offline.",
      built: [
        "Catalogue with 9 categories and instant search",
        "Configuration with live preview",
        "Android pin-widget placement",
        "OLED, dark and light themes",
        "Widgets: Mono Clock, Calendar Agenda, Battery Gauge, Weather Forecast, Focus & Tasks",
      ],
      decisions: [
        "Clean Architecture across 24 modules, wired with Hilt.",
        "Gradle convention plugins with dev, staging and prod flavours.",
        "A local-first catalogue (Room + DataStore) with a safe offline fallback.",
        "Sensitive values protected with the Android Keystore.",
      ],
      statusNote:
        "Catalogue, discovery, configuration and placement are implemented and pass tests, lint and release builds.",
      architecture: {
        clients: ["Compose app", "Glance widgets"],
        api: "Domain layer · Clean Architecture",
        services: ["Room", "DataStore", "Android Keystore"],
      },
    },
  },
  {
    slug: "learning-hub",
    name: "Learning Hub",
    type: "SaaS / EdTech",
    status: "in-development",
    tagline: "A structured, AI-assisted platform for learning full-stack development.",
    stack: ["Next.js 15", "NestJS", "PostgreSQL 16", "Prisma", "Redis", "CI"],
    links: {},
    employer: AISYNX,
    cover: {
      src: "/projects/learning-hub/learning-hub-dashboard.webp",
      width: 1672,
      height: 941,
      alt: "Learning Hub student dashboard with weekly progress and lessons",
      concept: true,
    },
    secondary: {
      src: "/projects/learning-hub/learning-hub-mobile.webp",
      width: 1024,
      height: 1536,
      alt: "Learning Hub mobile screens: home, curriculum, lesson, projects, AI review and profile",
      concept: true,
    },
    gallery: [],
    caseStudy: {
      overview:
        "Learning Hub is a structured, AI-assisted platform for learning full-stack development: a Next.js 15 front end, a NestJS API and a background worker on PostgreSQL 16 and Redis, with CI and automated tests from the start.",
      problem:
        "A learning platform holds personal data and progress, so the account system has to be solid before any course content goes in: verified emails, strong sessions, MFA and abuse protection.",
      built: [
        "Registration and sign-in with HTTP-only session cookies",
        "Student and admin roles",
        "Email verification, password change and reset",
        "Email change with re-verification",
        "MFA with recovery codes",
        "Fail-closed rate limiting",
      ],
      decisions: [
        "Session cookies that are HTTP-only, rather than tokens readable by JavaScript.",
        "Rate limiting that fails closed: if the limiter is unavailable, requests are refused, not waved through.",
        "A separate background worker for slow jobs such as email.",
      ],
      builtSoFar: [
        "Sessions with HTTP-only cookies",
        "Student and admin roles",
        "Email verification and re-verification",
        "Password change and reset",
        "MFA with recovery codes",
        "Fail-closed rate limiting",
      ],
      planned: [
        "Learning paths and modules",
        "AI code review",
        "Voice mock interview",
        "12-week program mobile app",
      ],
      architecture: {
        clients: ["Next.js 15 web app"],
        api: "NestJS API",
        services: ["PostgreSQL 16 · Prisma", "Redis", "Background worker"],
      },
    },
  },
  {
    slug: "blend-clothing",
    name: "Blend Clothing",
    type: "E-commerce",
    status: "live",
    tagline: "A full e-commerce platform with payments, refunds, wallet, referrals and an admin dashboard.",
    stack: [
      "Node.js",
      "Express",
      "MongoDB",
      "EJS",
      "Tailwind",
      "Razorpay",
      "Cloudinary",
      "AWS EC2",
      "Nginx",
      "PM2",
    ],
    // Live URL https://blendfashion.vercel.app/ timed out during QA — re-add `live` once it's back up.
    links: { github: "https://github.com/nabeelkk/blendFashion" },
    gallery: [],
    caseStudy: {
      overview:
        "Blend is a complete clothing store built end to end: a server-rendered Express + EJS storefront, a MongoDB catalogue with variants, Razorpay payments, and an admin dashboard, deployed on AWS EC2.",
      problem:
        "A real store needs more than a cart: product variants, stock, coupons, referrals, a wallet, returns and refunds, plus an admin who can run all of it safely.",
      built: [
        "Product variants, cart and wishlist",
        "Orders, payments and automated refunds with Razorpay",
        "Wallet, referrals and coupons",
        "RBAC with an admin dashboard",
        "Image uploads via Cloudinary",
      ],
      decisions: [
        "Server-rendered EJS pages for fast first loads and simple SEO.",
        "Refunds automated through Razorpay instead of manual reconciliation.",
        "Deployed on AWS EC2 behind Nginx, with PM2 keeping the Node process alive.",
      ],
      architecture: {
        clients: ["EJS storefront", "Admin dashboard"],
        api: "Node.js · Express",
        services: ["MongoDB", "Razorpay", "Cloudinary", "EC2 · Nginx · PM2"],
      },
    },
  },
  {
    slug: "pinet-chat",
    name: "Pinet — Real-Time Chat",
    type: "Real-time",
    status: "live",
    tagline: "One-to-one and group chat with receipts, typing indicators, presence and media sharing.",
    stack: ["React", "Socket.IO", "Node.js", "Express", "MongoDB", "Redis", "Cloudinary", "JWT"],
    links: {
      live: "https://pinet-real-time-chating-app-client.vercel.app/",
      github: "https://github.com/nabeelkk/Pinet-real-time-chating-app-client-side",
    },
    cover: {
      src: "/projects/pinet-chat/cover.webp",
      width: 1440,
      height: 900,
      alt: "Pinet chat sign-up screen",
    },
    phone: {
      src: "/projects/pinet-chat/mobile.webp",
      width: 780,
      height: 1688,
      alt: "Pinet chat on mobile",
    },
    gallery: [],
    caseStudy: {
      overview:
        "Pinet is a real-time messaging app with one-to-one and group conversations, built on React, Socket.IO and Express, with MongoDB for history and Redis for scaling the socket layer.",
      problem:
        "Chat feels broken the moment state drifts: a message shows as sent but never arrives, or presence is stale. Every event has to reach the right clients in order, even when the server runs as more than one instance.",
      built: [
        "One-to-one and group chat",
        "Sent, delivered and read receipts",
        "Typing indicators and presence",
        "Media sharing via Cloudinary",
        "JWT authentication",
      ],
      decisions: [
        "A Redis Socket.IO adapter so events fan out across instances — the app can scale horizontally.",
        "Message state tracked per recipient to drive accurate receipts.",
        "Media offloaded to Cloudinary, keeping the socket server lean.",
      ],
      architecture: {
        clients: ["React client"],
        api: "Express · Socket.IO",
        services: ["MongoDB", "Redis adapter", "Cloudinary"],
      },
    },
  },
];

/** Case-study-only project (listed in More Work, not in Featured). */
export const calibrationErp: Project = {
  slug: "calibration-erp",
  name: "Medical Equipment Calibration ERP",
  type: "Enterprise ERP",
  status: "in-development",
  tagline:
    "From quotation to verified certificate: replacing paper with an auditable chain for calibration labs.",
  stack: [],
  links: {},
  employer: AISYNX,
  cover: {
    src: "/projects/calibration-erp/calibration-erp-dashboard.webp",
    width: 2000,
    height: 1090,
    alt: "Calibration ERP dashboard with jobs moving through calibration stages",
    concept: true,
  },
  phone: {
    src: "/projects/calibration-erp/calibration-erp-mobile.webp",
    width: 620,
    height: 1104,
    alt: "Calibration ERP technician view on mobile",
    concept: true,
  },
  gallery: [],
  caseStudy: {
    overview:
      "An ERP for medical-equipment calibration businesses that follows every job through quotation, customer approval, calibration, technical review and certification — and lets anyone verify a certificate afterwards.",
    problem:
      "Calibration work is regulated and traditionally runs on paper. Each certificate must trace back to who did the work, who reviewed it and when, and customers need a way to confirm a certificate is genuine.",
    built: [
      "Quotation → customer approval workflow",
      "Calibration execution",
      "Technical review before certification",
      "Certificate generation and certificate verification",
    ],
    decisions: [
      "Built on the same multi-tenant foundation as the other ERPs: organisation → company → branch.",
      "Granular RBAC with row-level scoping, so technicians, reviewers and customers each see only their part.",
      "Audit trails and approval workflows, so every certificate has an auditable chain behind it.",
    ],
    architecture: {
      clients: ["Web ERP", "Certificate verification"],
      api: "Application API · RBAC",
      services: ["Database", "Audit trail"],
    },
  },
};

export const caseStudyProjects: Project[] = [...featuredProjects, calibrationErp];

export const getProject = (slug: string) => caseStudyProjects.find((p) => p.slug === slug);

export const clientSites: ClientSite[] = [
  {
    slug: "last-chance",
    name: "Last Chance",
    description: "An immersive luxury perfume storefront with product storytelling and fragrance discovery.",
    url: "https://wearlastchance.com/",
    full: {
      src: "/projects/last-chance/full.webp",
      width: 1200,
      height: 4500,
      alt: "Last Chance website, full page",
    },
    cover: {
      src: "/projects/last-chance/cover.webp",
      width: 1440,
      height: 900,
      alt: "Last Chance home page",
    },
  },
  {
    slug: "le-roland-sandse",
    name: "Le Roland Sandse",
    description: "A story-led luxury fragrance website with immersive collection pages.",
    url: "https://lerolandsandse.com/",
    full: {
      src: "/projects/le-roland-sandse/full.webp",
      width: 1200,
      height: 4500,
      alt: "Le Roland Sandse website, full page",
    },
    cover: {
      src: "/projects/le-roland-sandse/cover.webp",
      width: 1440,
      height: 900,
      alt: "Le Roland Sandse home page",
    },
  },
  {
    slug: "felancci",
    name: "Felancci Le'Atelier",
    description: "Perfume manufacturing & private-label business website.",
    url: "https://felancciperfumes.com/",
    full: {
      src: "/projects/felancci/full.webp",
      width: 1200,
      height: 4500,
      alt: "Felancci website, full page",
    },
    cover: { src: "/projects/felancci/cover.webp", width: 1440, height: 900, alt: "Felancci home page" },
  },
  {
    slug: "coredotr",
    name: "coredotr",
    description: "Architectural accessories — doors, windows and hardware — product website.",
    url: "https://coredotr.in/",
    cover: {
      src: "/projects/coredotr/coredotr-website.webp",
      width: 2000,
      height: 1089,
      alt: "coredotr home page",
    },
  },
  {
    slug: "artis-build",
    name: "Artis Build",
    description: "Construction company website.",
    url: "https://artisbuild.co.in/",
    full: {
      src: "/projects/artis-build/full.webp",
      width: 1200,
      height: 4500,
      alt: "Artis Build website, full page",
    },
    cover: {
      src: "/projects/artis-build/cover.webp",
      width: 1440,
      height: 900,
      alt: "Artis Build home page",
    },
  },
  {
    slug: "aisynx",
    name: "AISYNX",
    description: "Software company website with service pages, case studies and an on-site AI assistant.",
    url: "https://aisynx.in",
    full: { src: "/projects/aisynx/full.webp", width: 1200, height: 4500, alt: "AISYNX website, full page" },
    cover: { src: "/projects/aisynx/cover.webp", width: 1440, height: 900, alt: "AISYNX home page" },
  },
];

export const moreWork: MoreWorkItem[] = [
  {
    slug: "calibration-erp",
    name: "Medical Equipment Calibration ERP",
    description:
      "Quotation → customer approval → calibration → technical review → certification → certificate verification, replacing paper with an auditable chain.",
    stack: ["Multi-tenant", "RBAC", "Audit trail"],
    categories: ["full-stack"],
    status: "in-development",
    links: {},
    image: { ...calibrationErp.cover! },
    caseStudy: true,
  },
  {
    slug: "whatsapp-automation",
    name: "WhatsApp Automation Tool",
    description: "Templates, triggers, campaigns and delivery-status tracking for WhatsApp messaging.",
    stack: ["React", "Tailwind", "REST", "Webhooks"],
    categories: ["frontend"],
    links: {},
  },
  {
    slug: "servicehub",
    name: "ServiceHub",
    description: "A 7-step service booking wizard plus an admin dashboard.",
    stack: ["React 18", "TypeScript", "Redux Toolkit", "Framer Motion"],
    categories: ["frontend"],
    links: {
      live: "https://service-booking-app-3pkc.vercel.app/",
      github: "https://github.com/nabeelkk/Service_Booking_App",
    },
    image: {
      src: "/projects/servicehub/cover.webp",
      width: 1440,
      height: 900,
      alt: "ServiceHub booking app",
    },
  },
  {
    slug: "twitter-clone",
    name: "Twitter-like Social App",
    description: "A Twitter-style social app with a React front end and a Node/Express API.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    categories: ["full-stack"],
    links: { github: "https://github.com/nabeelkk/Twitter-Clone" },
  },
  {
    slug: "3d-viewer",
    name: "3D Model Viewer",
    description: "An interactive in-browser 3D model viewer with a MERN back end.",
    stack: ["React", "Three.js", "Vite"],
    categories: ["frontend"],
    // Live demo (https://3-d-viewer-website.vercel.app/) showed "Error loading models" during QA, so it's hidden.
    links: { github: "https://github.com/nabeelkk/3D-Viewer-Website" },
  },
  {
    slug: "pinet-banking",
    name: "Pinet Banking",
    description: "A responsive virtual-banking website.",
    stack: ["HTML", "CSS", "Bootstrap"],
    categories: ["frontend"],
    links: { live: "https://nabeelkk.github.io/Pinet-banking/" },
    image: {
      src: "/projects/pinet-banking/cover.webp",
      width: 1440,
      height: 900,
      alt: "Pinet Banking landing page",
    },
  },
  {
    slug: "weathernow",
    name: "WeatherNow",
    description: "Look up the weather, humidity and wind for any city.",
    stack: ["HTML", "CSS", "JavaScript"],
    categories: ["frontend"],
    links: { live: "https://nabeelkk.github.io/Weather-App/" },
  },
  {
    slug: "pinet-chatbot",
    name: "PinetChatBot",
    description: "A mini chatbot app built with React.",
    stack: ["React"],
    categories: ["frontend"],
    links: { live: "https://chatbotapp-nu.vercel.app/" },
  },
  {
    slug: "realme-clone",
    name: "Realme clone",
    description: "A responsive recreation of a product landing page, built as a layout exercise.",
    stack: ["HTML", "CSS"],
    categories: ["frontend"],
    links: { live: "https://nabeelkk.github.io/realme-clone/" },
    image: {
      src: "/projects/legacy/realme.webp",
      width: 1366,
      height: 633,
      alt: "Realme clone landing page",
    },
  },
  {
    slug: "rapido-clone",
    name: "Rapido clone",
    description: "A responsive recreation of a ride-hailing landing page, built as a layout exercise.",
    stack: ["HTML", "CSS"],
    categories: ["frontend"],
    links: { live: "https://nabeelkk.github.io/rapido-clone/" },
    image: {
      src: "/projects/legacy/rapido.webp",
      width: 1366,
      height: 637,
      alt: "Rapido clone landing page",
    },
  },
];

const featuredCategories: Record<string, MoreWorkItem["categories"]> = {
  "architecture-erp": ["full-stack", "mobile"],
  "construction-erp": ["full-stack"],
  remora: ["mobile", "full-stack"],
  "nova-widget": ["mobile"],
  "learning-hub": ["full-stack"],
  "blend-clothing": ["full-stack"],
  "pinet-chat": ["full-stack"],
};

/** Index of all work for the filterable grid: featured projects first (compact), then the rest. */
export const allWork: MoreWorkItem[] = [
  ...featuredProjects.map<MoreWorkItem>((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.tagline,
    stack: p.stack.slice(0, 4),
    categories: featuredCategories[p.slug] ?? ["full-stack"],
    status: p.status,
    links: p.links,
    image: p.cover,
    caseStudy: true,
  })),
  ...moreWork,
];

export const workFilters = [
  { id: "all", label: "All" },
  { id: "full-stack", label: "Full-Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "mobile", label: "Mobile" },
] as const;
