export const profile = {
  name: "Muhammed Nabeel KK",
  shortName: "Nabeel",
  monogram: "NK",
  title: "Senior Full-Stack Developer",
  location: "Malappuram, Kerala, India",
  availability: "Open to remote roles and relocation",
  currently: "Senior Full-Stack Developer · Open to new roles",
  email: "mohammednabeelkk.tkl@gmail.com",
  phone: "+91 8089222453",
  phoneHref: "tel:+918089222453",
  whatsapp: "https://wa.me/918089222453",
  linkedin: "https://www.linkedin.com/in/muhammed-nabeel-kk-7aa729379/",
  github: "https://github.com/nabeelkk",
  resume: "/Muhammed_Nabeel_KK_Resume.pdf",
  photo: {
    src: "/images/nabeel.webp",
    width: 548,
    height: 507,
    alt: "Portrait of Muhammed Nabeel KK",
  },
  coreStack: ["React", "Next.js", "Node.js", "NestJS", "PostgreSQL", "React Native"],
  summary:
    "Senior Full-Stack Developer with 4+ years of experience designing, building and shipping production web and mobile software: multi-tenant ERP platforms, SaaS products, real-time applications, e-commerce and high-end brand websites. I work across React, Next.js, TypeScript, Node.js, NestJS, Express, React Native, PostgreSQL (Prisma), MongoDB and Redis, and I care about clean architecture, secure role-based systems, performance and pixel-perfect, accessible UI. I'm comfortable owning features end to end, from requirements and data modelling to CI/CD and cloud deployment.",
  statement:
    "I build software that runs real businesses: permission models that decide who can approve a proposal, reminders that fire in the right timezone, storefronts built to feel as premium as the brands behind them. Clean architecture underneath, careful craft on top.",
  stats: [
    { value: 4, suffix: "+", label: "Years of experience" },
    { value: 25, suffix: "+", label: "Projects built" },
    { value: 5, suffix: "", label: "Live client websites" },
    { value: 10, suffix: "+", label: "Technologies in production" },
  ],
} as const;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://nabeelkk.store").replace(/\/$/, "");
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix a public asset path with the deploy base path (GitHub Pages project sites). */
export const asset = (path: string) => `${BASE_PATH}${path}`;
