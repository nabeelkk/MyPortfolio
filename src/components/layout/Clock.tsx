"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live IST clock. Renders a stable placeholder on the server to avoid hydration mismatch. */
export function Clock({ seconds = false, className }: { seconds?: boolean; className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      const t = fmt.format(new Date());
      setNow(seconds ? t : t.slice(0, 5));
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);
  return (
    <span className={className}>
      <time suppressHydrationWarning>{now ?? (seconds ? "--:--:--" : "--:--")}</time> IST
    </span>
  );
}
