import { ArrowDown, Phone } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiWhatsapp } from "react-icons/si";
import { asset, profile } from "@/data/profile";
import { SplitText } from "@/components/ui/SplitText";
import { Magnetic } from "@/components/ui/MagneticButton";
import { CopyEmail } from "./CopyEmail";
import { ContactForm } from "./ContactForm";

const socials = [
  { href: profile.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  { href: profile.github, label: "GitHub", Icon: SiGithub },
  { href: profile.whatsapp, label: "WhatsApp", Icon: SiWhatsapp },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden py-28 md:py-40"
    >
      {/* Outro ambience: dimmed structure, a single cobalt glow on the horizon */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[70%] [perspective:600px]">
          <div className="contact-floor absolute inset-x-[-50%] bottom-[-10%] h-full origin-bottom [transform:rotateX(68deg)]" />
        </div>
        <div className="bg-cobalt/35 absolute bottom-[-28rem] left-1/2 h-[44rem] w-[110rem] -translate-x-1/2 rounded-[50%] blur-[120px]" />
        <div className="from-bg absolute inset-x-0 top-0 h-48 bg-gradient-to-b to-transparent" />
      </div>

      <div className="container-x">
        <p className="label-mono text-muted">
          <span className="text-cobalt-soft">[ 08 ]</span> Contact
        </p>
        <SplitText
          id="contact-title"
          as="h2"
          text="Let's build something *great* together."
          className="font-display text-display-lg mt-6 max-w-6xl leading-[0.95] font-semibold tracking-[-0.04em]"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-fg/75 max-w-md text-lg leading-relaxed">
              I&apos;m open to senior full-stack roles: remote, or on-site with relocation. The fastest way to
              reach me is email.
            </p>
            <CopyEmail email={profile.email} />
            <ul className="mt-8 flex flex-wrap gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-line-strong bg-bg/40 hover:border-cobalt hover:bg-cobalt inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm backdrop-blur transition-colors"
                  >
                    <Icon className="size-4" aria-hidden="true" /> {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.phoneHref}
                  className="border-line-strong bg-bg/40 hover:border-fg/40 inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm backdrop-blur transition-colors"
                >
                  <Phone className="size-4" aria-hidden="true" /> {profile.phone}
                </a>
              </li>
            </ul>
            <Magnetic className="mt-8">
              <a
                href={asset(profile.resume)}
                download=""
                className="bg-fg text-bg inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors hover:bg-white"
              >
                Download Resume <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
