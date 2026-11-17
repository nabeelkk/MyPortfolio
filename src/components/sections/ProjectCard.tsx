import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import Link from "next/link";
import type { Project } from "@/data/types";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { SmartImage } from "@/components/ui/SmartImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TiltCard } from "@/components/ui/TiltCard";

const parallax = (depth: number) => ({
  transform: `translate3d(calc((var(--px, .5) - .5) * ${-depth}px), calc((var(--py, .5) - .5) * ${-depth}px), 0)`,
});

export function ProjectCard({
  project: p,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const caseHref = `/projects/${p.slug}/`;
  return (
    <TiltCard max={4} className="h-full rounded-[2rem]">
      <article className="border-line-strong bg-surface relative grid h-full overflow-hidden rounded-[2rem] border shadow-[inset_0_1px_0_rgba(255,255,255,.06)] md:grid-cols-12">
        <div
          aria-hidden="true"
          className="bg-cobalt/15 pointer-events-none absolute -right-40 -bottom-40 size-[36rem] rounded-full blur-[120px]"
        />
        <div
          className="grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_70%_at_80%_60%,#000,transparent)] opacity-30"
          aria-hidden="true"
        />

        {/* Copy */}
        <div className="relative z-10 flex flex-col p-6 sm:p-8 md:col-span-5 md:p-10">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-muted text-sm font-semibold">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <StatusBadge status={p.status} />
          </div>
          <p className="label-mono text-cobalt-soft mt-8">{p.type}</p>
          <h3 className="font-display mt-3 text-[clamp(2rem,3.4vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.03em]">
            {p.name}
          </h3>
          <p className="text-fg/75 mt-4 max-w-md leading-relaxed">{p.tagline}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {p.stack.slice(0, 7).map((s) => (
              <li
                key={s}
                className="border-line-strong label-mono text-fg/70 rounded-full border px-2.5 py-1 text-[0.6rem]"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-2 pt-8">
            <Link
              href={caseHref}
              className="group bg-fg text-bg inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors hover:bg-white"
            >
              Case study
              <ArrowUpRight
                className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
            {p.links.live && (
              <a
                href={p.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line-strong hover:border-fg/40 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors"
                aria-label={`${p.name} live site (opens in a new tab)`}
              >
                Live <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
            {p.links.github && (
              <a
                href={p.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line-strong hover:border-fg/40 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors"
                aria-label={`${p.name} source on GitHub (opens in a new tab)`}
              >
                <GithubIcon className="size-4" /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Visual composition */}
        <Link
          href={caseHref}
          data-cursor="VIEW"
          tabIndex={-1}
          aria-hidden="true"
          className="relative z-10 flex min-h-[260px] items-center overflow-hidden px-6 pb-8 sm:px-8 md:col-span-7 md:min-h-0 md:py-10 md:pr-10 md:pl-0"
        >
          <div className="relative w-full" style={parallax(14)}>
            <BrowserFrame url={p.links.live} label={p.name} className="w-full md:w-[92%]">
              <SmartImage
                image={p.cover}
                name={p.name}
                stack={p.stack}
                className="aspect-[16/10]"
                sizes="(min-width: 768px) 55vw, 100vw"
              />
            </BrowserFrame>
            {p.phone && (
              <div
                className="absolute -right-1 -bottom-8 w-[24%] min-w-[90px] md:right-0"
                style={parallax(28)}
              >
                <PhoneFrame>
                  <SmartImage
                    image={p.phone}
                    name={p.name}
                    className="aspect-[9/19.5]"
                    sizes="15vw"
                    caption={false}
                  />
                </PhoneFrame>
              </div>
            )}
            {!p.phone && p.secondary && (
              <div
                className="glass absolute -right-1 -bottom-8 w-[38%] overflow-hidden rounded-xl p-1.5 md:right-0"
                style={parallax(28)}
              >
                <SmartImage
                  image={p.secondary}
                  name={p.name}
                  className="rounded-lg"
                  sizes="22vw"
                  caption={false}
                />
              </div>
            )}
          </div>
        </Link>
      </article>
    </TiltCard>
  );
}
