"use client";

import { m } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Clip-path reveal on enter; duotone (cobalt/black) that blooms to colour on hover. */
export function PhotoReveal({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      className="group border-line relative overflow-hidden rounded-3xl border"
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <div className="ease-out-expo scale-[1.08] contrast-125 grayscale transition-[filter,transform] duration-[900ms] group-hover:scale-100 group-hover:contrast-100 group-hover:grayscale-0">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="bg-cobalt pointer-events-none absolute inset-0 opacity-70 mix-blend-color transition-opacity duration-700 group-hover:opacity-0"
      />
      <div
        aria-hidden="true"
        className="from-bg/70 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
      />
    </m.div>
  );
}
