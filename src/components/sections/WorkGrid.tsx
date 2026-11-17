"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import Link from "next/link";
import { useState } from "react";
import type { MoreWorkItem, WorkCategory } from "@/data/types";
import { SmartImage } from "@/components/ui/SmartImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type FilterId = "all" | WorkCategory;

function Card({ item }: { item: MoreWorkItem }) {
  const primary = item.caseStudy ? `/projects/${item.slug}/` : (item.links.live ?? item.links.github);
  const internal = !!item.caseStudy;
  return (
    <article className="group border-line bg-surface/70 hover:border-line-strong relative flex h-full flex-col overflow-hidden rounded-3xl border transition-colors duration-500">
      <div className="relative overflow-hidden">
        <div className="ease-out-expo [filter:grayscale(1)_brightness(.6)] transition-[clip-path,filter] duration-700 [clip-path:inset(6%_6%_0_6%_round_16px)] group-hover:[filter:grayscale(0)_brightness(1)] group-hover:[clip-path:inset(0_0_0_0_round_0px)]">
          <div className="ease-out-expo transition-transform duration-[1.1s] group-hover:scale-[1.04]">
            <SmartImage
              image={item.image}
              name={item.name}
              stack={item.stack}
              className="aspect-[16/10]"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              caption={false}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {primary ? (
              internal ? (
                <Link href={primary} className="after:absolute after:inset-0" data-cursor="VIEW">
                  {item.name}
                </Link>
              ) : (
                <a
                  href={primary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0"
                  data-cursor="OPEN"
                >
                  {item.name}
                </a>
              )
            ) : (
              item.name
            )}
          </h3>
          {primary && (
            <ArrowUpRight
              className="text-muted group-hover:text-fg mt-1 size-4 shrink-0 transition-[transform,color] duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          )}
        </div>
        <p className="text-muted mt-2 text-sm leading-relaxed">{item.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
          {item.status === "in-development" && <StatusBadge status={item.status} />}
          {item.image?.concept && (
            <span className="border-line-strong label-mono text-fg/65 rounded-full border px-2.5 py-1 text-[0.6rem]">
              Design concept
            </span>
          )}
          {item.caseStudy && (
            <span className="bg-cobalt/15 label-mono text-cobalt-soft rounded-full px-2.5 py-1 text-[0.6rem]">
              Case study
            </span>
          )}
          {item.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="border-line-strong label-mono text-fg/65 rounded-full border px-2.5 py-1 text-[0.6rem]"
            >
              {s}
            </span>
          ))}
          {item.links.github && (internal || item.links.live) && (
            <a
              href={item.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} on GitHub (opens in a new tab)`}
              className="border-line-strong text-muted hover:text-fg relative z-10 ml-auto grid size-8 place-items-center rounded-full border transition-colors"
            >
              <GithubIcon className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function WorkGrid({
  items,
  filters,
}: {
  items: MoreWorkItem[];
  filters: readonly { id: FilterId; label: string }[];
}) {
  const [filter, setFilter] = useState<FilterId>("all");
  const visible = filter === "all" ? items : items.filter((i) => i.categories.includes(filter));
  const count = (id: FilterId) =>
    id === "all" ? items.length : items.filter((i) => i.categories.includes(id)).length;

  return (
    <>
      <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300",
              filter === f.id
                ? "text-bg border-transparent"
                : "border-line-strong text-fg/80 hover:border-fg/40",
            )}
          >
            {filter === f.id && (
              <m.span
                layoutId="filter-pill"
                className="bg-fg absolute inset-0 -z-0 rounded-full"
                transition={{ duration: 0.5, ease: EASE }}
              />
            )}
            <span className="relative">{f.label}</span>
            <span
              className={cn(
                "label-mono relative text-[0.6rem]",
                filter === f.id ? "text-bg/60" : "text-muted",
              )}
            >
              {count(f.id)}
            </span>
          </button>
        ))}
      </div>
      <m.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item) => (
            <m.li
              key={item.slug}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <Card item={item} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </>
  );
}
