import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiWhatsapp } from "react-icons/si";
import { Mail } from "lucide-react";
import { asset, profile } from "@/data/profile";
import { BackToTop } from "./BackToTop";
import { Clock } from "./Clock";

const socials = [
  { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  { href: profile.github, label: "GitHub", Icon: SiGithub },
  { href: profile.whatsapp, label: "WhatsApp", Icon: SiWhatsapp },
];

export function Footer() {
  return (
    <footer className="border-line bg-bg relative z-[1] overflow-hidden border-t pt-16 pb-8">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-mono text-muted">Based in</p>
            <p className="text-fg mt-2">{profile.location}</p>
            <Clock seconds className="text-muted mt-1 block font-mono text-sm" />
          </div>
          <div className="md:col-span-4">
            <p className="label-mono text-muted">Get in touch</p>
            <a
              href={`mailto:${profile.email}`}
              className="link-draw text-fg mt-2 inline-flex items-center gap-2 break-all"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              {profile.email}
            </a>
            <ul className="mt-4 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="border-line-strong text-muted hover:border-cobalt hover:bg-cobalt grid size-10 place-items-center rounded-full border transition-colors hover:text-white"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={asset(profile.resume)}
                  download=""
                  className="border-line-strong text-muted hover:border-fg/40 hover:text-fg inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
          <div className="flex md:col-span-3 md:justify-end">
            <BackToTop />
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="chrome-text font-display mt-14 text-center text-[24vw] leading-[0.8] font-bold tracking-[-0.06em] opacity-90 select-none"
      >
        NABEEL
      </p>

      <div className="container-x text-muted mt-6 flex flex-col justify-between gap-2 text-xs sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p>Designed &amp; engineered by {profile.name}.</p>
      </div>
    </footer>
  );
}
