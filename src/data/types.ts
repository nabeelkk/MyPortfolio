export type ProjectStatus = "live" | "in-development";

export type ProjectType =
  | "Enterprise ERP"
  | "SaaS / EdTech"
  | "Mobile App"
  | "Native Android"
  | "E-commerce"
  | "Real-time"
  | "Client Website"
  | "Personal Project";

export type WorkCategory = "full-stack" | "frontend" | "mobile";

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Design concepts with sample data get a visible caption. */
  concept?: boolean;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
}

export interface Architecture {
  clients: string[];
  api: string;
  services: string[];
}

export interface CaseStudy {
  overview: string;
  problem: string;
  built: string[];
  decisions: string[];
  builtSoFar?: string[];
  planned?: string[];
  statusNote?: string;
  architecture: Architecture;
}

export interface Project {
  slug: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  tagline: string;
  stack: string[];
  links: ProjectLinks;
  /** Main landscape image (dashboard / desktop). */
  cover?: ImageAsset;
  /** Portrait single-screen phone screenshot, rendered inside a PhoneFrame. */
  phone?: ImageAsset;
  /** Multi-screen sheet (e.g. app screens overview), rendered in a glass panel. */
  secondary?: ImageAsset;
  gallery: ImageAsset[];
  /** Built during the AISYNX role — shown only in case-study metadata. */
  employer?: string;
  caseStudy?: CaseStudy;
}

export interface ClientSite {
  slug: string;
  name: string;
  description: string;
  url: string;
  /** Tall full-page screenshot that auto-scrolls on hover. */
  full?: ImageAsset;
  cover?: ImageAsset;
}

export interface MoreWorkItem {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  categories: WorkCategory[];
  status?: ProjectStatus;
  links: ProjectLinks;
  image?: ImageAsset;
  caseStudy?: boolean;
}

export interface Role {
  title: string;
  company: string;
  location: string;
  /** Omit when unknown — the UI hides the period. */
  period?: string;
  points: string[];
  stack?: string[];
  /** Project slugs with case studies, shown when the role expands. */
  projects?: string[];
}
