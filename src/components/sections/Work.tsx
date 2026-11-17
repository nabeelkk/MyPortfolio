import { featuredProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkStack } from "./WorkStack";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 md:py-40">
      <div
        aria-hidden="true"
        className="bg-cobalt/10 pointer-events-none absolute top-40 left-1/2 h-[40rem] w-[70rem] max-w-full -translate-x-1/2 rounded-full blur-[140px]"
      />
      <div className="container-x relative">
        <SectionHeading
          id="work-title"
          index="02"
          label="Selected work"
          title="Systems built for real operations."
          intro="Multi-tenant ERPs, a privacy-first mobile app, native Android, SaaS and production e-commerce. Each one designed, engineered and shipped end to end."
        />
        {/* Cards only need display fields — keep case-study text out of the client payload. */}
        <WorkStack projects={featuredProjects.map((p) => ({ ...p, caseStudy: undefined }))} />
      </div>
    </section>
  );
}
