"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/lib/lenis";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="group label-mono text-muted hover:text-fg inline-flex items-center gap-2 transition-colors"
    >
      Back to top
      <span className="hairline ease-out-expo grid size-9 place-items-center rounded-full transition-transform duration-500 group-hover:-translate-y-1">
        <ArrowUp className="size-4" aria-hidden="true" />
      </span>
    </button>
  );
}
