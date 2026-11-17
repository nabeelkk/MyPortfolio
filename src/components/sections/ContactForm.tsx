"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { useId, useState } from "react";
import { profile } from "@/data/profile";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "success" | "error";
type Fields = { from_name: string; email_id: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.from_name.trim().length < 2) e.from_name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email_id.trim())) e.email_id = "Please enter a valid email address.";
  if (f.message.trim().length < 10) e.message = "Please write at least 10 characters.";
  return e;
}

export function ContactForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ from_name: "", email_id: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...fields, [k]: e.target.value };
    setFields(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement | null)?.value;
    const errs = validate(fields);
    setErrors(errs);
    setTouched({ from_name: true, email_id: true, message: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (honeypot) {
      // Bots fill hidden fields — pretend success, send nothing.
      setStatus("success");
      return;
    }
    setStatus("sending");
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      if (!publicKey || !serviceId || !templateId) throw new Error("EmailJS is not configured");
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: fields.from_name.trim(),
          email_id: fields.email_id.trim(),
          message: fields.message.trim(),
        },
        { publicKey },
      );
      setStatus("success");
      setFields({ from_name: "", email_id: "", message: "" });
      setTouched({});
    } catch {
      setStatus("error");
    }
  };

  const field = (
    k: keyof Fields,
    label: string,
    type: "text" | "email" | "textarea",
    autoComplete: string,
  ) => {
    const id = `${uid}-${k}`;
    const err = touched[k] ? errors[k] : undefined;
    const cls = cn(
      "peer w-full rounded-2xl border bg-bg/60 px-4 pt-7 pb-3 text-fg backdrop-blur outline-none transition-colors placeholder:text-transparent focus:border-cobalt focus-visible:outline-none",
      err ? "border-red-400/70" : "border-line-strong",
    );
    return (
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            id={id}
            name={k}
            rows={5}
            placeholder={label}
            value={fields[k]}
            onChange={set(k)}
            onBlur={blur(k)}
            aria-invalid={!!err}
            aria-describedby={err ? `${id}-err` : undefined}
            required
            className={cn(cls, "min-h-36 resize-y")}
          />
        ) : (
          <input
            id={id}
            name={k}
            type={type}
            placeholder={label}
            autoComplete={autoComplete}
            value={fields[k]}
            onChange={set(k)}
            onBlur={blur(k)}
            aria-invalid={!!err}
            aria-describedby={err ? `${id}-err` : undefined}
            required
            className={cls}
          />
        )}
        <label
          htmlFor={id}
          className="label-mono text-muted peer-focus:text-cobalt-soft pointer-events-none absolute top-2.5 left-4 text-[0.62rem] transition-colors"
        >
          {label}
        </label>
        {err && (
          <p id={`${id}-err`} className="mt-1.5 pl-1 text-sm text-red-300">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="glass relative rounded-[2rem] p-5 sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <m.div
            key="ok"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[26rem] flex-col items-start justify-center gap-4"
            role="status"
          >
            <span className="bg-live/15 text-live grid size-14 place-items-center rounded-full">
              <Check className="size-6" aria-hidden="true" />
            </span>
            <h3 className="font-display text-3xl font-semibold tracking-tight">Message sent. Thank you!</h3>
            <p className="text-fg/70 max-w-md">I&apos;ll get back to you as soon as I can.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="border-line-strong hover:border-fg/40 mt-2 inline-flex h-11 items-center rounded-full border px-5 text-sm"
            >
              Send another message
            </button>
          </m.div>
        ) : (
          <m.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
            aria-label="Contact form"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {field("from_name", "Your name", "text", "name")}
              {field("email_id", "Your email", "email", "email")}
            </div>
            {field("message", "Message", "textarea", "off")}
            {/* Honeypot — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={`${uid}-company`}>Company</label>
              <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <AnimatePresence>
              {status === "error" && (
                <m.p
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 overflow-hidden rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>
                    Something went wrong sending your message. Please try again, or email me directly at{" "}
                    <a href={`mailto:${profile.email}`} className="underline">
                      {profile.email}
                    </a>
                    .
                  </span>
                </m.p>
              )}
            </AnimatePresence>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <p className="text-muted text-xs">All fields are required.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#2f5be8] px-6 font-medium text-white transition-[background-color,opacity] hover:bg-[#2450d8] disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight
                      className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
