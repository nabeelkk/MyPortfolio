import { allWork, workFilters } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkGrid } from "./WorkGrid";

export function MoreWork() {
  return (
    <section id="more-work" aria-labelledby="more-title" className="relative py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          id="more-title"
          index="06"
          label="More work"
          title="The full index."
          intro="Everything in one place: case studies, tools, experiments and early projects."
        />
        <WorkGrid items={allWork} filters={workFilters} />
      </div>
    </section>
  );
}
