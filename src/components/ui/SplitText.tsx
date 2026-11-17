"use client";

import { m } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Masked word reveal: each word slides up from behind its own mask, staggered.
 * Words separated by `*` markers render with the chrome gradient, e.g. "Let's build something *great*".
 */
export function SplitText({
  text,
  as = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  id,
}: {
  id?: string;
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const Comp = m[as];
  const words = text.split(" ");
  return (
    <Comp
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text.replaceAll("*", "")}
    >
      {words.map((word, i) => {
        const accent = word.startsWith("*") && word.replace(/[.,!?]$/, "").endsWith("*");
        const clean = word.replaceAll("*", "");
        return (
          <span
            key={`${word}-${i}`}
            aria-hidden="true"
            className="-mb-[0.12em] inline-flex overflow-hidden pb-[0.12em] align-bottom"
          >
            <m.span
              className={cn("inline-block will-change-transform", accent && "chrome-text pr-[0.08em] italic")}
              variants={{
                hidden: { y: "105%", opacity: 0 },
                show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
              }}
            >
              {clean}
            </m.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </Comp>
  );
}
