import { cn } from "@/lib/cn";

/** Minimal dark browser chrome around a screenshot. */
export function BrowserFrame({
  children,
  url,
  label,
  className,
}: {
  children: React.ReactNode;
  url?: string;
  /** Shown in the address bar when there is no live URL. */
  label?: string;
  className?: string;
}) {
  const host = url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : (label ?? "");
  return (
    <div
      className={cn(
        "border-line-strong bg-surface overflow-hidden rounded-xl border shadow-[0_40px_120px_-40px_rgba(0,0,0,.9),inset_0_1px_0_rgba(255,255,255,.06)]",
        className,
      )}
    >
      <div className="border-line bg-surface-2 flex h-8 items-center gap-3 border-b px-3" aria-hidden="true">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <div className="text-muted mx-auto flex h-5 max-w-[60%] flex-1 items-center justify-center rounded-md bg-white/[.04] px-3 font-mono text-[0.62rem]">
          <span className="truncate">{host}</span>
        </div>
        <span className="w-10" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
