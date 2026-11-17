import { cn } from "@/lib/cn";

/** Fallback cover for projects without screenshots: dark grid, name, stack chips, cobalt glow. */
export function GeneratedCover({
  name,
  stack = [],
  className,
}: {
  name: string;
  stack?: string[];
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${name} cover`}
      className={cn(
        "bg-surface relative flex aspect-[16/10] flex-col justify-end overflow-hidden p-5 sm:p-7",
        className,
      )}
    >
      <div className="grid-pattern absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="bg-cobalt/30 absolute -top-1/3 -right-1/4 size-[80%] rounded-full blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <p className="font-display text-fg relative text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
        {name}
      </p>
      {stack.length > 0 && (
        <ul className="relative mt-3 flex flex-wrap gap-1.5">
          {stack.slice(0, 4).map((s) => (
            <li
              key={s}
              className="border-line-strong label-mono text-muted rounded-full border px-2.5 py-0.5 text-[0.6rem]"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
