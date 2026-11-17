"use client";

import { m, useReducedMotion } from "framer-motion";
import type { Architecture } from "@/data/types";
import { EASE } from "@/lib/motion";

const ROW = 92;
const BOX_H = 60;

function Node({
  x,
  y,
  w,
  label,
  kind,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  kind: "client" | "api" | "service";
}) {
  const accent = kind === "api";
  return (
    <m.g
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE, delay: kind === "client" ? 0 : kind === "api" ? 0.25 : 0.5 }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={BOX_H}
        rx={14}
        fill={accent ? "rgba(61,107,255,.14)" : "#0d0e11"}
        stroke={accent ? "#3d6bff" : "rgba(255,255,255,.14)"}
      />
      <text
        x={x + 18}
        y={y + 22}
        fill="#8b8f98"
        fontSize="10"
        fontFamily="var(--font-mono)"
        letterSpacing="1.6"
      >
        {kind === "client" ? "CLIENT" : kind === "api" ? "API" : "DATA / INFRA"}
      </text>
      <text x={x + 18} y={y + 43} fill="#f2f3f5" fontSize="15" fontFamily="var(--font-sans)" fontWeight="500">
        {label}
      </text>
    </m.g>
  );
}

function Wire({ d, delay }: { d: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      <m.path
        d={d}
        fill="none"
        stroke="rgba(125,155,255,.45)"
        strokeWidth={1.2}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE, delay }}
      />
      {!reduce && (
        <circle r={3} fill="#c9d3ff">
          <animateMotion dur="2.6s" repeatCount="indefinite" path={d} begin={`${delay + 1}s`} />
        </circle>
      )}
    </>
  );
}

/** Simple animated client → API → data/infra diagram, generated from project data. */
export function ArchitectureDiagram({ arch }: { arch: Architecture }) {
  // ── Horizontal (md+) ──
  const rows = Math.max(arch.clients.length, arch.services.length, 1);
  const H = rows * ROW + 20;
  const yFor = (i: number, n: number) => 10 + (H - 20 - n * ROW) / 2 + i * ROW + (ROW - BOX_H) / 2;
  const apiY = H / 2 - BOX_H / 2;
  const cX = 10,
    cW = 270,
    aX = 365,
    aW = 290,
    sX = 740,
    sW = 250;

  // ── Vertical (mobile) ──
  const all = [
    ...arch.clients.map((l) => ({ l, k: "client" as const })),
    { l: arch.api, k: "api" as const },
    ...arch.services.map((l) => ({ l, k: "service" as const })),
  ];
  const VH = all.length * 84 + 10;

  return (
    <figure className="border-line bg-surface/60 rounded-3xl border p-4 md:p-8">
      <svg
        viewBox={`0 0 1000 ${H}`}
        className="hidden w-full md:block"
        role="img"
        aria-labelledby="arch-title"
      >
        <title id="arch-title">
          {`Architecture: ${arch.clients.join(", ")} → ${arch.api} → ${arch.services.join(", ")}`}
        </title>
        {arch.clients.map((c, i) => {
          const y = yFor(i, arch.clients.length) + BOX_H / 2;
          return (
            <Wire
              key={`cw-${c}`}
              delay={0.3}
              d={`M${cX + cW},${y} C${cX + cW + 50},${y} ${aX - 50},${H / 2} ${aX},${H / 2}`}
            />
          );
        })}
        {arch.services.map((s, i) => {
          const y = yFor(i, arch.services.length) + BOX_H / 2;
          return (
            <Wire
              key={`sw-${s}`}
              delay={0.6}
              d={`M${aX + aW},${H / 2} C${aX + aW + 50},${H / 2} ${sX - 50},${y} ${sX},${y}`}
            />
          );
        })}
        {arch.clients.map((c, i) => (
          <Node key={c} x={cX} y={yFor(i, arch.clients.length)} w={cW} label={c} kind="client" />
        ))}
        <Node x={aX} y={apiY} w={aW} label={arch.api} kind="api" />
        {arch.services.map((s, i) => (
          <Node key={s} x={sX} y={yFor(i, arch.services.length)} w={sW} label={s} kind="service" />
        ))}
      </svg>

      <svg
        viewBox={`0 0 360 ${VH}`}
        className="w-full md:hidden"
        role="img"
        aria-label={`Architecture: ${all.map((a) => a.l).join(" → ")}`}
      >
        <Wire d={`M180,${42} L180,${VH - 50}`} delay={0.2} />
        {all.map((a, i) => (
          <Node key={a.l} x={10} y={10 + i * 84} w={340} label={a.l} kind={a.k} />
        ))}
      </svg>
      <figcaption className="label-mono text-muted mt-4 text-[0.62rem]">Simplified system diagram</figcaption>
    </figure>
  );
}
