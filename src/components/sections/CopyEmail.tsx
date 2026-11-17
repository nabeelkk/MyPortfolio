"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={copy}
        data-cursor="COPY"
        className="group font-display flex max-w-full items-center gap-3 text-left text-[clamp(1.05rem,1.75vw,1.5rem)] font-semibold tracking-tight"
        aria-label={`Copy email address ${email}`}
      >
        <span className="link-draw min-w-0 [overflow-wrap:anywhere]">{email}</span>
        <span className="border-line-strong group-hover:border-cobalt group-hover:bg-cobalt grid size-10 shrink-0 place-items-center rounded-full border transition-colors">
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </span>
      </button>
      <p role="status" aria-live="polite" className="text-live mt-2 h-5 text-sm">
        {copied ? "Email copied to clipboard" : ""}
      </p>
      <a href={`mailto:${email}`} className="link-draw text-muted hover:text-fg text-sm">
        Or open your mail app →
      </a>
    </div>
  );
}
