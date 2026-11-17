"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { afterLoadIdle, isFinePointer, prefersReducedMotion } from "@/lib/env";

const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });

/** Mounts non-critical, client-only effects after the page has loaded and gone idle. */
export function ClientEffects() {
  const [ready, setReady] = useState<{ smooth: boolean; cursor: boolean } | null>(null);

  // Cursor spotlight for `.spotlight` tiles: one passive listener for the whole page.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    let cancelled = false;
    afterLoadIdle(1500).then(() => {
      if (cancelled) return;
      const reduce = prefersReducedMotion();
      setReady({ smooth: !reduce, cursor: !reduce && isFinePointer() });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      {ready.smooth && <SmoothScroll />}
      {ready.cursor && <Cursor />}
    </>
  );
}
