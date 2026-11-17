import { orbTech, skillGroups } from "@/data/skills";
import { TechIcon } from "@/components/ui/TechIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { OrbTile } from "./OrbTile";
import { cn } from "@/lib/cn";

const span: Record<string, string> = {
  frontend: "lg:col-span-5 lg:row-span-2",
  mobile: "lg:col-span-3",
  data: "lg:col-span-3",
  backend: "lg:col-span-4",
  cloud: "lg:col-span-4",
  security: "lg:col-span-4",
  integrations: "lg:col-span-6",
  design: "lg:col-span-6",
};

export function Skills() {
  const order = ["frontend", "mobile", "data", "backend", "cloud", "security", "integrations", "design"];
  const groups = order.map((id) => skillGroups.find((g) => g.id === id)!).filter(Boolean);
  const [frontend, ...rest] = groups;
  const tile = (g: (typeof skillGroups)[number], i: number) => (
    <Reveal
      key={g.id}
      delay={(i % 4) * 0.06}
      className={cn(
        "spotlight border-line bg-surface/70 rounded-3xl border p-6 md:col-span-6 md:p-7",
        span[g.id],
      )}
    >
      <h3 className="label-mono text-muted flex items-center justify-between">
        {g.title}
        <span className="text-cobalt-soft">{String(g.items.length).padStart(2, "0")}</span>
      </h3>
      <ul className={cn("mt-5 flex flex-wrap gap-2", g.id === "frontend" && "lg:mt-8 lg:gap-2.5")}>
        {g.items.map((s) => (
          <li
            key={s}
            className={cn(
              "border-line-strong text-fg/85 rounded-full border bg-white/[.02] px-3 py-1.5 text-sm",
              g.id === "frontend" && "lg:text-base",
            )}
          >
            {s}
          </li>
        ))}
      </ul>
    </Reveal>
  );

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          id="skills-title"
          index="05"
          label="Skills"
          title="A full-stack toolkit, used in production."
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4 lg:grid-flow-row-dense">
          {tile(frontend, 0)}
          <OrbTile>
            <ul
              className="grid h-full grid-cols-5 place-items-center gap-4 p-8 pt-16 sm:grid-cols-7 lg:grid-cols-5"
              aria-label="Technologies"
            >
              {orbTech.map((t) => (
                <li key={t} className="text-muted flex flex-col items-center gap-1.5" title={t}>
                  <TechIcon name={t} className="size-6" />
                  <span className="sr-only">{t}</span>
                </li>
              ))}
            </ul>
          </OrbTile>
          {rest.map((g, i) => tile(g, i + 1))}
        </div>
      </div>
    </section>
  );
}
