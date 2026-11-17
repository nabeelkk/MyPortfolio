"use client";

import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import type { Project } from "@/data/types";
import { ProjectCard } from "./ProjectCard";

function StackItem({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.03]);
  const dim = useTransform(
    progress,
    [start, Math.min(1, start + 2 / total)],
    [0, index === total - 1 ? 0 : 0.55],
  );
  return (
    <li className="md:sticky md:h-[min(86vh,760px)]" style={{ top: `calc(6.5rem + ${index * 14}px)` }}>
      <m.div style={{ scale }} className="relative h-full origin-top">
        <ProjectCard project={project} index={index} total={total} />
        <m.div
          aria-hidden="true"
          style={{ opacity: dim }}
          className="bg-bg pointer-events-none absolute inset-0 hidden rounded-[2rem] md:block"
        />
      </m.div>
    </li>
  );
}

/** Featured cards stacked with a sticky scale-down effect (desktop); simple stack on mobile. */
export function WorkStack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <ol ref={ref} className="flex flex-col gap-8 md:gap-[12vh]" aria-label="Featured projects">
      {projects.map((p, i) => (
        <StackItem key={p.slug} project={p} index={i} total={projects.length} progress={scrollYProgress} />
      ))}
    </ol>
  );
}
