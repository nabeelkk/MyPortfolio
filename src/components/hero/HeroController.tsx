"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import sequence from "@/data/sequence.json";
import { heroProgress } from "@/lib/heroProgress";
import { afterLoadIdle, isLowPowerDevice, isStaticMotion } from "@/lib/env";
import { cn } from "@/lib/cn";

const ScrollSequence = dynamic(() => import("./ScrollSequence"), { ssr: false });
const FallbackHeroScene = dynamic(() => import("@/components/three/FallbackHeroScene"), { ssr: false });

const CHAPTERS = [
  { label: "Intro", at: 0 },
  { label: "Craft", at: 0.25 },
  { label: "Work", at: 0.5 },
  { label: "Stack", at: 0.75 },
];

/**
 * Resolve on the first interaction, or after `timeout` ms (null = interaction only).
 * With `afterLoad`, the timeout starts once the window has loaded.
 */
function whenEngaged(timeout: number | null, afterLoad = false) {
  return new Promise<void>((resolve) => {
    const events = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;
    let timer = 0;
    const go = () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.clearTimeout(timer);
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    if (timeout === null) return;
    const arm = () => {
      timer = window.setTimeout(go, timeout);
    };
    if (afterLoad && document.readyState !== "complete") window.addEventListener("load", arm, { once: true });
    else arm();
  });
}

export function HeroController() {
  const [mode, setMode] = useState<"none" | "sequence" | "scene">("none");
  const [visible, setVisible] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  // Scroll timeline: progress → store, chapters fade/slide at set ranges.
  useEffect(() => {
    if (isStaticMotion()) return;
    const track = document.querySelector<HTMLElement>("[data-hero-track]");
    if (!track) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    // Chapter 1 is static until the visitor scrolls, so GSAP loads on first interaction
    // (or shortly after load) instead of competing with first paint and hydration.
    const ready = window.scrollY > 0 ? Promise.resolve() : whenEngaged(3500, true);
    ready
      .then(() => import("@/lib/gsap"))
      .then(({ gsap }) => {
        if (cancelled) return;
        ctx = gsap.context(() => {
          const q = (s: string) => track.querySelector<HTMLElement>(s)!;
          const ch = [1, 2, 3, 4].map((n) => q(`[data-chapter="${n}"]`));
          gsap.set(ch.slice(1), { autoAlpha: 0, y: 60 });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              onUpdate: (self) => {
                const p = self.progress;
                heroProgress.set(p);
                setAtTop(p < 0.02);
                let c = 0;
                CHAPTERS.forEach((x, i) => {
                  if (p >= x.at - 0.02) c = i;
                });
                setChapter(c);
              },
            },
          });
          // 1: 0–20%
          tl.to(ch[0], { autoAlpha: 0, y: -80, duration: 6 }, 15);
          // 2: 25–45%
          tl.to(ch[1], { autoAlpha: 1, y: 0, duration: 5 }, 24).to(
            ch[1],
            { autoAlpha: 0, y: -80, duration: 5 },
            42,
          );
          // 3: 50–70% (items reveal in sequence)
          const items3 = ch[2].querySelectorAll("[data-item]");
          tl.to(ch[2], { autoAlpha: 1, y: 0, duration: 4 }, 49)
            .fromTo(items3, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 3, stagger: 2.5 }, 50)
            .to(ch[2], { autoAlpha: 0, y: -80, duration: 5 }, 67);
          // 4: 75–100% (stays for the CTAs)
          const items4 = ch[3].querySelectorAll("[data-item]");
          const cta = ch[3].querySelector("[data-cta]");
          tl.to(ch[3], { autoAlpha: 1, y: 0, duration: 4 }, 74)
            .fromTo(items4, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 2, stagger: 1 }, 75)
            .fromTo(cta, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 3 }, 84)
            .set({}, {}, 100);
        }, track);
      });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  // Decide which visual to load, after first paint.
  useEffect(() => {
    if (isStaticMotion() || isLowPowerDevice()) return;
    let cancelled = false;
    const mobile = window.innerWidth < 768;
    afterLoadIdle()
      .then(() => (sequence.enabled ? Promise.resolve() : whenEngaged(mobile ? null : 4000)))
      .then(() => {
        if (!cancelled) setMode(sequence.enabled ? "sequence" : "scene");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onReady = useCallback(() => {
    setVisible(true);
    setLoadPct((p) => Math.max(p, mode === "scene" ? 1 : p));
  }, [mode]);
  const onProgress = useCallback((p: number) => setLoadPct(p), []);

  const loading = mode !== "none" && loadPct < 1;

  return (
    <div ref={root} className="hero-motion-only contents">
      <div
        className={cn(
          "ease-out-expo absolute inset-0 z-[1] transition-opacity duration-[1200ms]",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        {mode === "sequence" && (
          <ScrollSequence
            desktop={sequence.desktop}
            mobile={sequence.mobile}
            onReady={onReady}
            onProgress={onProgress}
          />
        )}
        {mode === "scene" && <FallbackHeroScene onReady={onReady} />}
      </div>

      {/* thin loading line */}
      <div
        aria-hidden="true"
        className={cn(
          "bg-cobalt absolute inset-x-0 top-0 z-30 h-px origin-left transition-[opacity,transform] duration-500",
          loading ? "opacity-100" : "opacity-0",
        )}
        style={{ transform: `scaleX(${mode === "scene" && !visible ? 0.6 : loadPct})` }}
      />

      {/* chapter progress */}
      <ol
        aria-hidden="true"
        className="absolute top-1/2 right-[var(--gutter)] z-30 hidden -translate-y-1/2 flex-col gap-4 md:flex"
      >
        {CHAPTERS.map((c, i) => (
          <li key={c.label} className="flex items-center justify-end gap-3">
            <span
              className={cn(
                "label-mono text-[0.6rem] transition-opacity duration-500",
                chapter === i ? "text-fg opacity-100" : "opacity-0",
              )}
            >
              {c.label}
            </span>
            <span className={cn("label-mono text-[0.6rem]", chapter === i ? "text-fg" : "text-muted")}>
              0{i + 1}
            </span>
            <span
              className={cn(
                "ease-out-expo h-px transition-all duration-500",
                chapter === i ? "bg-cobalt w-10" : "bg-fg/30 w-4",
              )}
            />
          </li>
        ))}
      </ol>

      {/* scroll hint */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-700",
          atTop ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="label-mono text-fg/70 text-[0.62rem]">Scroll to explore</span>
        <span className="scroll-line" />
      </div>
    </div>
  );
}
