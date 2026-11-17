import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Smooth-scroll to an element/selector/position, falling back to native scrolling. */
export const scrollToTarget = (target: string | number | HTMLElement, offset = 0) => {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
};
