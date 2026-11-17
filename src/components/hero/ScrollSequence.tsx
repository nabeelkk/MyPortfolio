"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/data/profile";
import { heroProgress } from "@/lib/heroProgress";
import { onIdle } from "@/lib/env";

export interface SequenceSet {
  count: number;
  width: number;
  height: number;
}

interface Props {
  desktop: SequenceSet;
  mobile: SequenceSet;
  onReady: () => void;
  onProgress: (loaded: number) => void;
}

const EAGER = 20;
const frameUrl = (set: "desktop" | "mobile", i: number) =>
  asset(`/sequence/${set}/${String(i + 1).padStart(4, "0")}.webp`);

/**
 * Canvas frame-sequence scrubber. Draws the frame matching hero scroll progress,
 * with object-fit: cover maths. Loads the first frames eagerly and the rest when idle.
 */
export default function ScrollSequence({ desktop, mobile, onReady, onProgress }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvas.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d", { alpha: false });
    if (!ctx) return;

    const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches || window.innerWidth < 768;
    const setName = portrait && mobile.count > 0 ? "mobile" : "desktop";
    const set = setName === "mobile" ? mobile : desktop;
    const frames: (HTMLImageElement | null)[] = new Array(set.count).fill(null);
    let loaded = 0;
    let current = -1;
    let disposed = false;
    let readyFired = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { clientWidth: w, clientHeight: h } = cvs;
      cvs.width = Math.round(w * dpr);
      cvs.height = Math.round(h * dpr);
      current = -1;
      draw(heroProgress.get());
    };

    const nearestLoaded = (i: number) => {
      if (frames[i]) return frames[i];
      for (let d = 1; d < set.count; d++) {
        const a = frames[i - d];
        if (a) return a;
        const b = frames[i + d];
        if (b) return b;
      }
      return null;
    };

    const draw = (p: number) => {
      const i = Math.min(set.count - 1, Math.max(0, Math.round(p * (set.count - 1))));
      const img = nearestLoaded(i);
      if (!img || (i === current && frames[i])) return;
      current = frames[i] ? i : -1;
      const cw = cvs.width;
      const ch = cvs.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(setName, i);
        const done = () => {
          if (disposed) return resolve();
          frames[i] = img;
          loaded++;
          onProgress(loaded / set.count);
          if (!readyFired && i === 0) {
            readyFired = true;
            draw(heroProgress.get());
            onReady();
          }
          resolve();
        };
        img
          .decode()
          .then(done)
          .catch(() => {
            loaded++;
            onProgress(loaded / set.count);
            resolve();
          });
      });

    const run = async () => {
      // 1) eager first frames, in parallel
      await Promise.all(Array.from({ length: Math.min(EAGER, set.count) }, (_, i) => load(i)));
      // 2) the rest, progressively, in small idle batches
      let next = EAGER;
      const batch = () => {
        if (disposed || next >= set.count) return;
        const end = Math.min(set.count, next + 8);
        const jobs: Promise<void>[] = [];
        for (; next < end; next++) jobs.push(load(next));
        Promise.all(jobs).then(() => onIdle(batch, 500));
      };
      onIdle(batch, 500);
    };

    resize();
    run();
    const unsub = heroProgress.subscribe((p) => requestAnimationFrame(() => draw(p)));
    window.addEventListener("resize", resize);
    return () => {
      disposed = true;
      unsub();
      window.removeEventListener("resize", resize);
    };
  }, [desktop, mobile, onReady, onProgress]);

  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
