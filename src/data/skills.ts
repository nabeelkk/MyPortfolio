export interface SkillGroup {
  id: string;
  title: string;
  /** Bento tile size on desktop. */
  size: "lg" | "md" | "sm";
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    size: "lg",
    items: [
      "React",
      "Next.js (App Router)",
      "TypeScript",
      "JavaScript (ES6+)",
      "Redux Toolkit",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Three.js",
      "HTML5",
      "CSS3",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    size: "md",
    items: ["Node.js", "NestJS", "Express.js", "REST APIs", "WebSockets / Socket.IO", "BullMQ", "EJS"],
  },
  {
    id: "mobile",
    title: "Mobile",
    size: "sm",
    items: ["React Native", "Expo", "Kotlin", "Jetpack Compose", "Jetpack Glance"],
  },
  {
    id: "data",
    title: "Data",
    size: "sm",
    items: ["PostgreSQL", "Prisma", "MongoDB", "Redis"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    size: "md",
    items: ["AWS (EC2, S3)", "Docker", "Nginx", "PM2", "CI/CD", "Vercel", "Render", "Cloudinary"],
  },
  {
    id: "security",
    title: "Security & Architecture",
    size: "lg",
    items: [
      "JWT",
      "Sessions",
      "MFA",
      "RBAC with row-level scoping",
      "Multi-tenancy",
      "Audit logs",
      "Clean Architecture",
      "SOLID",
      "MVC",
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    size: "sm",
    items: ["Razorpay", "Google Auth", "WhatsApp/SMS APIs", "AI/LLM APIs", "Webhooks"],
  },
  {
    id: "design",
    title: "Design",
    size: "sm",
    items: ["Figma", "Photoshop", "Illustrator"],
  },
];

/** Logos shown on the 3D orb and the marquee. Keys map to icons in components/ui/TechIcon. */
export const orbTech = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "NestJS",
  "Express",
  "PostgreSQL",
  "Prisma",
  "MongoDB",
  "Redis",
  "React Native",
  "Expo",
  "Kotlin",
  "Jetpack Compose",
  "Docker",
  "AWS",
  "Nginx",
  "Socket.IO",
  "Tailwind CSS",
  "Redux",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "Vercel",
  "Figma",
] as const;

export type TechName = (typeof orbTech)[number];

/** Core technologies used for JSON-LD knowsAbout. */
export const knowsAbout = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Redis",
  "React Native",
  "Expo",
  "MongoDB",
  "Docker",
  "AWS",
  "Multi-tenant architecture",
  "Role-based access control",
];
