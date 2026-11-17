import type { Role } from "./types";

/** Newest first. Leave `period` undefined to hide it in the UI. */
export const experience: Role[] = [
  {
    title: "Senior Full-Stack Developer",
    company: "AISYNX",
    location: "Malappuram, Kerala",
    period: "2025 – Present",
    points: [
      "Engineered multi-tenant ERP platforms for construction, architectural consultancy and medical-equipment calibration businesses: organisation → company → branch tenancy, granular RBAC with row-level scoping, audit trails and approval workflows.",
      "Built an Architectural Consultancy ERP (NestJS API, Next.js web ERP + client portal, Expo staff app, PostgreSQL/Prisma) covering CRM, fee proposals with versioning and approvals, projects, a drawing register, timesheets, finance and a client portal.",
      "Developed Remora, a React Native/Expo commitment-manager app with a NestJS API, Redis/BullMQ reminder workers, S3 document storage and AI-assisted document extraction.",
      "Built Nova, a native Android widget platform in Kotlin, Jetpack Compose and Glance with Clean Architecture across 24 modules.",
      "Built Learning Hub, an AI-assisted learning platform (Next.js 15, NestJS, PostgreSQL 16, Redis) with MFA, email verification and session security.",
      "Designed and built the company website (aisynx.in) and delivered live client websites for luxury perfume, fragrance-manufacturing, architectural-hardware and construction brands.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "NestJS",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "BullMQ",
      "React Native",
      "Expo",
      "Kotlin",
      "Docker",
    ],
    projects: [
      "architecture-erp",
      "construction-erp",
      "remora",
      "nova-widget",
      "learning-hub",
      "calibration-erp",
    ],
  },
  {
    title: "Senior React.js Developer",
    company: "Nexcrest IT",
    location: "Kannur, Kerala",
    points: [
      "Led front-end development of two products: an Institution Management ERP and a CRM platform.",
      "Built ERP modules for student management, staff management, attendance tracking and reporting; CRM features for lead management, customer tracking and sales workflow automation.",
      "Designed reusable, scalable UI components; integrated REST APIs; optimised state management and performance; ensured cross-browser and mobile responsiveness in an agile team.",
    ],
  },
  {
    title: "React Developer",
    company: "Aventus Informatics",
    location: "Thrissur, Kerala",
    points: [
      "Worked on City Beach, an AI-driven e-commerce web application, integrating AI-powered personalised product recommendations.",
      "Managed settings, feature flags and environment configs with TOML; built reusable components with the backend and AI teams; took part in code reviews.",
    ],
  },
  {
    title: "Freelance Full-Stack Developer",
    company: "Independent",
    location: "Remote",
    period: "Jan 2022 – 2025",
    points: [
      "Delivered e-commerce platforms, real-time chat apps and dynamic web apps end to end: React/Next.js frontends, Node/Express backends, MongoDB/PostgreSQL, payment gateways, auth, Socket.IO, and deployments on AWS, Vercel and Render.",
    ],
  },
  {
    title: "Web Designer",
    company: "Qbize Technologies",
    location: "Bangalore",
    period: "2021 – 2022",
    points: [
      "Designed a responsive e-commerce website; built a subscription section with MSGBOSS bulk WhatsApp/SMS integration; redesigned and maintained a school-management SaaS product.",
    ],
  },
];
