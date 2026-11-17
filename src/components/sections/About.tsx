import Image from "next/image";
import { asset, profile } from "@/data/profile";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoReveal } from "./PhotoReveal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          id="about-title"
          index="01"
          label="About"
          title="Engineer first. Obsessed with the details."
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5 lg:col-span-4">
            <PhotoReveal>
              <Image
                src={asset(profile.photo.src)}
                width={profile.photo.width}
                height={profile.photo.height}
                alt={profile.photo.alt}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/5] w-full object-cover object-[50%_20%]"
              />
            </PhotoReveal>
            <div className="border-line mt-5 flex items-start gap-3 rounded-2xl border p-4 text-sm">
              <span className="pulse-dot mt-1.5 shrink-0" aria-hidden="true" />
              <p>
                <span className="text-muted">Currently: </span>
                {profile.currently}
              </p>
            </div>
          </div>

          <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
            <Reveal>
              <p className="text-fg/80 text-lg leading-relaxed md:text-xl">{profile.summary}</p>
            </Reveal>
            <ScrollWords
              text={profile.statement}
              className="font-display mt-14 text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] font-semibold tracking-[-0.02em]"
            />
            <dl className="border-line bg-line mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border lg:grid-cols-4">
              {profile.stats.map((s) => (
                <div key={s.label} className="bg-bg flex flex-col-reverse gap-2 p-5 md:p-6">
                  <dt className="text-muted text-sm">{s.label}</dt>
                  <dd className="font-display text-5xl font-semibold tracking-tight">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-muted mt-6 text-sm">
              {profile.location} · {profile.availability}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
