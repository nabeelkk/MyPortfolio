import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,.2),0_10px_40px_-10px_rgba(61,107,255,.6)]",
  outline: "border border-line-strong text-fg hover:border-fg/40 hover:bg-white/[.04]",
  ghost: "text-fg hover:bg-white/[.06]",
};

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
  cursor?: string;
}

/** Link styled as a button. External links open in a new tab with safe rel attributes. */
export function ButtonLink({
  href,
  children,
  variant = "outline",
  className,
  external,
  download,
  ariaLabel,
  cursor,
}: Props) {
  const cls = cn(
    "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-300 ease-out-expo active:scale-[.97]",
    styles[variant],
    className,
  );
  if (external || download || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        data-cursor={cursor}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: "" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel} data-cursor={cursor}>
      {children}
    </Link>
  );
}
