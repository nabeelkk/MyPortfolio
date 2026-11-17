"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { asset, profile } from "@/data/profile";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/ui/MagneticButton";
import { Clock } from "./Clock";

const links = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    setOpen(false);
    if (!isHome) return; // let the link navigate to /#id
    e.preventDefault();
    window.setTimeout(() => scrollToTarget(`#${id}`), open ? 350 : 0);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <header
        className={cn(
          "ease-out-expo fixed inset-x-0 top-0 z-[80] px-3 pt-3 transition-transform duration-700 sm:px-5 sm:pt-4",
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-4 rounded-full pr-2 pl-3 transition-[background-color,border-color,box-shadow] duration-500",
            scrolled || open ? "glass" : "border border-transparent",
          )}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/"
              prefetch={false}
              className="group flex items-center gap-3"
              onClick={(e) => {
                setOpen(false);
                if (isHome) {
                  e.preventDefault();
                  scrollToTarget(0);
                }
              }}
            >
              <span
                aria-hidden="true"
                className="border-line-strong font-display group-hover:border-cobalt group-hover:bg-cobalt grid size-9 place-items-center rounded-full border text-sm font-semibold tracking-tight transition-colors"
              >
                {profile.monogram}
              </span>
              <span className="sr-only sm:not-sr-only sm:text-sm sm:font-medium">{profile.name}</span>
            </Link>
            <Clock className="label-mono text-muted hidden text-[0.6rem] lg:inline" />
          </div>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/#${l.id}`}
                  prefetch={false}
                  onClick={(e) => go(e, l.id)}
                  className="text-muted hover:text-fg rounded-full px-4 py-2 text-sm transition-colors hover:bg-white/[.05]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="border-line text-fg/85 hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs lg:inline-flex">
              <span className="pulse-dot" aria-hidden="true" />
              Open to opportunities
            </span>
            <span className="hidden sm:inline-flex">
              <Magnetic>
                <a
                  href={asset(profile.resume)}
                  download=""
                  className="bg-fg text-bg inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors hover:bg-white"
                >
                  Resume <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </Magnetic>
            </span>
            <button
              ref={menuButton}
              type="button"
              className="border-line-strong grid size-10 place-items-center rounded-full border md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="bg-bg/95 fixed inset-0 z-[70] flex flex-col px-6 pt-28 pb-10 backdrop-blur-xl md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <li key={l.id} className="overflow-hidden">
                  <m.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.06 }}
                  >
                    <Link
                      href={`/#${l.id}`}
                      prefetch={false}
                      onClick={(e) => go(e, l.id)}
                      className="font-display flex items-baseline gap-4 py-1 text-5xl font-semibold tracking-tight"
                    >
                      <span className="label-mono text-cobalt-soft">0{i + 1}</span>
                      {l.label}
                    </Link>
                  </m.span>
                </li>
              ))}
            </ul>
            <m.div
              className="mt-auto flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
            >
              <span className="text-fg/85 inline-flex items-center gap-2 text-sm">
                <span className="pulse-dot" aria-hidden="true" /> Open to opportunities
              </span>
              <a
                href={asset(profile.resume)}
                download=""
                className="bg-fg text-bg inline-flex h-12 items-center justify-center gap-2 rounded-full font-medium"
              >
                Download Resume <ArrowDown className="size-4" aria-hidden="true" />
              </a>
              <a href={`mailto:${profile.email}`} className="text-muted text-center text-sm">
                {profile.email}
              </a>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
