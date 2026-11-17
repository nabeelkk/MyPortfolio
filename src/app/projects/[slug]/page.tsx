import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiGithub } from "react-icons/si";
import { ArchitectureDiagram } from "@/components/case/ArchitectureDiagram";
import { Gallery } from "@/components/case/Gallery";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { SplitText } from "@/components/ui/SplitText";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { profile, SITE_URL } from "@/data/profile";
import { caseStudyProjects, getProject } from "@/data/projects";
import type { ImageAsset } from "@/data/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.name} — Case study`;
  return {
    title,
    description: p.tagline,
    alternates: { canonical: `/projects/${p.slug}/` },
    openGraph: { title, description: p.tagline, url: `${SITE_URL}/projects/${p.slug}/`, type: "article" },
    twitter: { card: "summary_large_image", title, description: p.tagline },
  };
}

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-line grid gap-6 border-t py-14 md:grid-cols-12 md:py-20">
      <h2 className="label-mono text-muted md:col-span-3">
        <span className="text-cobalt-soft">{index}</span> {title}
      </h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((b) => (
        <li
          key={b}
          className="border-line bg-surface/60 text-fg/85 relative rounded-2xl border p-4 pl-9 leading-relaxed"
        >
          <span aria-hidden="true" className="bg-cobalt absolute top-[1.55rem] left-4 h-px w-2.5" />
          {b}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.caseStudy) notFound();
  const cs = p.caseStudy;
  const i = caseStudyProjects.findIndex((x) => x.slug === p.slug);
  const next = caseStudyProjects[(i + 1) % caseStudyProjects.length];
  const gallery: ImageAsset[] = [p.cover, p.secondary, p.phone, ...p.gallery].filter(
    (x): x is ImageAsset => !!x,
  );
  const isConcept = gallery.some((g) => g.concept);
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/projects/${p.slug}/` },
    ],
  };

  return (
    <article className="relative pt-32 pb-24 md:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div
        aria-hidden="true"
        className="bg-cobalt/15 pointer-events-none absolute top-0 left-1/2 h-[36rem] w-[70rem] max-w-full -translate-x-1/2 rounded-full blur-[140px]"
      />
      <div className="container-x relative">
        <Link
          href="/#work"
          className="group text-muted hover:text-fg inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />{" "}
          All work
        </Link>

        {/* Hero */}
        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="label-mono text-cobalt-soft">{p.type}</span>
            <StatusBadge status={p.status} />
          </div>
          <SplitText
            as="h1"
            text={p.name}
            className="font-display text-display-lg mt-6 max-w-5xl leading-[0.95] font-semibold tracking-[-0.04em]"
          />
          <p className="text-fg/75 mt-6 max-w-3xl text-xl leading-relaxed">{p.tagline}</p>

          <dl className="border-line bg-line mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4">
            <div className="bg-bg p-5">
              <dt className="label-mono text-muted text-[0.62rem]">Role</dt>
              <dd className="mt-2 text-sm">{profile.title}</dd>
            </div>
            <div className="bg-bg p-5">
              <dt className="label-mono text-muted text-[0.62rem]">Type</dt>
              <dd className="mt-2 text-sm">{p.type}</dd>
            </div>
            <div className="bg-bg p-5">
              <dt className="label-mono text-muted text-[0.62rem]">Status</dt>
              <dd className="mt-2 text-sm">{p.status === "live" ? "Live" : "In development"}</dd>
            </div>
            <div className="bg-bg p-5">
              <dt className="label-mono text-muted text-[0.62rem]">Context</dt>
              <dd className="mt-2 text-sm">
                {p.employer ? `Built during my role at ${p.employer}` : "Independent project"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="border-line-strong label-mono text-fg/75 rounded-full border px-3 py-1.5 text-[0.62rem]"
              >
                {s}
              </span>
            ))}
          </div>
          {(p.links.live || p.links.github) && (
            <div className="mt-8 flex flex-wrap gap-2">
              {p.links.live && (
                <a
                  href={p.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-fg text-bg inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium hover:bg-white"
                >
                  Visit live site <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              )}
              {p.links.github && (
                <a
                  href={p.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-line-strong hover:border-fg/40 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm"
                >
                  <SiGithub className="size-4" aria-hidden="true" /> View source
                </a>
              )}
            </div>
          )}
        </header>

        <Reveal className="mt-16">
          <BrowserFrame url={p.links.live} label={p.name}>
            <SmartImage
              image={p.cover}
              name={p.name}
              stack={p.stack}
              className="aspect-[16/10]"
              priority
              sizes="(min-width: 1320px) 1240px, 100vw"
            />
          </BrowserFrame>
          {isConcept && (
            <p className="text-muted mt-3 text-sm">
              Screens shown are design concepts with sample data. The product is in development.
            </p>
          )}
        </Reveal>

        <div className="mt-20">
          <Block index={idx()} title="Overview">
            <p className="text-fg/85 text-xl leading-relaxed md:text-2xl">{cs.overview}</p>
          </Block>
          <Block index={idx()} title="Problem">
            <p className="text-fg/80 text-lg leading-relaxed">{cs.problem}</p>
          </Block>
          <Block index={idx()} title="What I built">
            <Bullets items={cs.built} />
          </Block>
          <Block index={idx()} title="Architecture & key decisions">
            <ArchitectureDiagram arch={cs.architecture} />
            <ol className="mt-8 space-y-4">
              {cs.decisions.map((d, k) => (
                <li key={d} className="text-fg/85 flex gap-4 leading-relaxed">
                  <span className="label-mono text-cobalt-soft pt-1">{String(k + 1).padStart(2, "0")}</span>
                  {d}
                </li>
              ))}
            </ol>
          </Block>
          {(cs.builtSoFar || cs.planned || cs.statusNote) && (
            <Block index={idx()} title="Status">
              {cs.statusNote && <p className="text-fg/80 mb-8 text-lg leading-relaxed">{cs.statusNote}</p>}
              {(cs.builtSoFar || cs.planned) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {cs.builtSoFar && (
                    <div className="border-live/20 bg-live/[.04] rounded-3xl border p-6">
                      <h3 className="label-mono text-live">Built so far</h3>
                      <ul className="text-fg/85 mt-4 space-y-2.5">
                        {cs.builtSoFar.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span aria-hidden="true" className="text-live">
                              ✓
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {cs.planned && (
                    <div className="border-dev/20 bg-dev/[.04] rounded-3xl border p-6">
                      <h3 className="label-mono text-dev">Planned</h3>
                      <ul className="text-fg/85 mt-4 space-y-2.5">
                        {cs.planned.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span aria-hidden="true" className="text-dev">
                              ○
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Block>
          )}
          {gallery.length > 0 && (
            <Block index={idx()} title="Gallery">
              <Gallery images={gallery} />
            </Block>
          )}
        </div>

        {/* Next project */}
        <Link
          href={`/projects/${next.slug}/`}
          data-cursor="VIEW"
          className="group border-line-strong bg-surface hover:border-cobalt/50 mt-10 block overflow-hidden rounded-[2rem] border p-8 transition-colors md:p-14"
        >
          <p className="label-mono text-muted">Next project</p>
          <div className="mt-4 flex items-end justify-between gap-6">
            <p className="font-display text-display-md ease-out-expo leading-[0.95] font-semibold tracking-[-0.03em] transition-transform duration-700 group-hover:translate-x-2">
              {next.name}
            </p>
            <span className="bg-fg text-bg ease-out-expo grid size-14 shrink-0 place-items-center rounded-full transition-transform duration-700 group-hover:rotate-45">
              <ArrowUpRight className="size-6" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>
    </article>
  );
}
