// Page title/description live in ./metadata.tsx; Next.js only reads them from the page or layout.
export { metadata } from "./metadata";
import { ReactElement } from "react";
import Link from "next/link";
import { links } from "@/content/links";

export default function About(): ReactElement {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 lg:py-10">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          About
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          From the kitchen to the terminal.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          I&apos;m Deej, a developer and maker in Frankston, VIC. This site is
          where my personal projects live; the code is on GitHub.
        </p>
      </section>

      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">Where I started</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              I spent years as a chef in my family&apos;s restaurant before
              moving into tech. A kitchen teaches you to get it right under
              pressure, say clearly what&apos;s going on, and not make excuses
              when something breaks.
            </p>
            <p>
              After a Certificate in IT I moved into software through
              self-directed learning, client projects and junior full-stack
              work, and I still like working across code, electronics and
              fabrication in the same project.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">What I work with</h2>
          <ul className="list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            <li>TypeScript, Next.js, React and Node for web apps</li>
            <li>C and C++ on ESP32 boards, with PlatformIO and LVGL</li>
            <li>Python for AI agents and small services</li>
            <li>Docker and Coolify for self-hosting</li>
            <li>CAD, 3D printing, laser engraving and CNC for the physical side</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">See the work</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Most of it is open source. The home page lists the projects worth a
            look.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              GitHub
            </a>
            <Link
              href="/#projects"
              className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white"
            >
              Projects
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">Paid work</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Websites, custom tools, CAD and 3D printing for clients go through
            my business, Lumendot.
          </p>
          <a
            href={links.lumendot}
            className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white"
          >
            Go to Lumendot
          </a>
        </div>
      </section>
    </div>
  );
}
