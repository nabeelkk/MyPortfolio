"use client";

import { AnimatePresence, m, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { ProjectStatus, Role } from "@/data/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type ProjectIndex = Record<string, { name: string; type: string; status: ProjectStatus }>;

function RoleCard({ role, projectIndex, first }: { role: Role; projectIndex: ProjectIndex; first: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <m.li
      className="relative pl-10 md:pl-0"
      initial={{ opacity: 0, x: -32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {/* node */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-8 left-[7px] size-3 rounded-full border-2 md:left-[calc(25%-6px)]",
          first ? "border-cobalt bg-cobalt shadow-[0_0_24px_4px_rgba(61,107,255,.6)]" : "border-fg/40 bg-bg",
        )}
      />
      <div className="grid gap-4 md:grid-cols-4 md:gap-10">
        <div className="md:pt-6 md:pr-10 md:text-right">
          {role.period && <p className="label-mono text-fg/80">{role.period}</p>}
          <p className="text-muted mt-1 text-sm">{role.location}</p>
        </div>
        <article
          className={cn(
            "spotlight rounded-3xl border p-6 md:col-span-3 md:ml-6 md:p-8",
            first ? "border-cobalt/30 bg-surface" : "border-line bg-surface/60",
          )}
        >
          <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{role.title}</h3>
            <p className="label-mono text-cobalt-soft">{role.company}</p>
          </header>
          <ul className="text-fg/75 mt-5 space-y-3 text-[0.96rem] leading-relaxed">
            {role.points.map((pt) => (
              <li key={pt} className="relative pl-5">
                <span aria-hidden="true" className="bg-cobalt absolute top-[0.7em] left-0 h-px w-2.5" />
                {pt}
              </li>
            ))}
          </ul>
          {role.stack && (
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Stack">
              {role.stack.map((s) => (
                <li
                  key={s}
                  className="border-line-strong label-mono text-fg/70 rounded-full border px-2.5 py-1 text-[0.6rem]"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          {role.projects && role.projects.length > 0 && (
            <div className="border-line mt-6 border-t pt-5">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((o) => !o)}
                className="group text-fg inline-flex items-center gap-2 text-sm font-medium"
              >
                {open ? "Hide" : "Show"} projects built in this role ({role.projects.length})
                <ChevronDown
                  className={cn(
                    "ease-out-expo size-4 transition-transform duration-500",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <m.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <ul className="grid gap-2 pt-4 sm:grid-cols-2">
                      {role.projects.map((slug) => {
                        const p = projectIndex[slug];
                        if (!p) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/projects/${slug}/`}
                              className="group border-line hover:border-cobalt/50 hover:bg-cobalt/5 flex h-full items-center justify-between gap-3 rounded-2xl border p-4 transition-colors"
                            >
                              <span>
                                <span className="block font-medium">{p.name}</span>
                                <span className="text-muted mt-1 flex items-center gap-2 text-xs">
                                  {p.type} <StatusBadge status={p.status} className="scale-90" />
                                </span>
                              </span>
                              <ArrowUpRight
                                className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </article>
      </div>
    </m.li>
  );
}

export function Timeline({ roles, projectIndex }: { roles: Role[]; projectIndex: ProjectIndex }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <div className="relative">
      <div aria-hidden="true" className="bg-line absolute top-0 bottom-0 left-[12px] w-px md:left-[25%]">
        <m.div
          style={{ scaleY }}
          className="from-cobalt via-cobalt-soft to-cobalt/0 h-full w-full origin-top bg-gradient-to-b"
        />
      </div>
      <ol ref={ref} className="flex flex-col gap-10 md:gap-14">
        {roles.map((r, i) => (
          <RoleCard key={`${r.company}-${r.title}`} role={r} projectIndex={projectIndex} first={i === 0} />
        ))}
      </ol>
    </div>
  );
}
