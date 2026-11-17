import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden pt-24">
      <div
        aria-hidden="true"
        className="grid-pattern absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)] opacity-50"
      />
      <div
        aria-hidden="true"
        className="bg-cobalt/20 absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
      />
      <div className="container-x relative text-center">
        <p className="label-mono text-cobalt-soft">[ Error 404 ]</p>
        <h1 className="chrome-text font-display mt-4 text-[clamp(7rem,28vw,20rem)] leading-[0.8] font-bold tracking-[-0.06em]">
          404
        </h1>
        <p className="text-fg/75 mx-auto mt-6 max-w-md text-lg">
          This route doesn&apos;t resolve. The page may have moved, or the link is wrong.
        </p>
        <Link
          href="/"
          className="bg-fg text-bg mt-10 inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium transition-colors hover:bg-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
        </Link>
      </div>
    </section>
  );
}
