"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { isFinePointer, isStaticMotion } from "@/lib/env";

const SkillsOrb = dynamic(() => import("@/components/three/SkillsOrb"), { ssr: false });

/** Bento tile hosting the 3D skills orb (desktop, motion OK) or a static logo grid. */
export function OrbTile({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isStaticMotion() || !isFinePointer() || window.innerWidth < 1024) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-cursor={mount ? "DRAG" : undefined}
      className="border-line relative min-h-[320px] overflow-hidden rounded-3xl border bg-[radial-gradient(60%_60%_at_50%_45%,rgba(61,107,255,.18),transparent_70%)] md:col-span-12 lg:col-span-4 lg:row-span-2 lg:min-h-[440px]"
    >
      <p className="label-mono text-muted absolute top-6 left-6 z-10">In production</p>
      {mount ? <SkillsOrb /> : children}
      {mount && (
        <p className="label-mono text-muted pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[0.6rem]">
          Drag to rotate
        </p>
      )}
    </div>
  );
}
