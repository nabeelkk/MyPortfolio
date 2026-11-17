"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageAsset } from "@/data/types";
import { asset } from "@/data/profile";
import { getLenis } from "@/lib/lenis";
import { EASE } from "@/lib/motion";

/** Image grid with an accessible lightbox (Esc, arrows, focus return). */
export function Gallery({ images }: { images: ImageAsset[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen((o) => {
      if (o !== null) window.setTimeout(() => triggers.current[o]?.focus(), 0);
      return null;
    });
  }, []);
  const move = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [open, close, move]);

  const current = open !== null ? images[open] : null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <li key={img.src} className={i === 0 ? "sm:col-span-2" : undefined}>
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => setOpen(i)}
              data-cursor="VIEW"
              className="group border-line bg-surface relative block w-full overflow-hidden rounded-2xl border text-left"
            >
              <span className="sr-only">Open image: </span>
              <Image
                src={asset(img.src)}
                width={img.width}
                height={img.height}
                alt={img.alt}
                sizes={i === 0 ? "(min-width: 1320px) 1200px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                className="ease-out-expo max-h-[80vh] w-full object-contain transition-transform duration-[1s] group-hover:scale-[1.02]"
              />
              {img.concept && (
                <span className="label-mono text-fg/80 absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[0.6rem]">
                  Design concept
                </span>
              )}
              <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="size-4" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <m.figure
              key={current.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex max-h-full max-w-6xl flex-col items-center"
            >
              <Image
                src={asset(current.src)}
                width={current.width}
                height={current.height}
                alt={current.alt}
                sizes="90vw"
                className="max-h-[80vh] w-auto rounded-xl object-contain"
              />
              <figcaption className="text-muted mt-4 text-center text-sm">
                {current.alt}
                {current.concept && " · Design concept with sample data"}
                <span className="label-mono ml-3 text-[0.62rem]">
                  {open! + 1} / {images.length}
                </span>
              </figcaption>
            </m.figure>
            <button
              ref={closeBtn}
              type="button"
              onClick={close}
              aria-label="Close image"
              className="border-line-strong absolute top-4 right-4 grid size-11 place-items-center rounded-full border bg-black/60"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous image"
                  className="border-line-strong absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border bg-black/60"
                >
                  <ArrowLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next image"
                  className="border-line-strong absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full border bg-black/60"
                >
                  <ArrowRight className="size-5" aria-hidden="true" />
                </button>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
