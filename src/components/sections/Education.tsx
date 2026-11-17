import { GraduationCap } from "lucide-react";
import { education } from "@/data/education";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="relative py-28 md:py-32">
      <div className="container-x">
        <SectionHeading id="education-title" index="07" label="Education" title="Foundations." />
        <ul className="grid gap-4 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal
              as="li"
              key={e.degree}
              delay={i * 0.08}
              className="spotlight border-line bg-surface/70 rounded-3xl border p-7 md:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="border-line-strong text-cobalt-soft grid size-11 place-items-center rounded-full border">
                  <GraduationCap className="size-5" aria-hidden="true" />
                </span>
                <span className="label-mono text-muted">{e.period}</span>
              </div>
              <h3 className="font-display mt-8 text-2xl font-semibold tracking-tight md:text-3xl">
                {e.degree}
              </h3>
              <p className="text-fg/75 mt-2">
                {e.school}
                {e.location && <span className="text-muted"> · {e.location}</span>}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
