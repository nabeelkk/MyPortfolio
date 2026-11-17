"use client";

import { m } from "framer-motion";
import { useEffect } from "react";
import { EASE } from "@/lib/motion";

let firstLoad = true;

/** Cobalt wipe on client-side navigation (skipped on the initial page load so it never delays first paint). */
export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !firstLoad;
  useEffect(() => {
    firstLoad = false;
    if (animate) window.scrollTo(0, 0);
  }, [animate]);
  return (
    <>
      {animate && (
        <m.div
          aria-hidden="true"
          className="bg-cobalt pointer-events-none fixed inset-0 z-[95] origin-top"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
        />
      )}
      {children}
    </>
  );
}
