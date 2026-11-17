import { experience } from "@/data/experience";
import { caseStudyProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "./Timeline";

export function Experience() {
  const projectIndex = Object.fromEntries(
    caseStudyProjects.map((p) => [p.slug, { name: p.name, type: p.type, status: p.status }]),
  );
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          id="experience-title"
          index="04"
          label="Experience"
          title="Where I've shipped."
          intro="From web design to leading front-end teams to owning full-stack platforms end to end."
        />
        <Timeline roles={experience} projectIndex={projectIndex} />
      </div>
    </section>
  );
}
