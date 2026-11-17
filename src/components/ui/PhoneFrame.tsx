import { cn } from "@/lib/cn";

/** Slim phone bezel around a portrait screenshot. */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "border-line-strong relative rounded-[2rem] border bg-[#0a0b0e] p-1.5 shadow-[0_40px_100px_-30px_rgba(0,0,0,.95),inset_0_1px_0_rgba(255,255,255,.1)]",
        className,
      )}
    >
      <div className="bg-surface relative overflow-hidden rounded-[1.6rem]">
        {children}
        <span
          aria-hidden="true"
          className="absolute top-2 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-black/90"
        />
      </div>
    </div>
  );
}
