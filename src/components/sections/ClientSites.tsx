import { clientSites } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ClientGallery } from "./ClientGallery";

export function ClientSites() {
  return (
    <section id="clients" aria-labelledby="clients-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="container-x">
        <SectionHeading
          id="clients-title"
          index="03"
          label="Live client websites"
          title="Brand websites, live in production."
          intro="Luxury fragrance storefronts, a manufacturer, an architectural-hardware brand and a construction company. Hover a frame to scroll the page; drag to browse."
        />
      </div>
      <ClientGallery sites={clientSites} />
    </section>
  );
}
