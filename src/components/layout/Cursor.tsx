"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dot + lagging ring cursor (fine pointers only). Elements opt in to a label with
 * `data-cursor="VIEW" | "DRAG" | "COPY" | "OPEN"`.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("has-cursor");
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      setHidden(false);
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? null);
      setHover(!!target?.closest("a, button, [role='button'], input, textarea, select, label"));
    };
    const onLeave = () => setHidden(true);
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  const size = label ? 84 : hover ? 54 : 34;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] mix-blend-difference transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1 }}
    >
      <div ref={dot} className="absolute top-0 left-0">
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[width,height] duration-300"
          style={{ width: label ? 0 : 6, height: label ? 0 : 6 }}
        />
      </div>
      <div ref={ring} className="absolute top-0 left-0">
        <div
          className="ease-out-expo flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white transition-[width,height,background-color] duration-500"
          style={{ width: size, height: size, backgroundColor: label ? "#fff" : "transparent" }}
        >
          {label && <span className="label-mono text-[0.62rem] font-semibold text-black">{label}</span>}
        </div>
      </div>
    </div>
  );
}
