import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { ClientSites } from "@/components/sections/ClientSites";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { MoreWork } from "@/components/sections/MoreWork";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Marquee />
      <Work />
      <ClientSites />
      <Experience />
      <Skills />
      <MoreWork />
      <Education />
      <Contact />
    </>
  );
}
