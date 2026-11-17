import { orbTech } from "@/data/skills";
import { TechIcon } from "./TechIcon";

/** Infinite marquee of tech logos, used between sections. */
export function Marquee() {
  const items = [...orbTech, ...orbTech];
  return (
    <div
      className="marquee border-line relative overflow-hidden border-y [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] py-6"
      aria-label="Technologies I work with"
      role="region"
    >
      <ul className="marquee-track gap-12 pr-12">
        {items.map((name, i) => (
          <li
            key={`${name}-${i}`}
            aria-hidden={i >= orbTech.length}
            className="text-muted hover:text-fg flex shrink-0 items-center gap-3 transition-colors"
          >
            <TechIcon name={name} className="size-5" />
            <span className="label-mono whitespace-nowrap">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
