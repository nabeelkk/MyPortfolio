import type { ProjectStatus } from "@/data/types";
import { cn } from "@/lib/cn";

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const live = status === "live";
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[0.62rem]",
        live ? "border-live/30 text-live" : "border-dev/30 text-dev",
        className,
      )}
    >
      {live ? (
        <span className="pulse-dot size-1.5!" aria-hidden="true" />
      ) : (
        <span aria-hidden="true" className="relative inline-block size-2 rounded-full border border-current">
          <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-current" />
        </span>
      )}
      {live ? "Live" : "In development"}
    </span>
  );
}
