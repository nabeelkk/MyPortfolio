import { SplitText } from "./SplitText";
import { cn } from "@/lib/cn";

/** Numbered section label + split-text heading, e.g. `[ 02 ] SELECTED WORK`. */
export function SectionHeading({
  index,
  label,
  title,
  intro,
  className,
  id,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("mb-14 grid gap-6 md:mb-20 md:grid-cols-12", className)}>
      <p className="label-mono text-muted md:col-span-3 md:pt-4">
        <span className="text-cobalt-soft">[ {index} ]</span> {label}
      </p>
      <div className="md:col-span-9">
        <SplitText
          as="h2"
          id={id}
          text={title}
          className="font-display text-display-md leading-[0.98] font-semibold tracking-[-0.03em] text-balance"
        />
        {intro && <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed">{intro}</p>}
      </div>
    </header>
  );
}
