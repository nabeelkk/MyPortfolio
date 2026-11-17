import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa6";
import {
  SiDocker,
  SiExpo,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGreensock,
  SiJavascript,
  SiJetpackcompose,
  SiKotlin,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRedux,
  SiSocketdotio,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { TechName } from "@/data/skills";

export const techIcons: Record<TechName, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "Node.js": SiNodedotjs,
  NestJS: SiNestjs,
  Express: SiExpress,
  PostgreSQL: SiPostgresql,
  Prisma: SiPrisma,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  "React Native": SiReact,
  Expo: SiExpo,
  Kotlin: SiKotlin,
  "Jetpack Compose": SiJetpackcompose,
  Docker: SiDocker,
  AWS: FaAws,
  Nginx: SiNginx,
  "Socket.IO": SiSocketdotio,
  "Tailwind CSS": SiTailwindcss,
  Redux: SiRedux,
  "Framer Motion": SiFramer,
  GSAP: SiGreensock,
  "Three.js": SiThreedotjs,
  Vercel: SiVercel,
  Figma: SiFigma,
};

const spriteId = (name: TechName) => `ti-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/**
 * Every tech logo, defined once as an SVG <symbol>. Rendered a single time in the root
 * layout so repeated logos (marquees, grids) are tiny <use> references in the HTML.
 */
export function TechSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute" }}>
      {(Object.keys(techIcons) as TechName[]).map((name) => {
        const Icon = techIcons[name];
        return (
          <symbol key={name} id={spriteId(name)} viewBox="0 0 24 24">
            <Icon size="100%" />
          </symbol>
        );
      })}
    </svg>
  );
}

/** Lightweight logo that references the shared sprite. */
export function TechIcon({ name, className }: { name: TechName; className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      width="1em"
      height="1em"
    >
      <use href={`#${spriteId(name)}`} />
    </svg>
  );
}
