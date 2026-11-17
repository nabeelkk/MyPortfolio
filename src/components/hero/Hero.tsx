import { ArrowDown, ArrowRight } from "lucide-react";
import { asset, profile } from "@/data/profile";
import { HeroController } from "./HeroController";

const offerings = ["ERP platforms", "SaaS", "Mobile apps", "Real-time systems"];

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="hero-track" data-hero-track>
      <div className="hero-stage" data-hero-stage>
        {/* Instant first paint: poster image + server-rendered text */}
        <picture className="hero-poster absolute inset-0 z-0">
          <source media="(max-width: 767px)" srcSet={asset("/sequence/poster-mobile.webp")} />
          <img
            src={asset("/sequence/poster.webp")}
            alt=""
            aria-hidden="true"
            decoding="async"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
        </picture>

        <HeroController />

        {/* Vignette for legibility */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_30%,rgba(5,5,6,.85)_100%)]" />
          <div className="from-bg via-bg/60 absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent" />
          <div className="from-bg/80 absolute inset-x-0 top-0 h-40 bg-gradient-to-b to-transparent" />
        </div>

        <div className="hero-chapters absolute inset-0 z-20">
          {/* 1 — name */}
          <div className="hero-chapter" data-chapter="1">
            <div className="container-x px-0!">
              <p className="label-mono text-fg/70 mb-6 flex items-center gap-3" data-reveal>
                <span className="bg-fg/40 h-px w-10" aria-hidden="true" />
                Portfolio · {profile.location}
              </p>
              <h1
                className="font-display text-display-xl leading-[0.86] font-bold tracking-[-0.045em]"
                data-reveal
              >
                <span className="chrome-text block">Muhammed</span>
                <span className="chrome-text block">Nabeel KK</span>
              </h1>
              <p
                className="text-fg/85 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-lg sm:text-2xl"
                data-reveal
              >
                {profile.title}
                <span className="border-line-strong text-fg/85 inline-flex items-center gap-2 rounded-full border bg-black/30 px-3 py-1 text-xs backdrop-blur">
                  <span className="pulse-dot" aria-hidden="true" /> Open to opportunities
                </span>
              </p>
            </div>
          </div>

          {/* 2 — statement */}
          <div className="hero-chapter" data-chapter="2">
            <div className="container-x px-0!">
              <p className="label-mono text-cobalt-soft mb-6">[ What I do ]</p>
              <p className="font-display text-display-lg max-w-5xl leading-[0.95] font-semibold tracking-[-0.035em] text-balance">
                I build software that runs <span className="chrome-text">real businesses.</span>
              </p>
            </div>
          </div>

          {/* 3 — offerings */}
          <div className="hero-chapter" data-chapter="3">
            <div className="container-x px-0!">
              <p className="label-mono text-cobalt-soft mb-6">[ Built &amp; shipped ]</p>
              <ul className="font-display text-display-md flex flex-col gap-1 leading-[1.02] font-semibold tracking-[-0.03em] sm:gap-2">
                {offerings.map((o, i) => (
                  <li key={o} data-item className="flex items-baseline gap-4">
                    <span className="label-mono text-muted">0{i + 1}</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4 — stack + CTAs */}
          <div className="hero-chapter" data-chapter="4">
            <div className="container-x px-0!">
              <p className="label-mono text-cobalt-soft mb-6">[ Core stack ]</p>
              <ul className="font-display text-display-sm flex max-w-5xl flex-wrap gap-x-5 gap-y-1 leading-tight font-semibold tracking-[-0.02em] sm:text-[clamp(1.75rem,3.6vw,3.25rem)]">
                {profile.coreStack.map((t, i) => (
                  <li key={t} data-item className="flex items-center gap-5">
                    {t}
                    {i < profile.coreStack.length - 1 && (
                      <span className="text-cobalt" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3" data-cta>
                <a
                  href="#work"
                  className="group bg-fg text-bg inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors hover:bg-white"
                >
                  View work
                  <ArrowRight
                    className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
                <a
                  href={asset(profile.resume)}
                  download=""
                  className="border-line-strong hover:border-fg/40 inline-flex h-12 items-center gap-2 rounded-full border bg-black/30 px-6 font-medium backdrop-blur transition-colors"
                >
                  Download CV <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
