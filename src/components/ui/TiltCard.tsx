"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/** 3D tilt + glare sweep on hover (mouse only). Sets --px/--py (0–1) for inner parallax. */
export function TiltCard({
  children,
  className,
  max = 6,
  cursor,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    el.style.setProperty("--px", String(px));
    el.style.setProperty("--py", String(py));
    el.style.setProperty("--glare", "1");
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--px", "0.5");
    el.style.setProperty("--py", "0.5");
    el.style.setProperty("--glare", "0");
  };
  return (
    <div className="[perspective:1400px]">
      <div
        ref={ref}
        data-cursor={cursor}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className={cn(
          "group/tilt ease-out-expo relative [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-transform duration-700 [transform-style:preserve-3d]",
          className,
        )}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glare,0)] transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.09) 45%, rgba(255,255,255,.02) 55%, transparent 70%)",
            backgroundSize: "250% 100%",
            backgroundPosition: "calc(var(--px, .5) * 100%) 0",
          }}
        />
      </div>
    </div>
  );
}
