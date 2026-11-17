"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { ClientSite } from "@/data/types";
import { asset } from "@/data/profile";
import { GeneratedCover } from "@/components/ui/GeneratedCover";

const FRAME_RATIO = 1.25; // height / width of the visible frame

function SiteCard({ site }: { site: ClientSite }) {
  const img = site.full ?? site.cover;
  const ratio = img ? img.height / img.width : FRAME_RATIO;
  const travel = img && ratio > FRAME_RATIO ? (1 - FRAME_RATIO / ratio) * 100 : 0;
  const host = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <li className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[25vw]">
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        data-cursor="OPEN"
        className="group block"
      >
        <div className="border-line-strong bg-surface overflow-hidden rounded-2xl border shadow-[0_30px_80px_-40px_rgba(0,0,0,.9)]">
          <div
            className="border-line bg-surface-2 flex h-7 items-center gap-1.5 border-b px-3"
            aria-hidden="true"
          >
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="text-muted ml-2 truncate font-mono text-[0.6rem]">{host}</span>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            {img ? (
              <Image
                src={asset(img.src)}
                width={img.width}
                height={img.height}
                alt={img.alt}
                draggable={false}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
                className={
                  travel > 0
                    ? "w-full translate-y-0 transition-transform duration-[7s] ease-in-out group-hover:[transform:translateY(var(--travel))] group-focus-visible:[transform:translateY(var(--travel))]"
                    : "ease-out-expo h-full w-full object-cover object-top transition-transform duration-[1.2s] group-hover:scale-105"
                }
                style={{ ["--travel" as string]: `-${travel.toFixed(2)}%` }}
              />
            ) : (
              <GeneratedCover name={site.name} className="h-full" />
            )}
          </div>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold tracking-tight">{site.name}</h3>
            <p className="text-muted mt-1 text-sm leading-relaxed">{site.description}</p>
          </div>
          <span className="text-fg/80 group-hover:text-cobalt-soft mt-1 inline-flex shrink-0 items-center gap-1 text-sm transition-colors">
            Visit <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </div>
      </a>
    </li>
  );
}

export function ClientGallery({ sites }: { sites: ClientSite[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0, moved: false });

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { active: true, x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!drag.current.active || !el) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) {
      drag.current.moved = true;
      el.style.scrollSnapType = "none";
    }
    el.scrollLeft = drag.current.left - dx;
  };
  const onUp = () => {
    drag.current.active = false;
    if (scroller.current) scroller.current.style.scrollSnapType = "";
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };
  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        role="region"
        aria-label="Live client websites gallery"
        tabIndex={0}
        data-cursor="DRAG"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        className="snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain pb-6 [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "var(--gutter)" }}
      >
        <ul className="flex w-max gap-5 px-[var(--gutter)] md:gap-8 xl:px-[max(var(--gutter),calc((100vw-var(--maxw))/2+var(--gutter)))]">
          {sites.map((s) => (
            <SiteCard key={s.slug} site={s} />
          ))}
        </ul>
      </div>
      <div className="container-x mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Scroll gallery left"
          className="border-line-strong hover:border-fg/40 grid size-11 place-items-center rounded-full border transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Scroll gallery right"
          className="border-line-strong hover:border-fg/40 grid size-11 place-items-center rounded-full border transition-colors"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
