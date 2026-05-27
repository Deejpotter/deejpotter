import { ReactElement } from "react";
import Link from "next/link";

export default function About(): ReactElement {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-12 lg:py-16">
      <section className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          About
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          I build things that work.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Websites, custom tools, 3D-printed parts, laser-cut pieces — if it
          solves a real problem for someone, I want to build it. Based in
          Frankston, VIC, I work with small businesses and hobbyists across
          Australia.
        </p>
      </section>

      <section className="mb-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">Where I started</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              I spent years working as a chef in my family&apos;s restaurant
              before moving into tech. Running a kitchen teaches you something
              you can&apos;t learn from a tutorial: get it right under pressure,
              communicate clearly, and don&apos;t make excuses when things go
              wrong.
            </p>
            <p>
              After completing a Certificate in IT, I moved into software
              through self-directed learning, client projects, and junior
              full-stack development. That mix — kitchen discipline plus
              technical skills — is why I&apos;m comfortable working across
              design, code, and fabrication in the same project.
            </p>
            <p>
              I love learning new things and sharing what I figure out. If you
              want to understand how something works, I&apos;ll explain it — not
              to show off, but because genuinely understanding your tools makes
              everything better.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">What I do now</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Websites.</strong> Small business sites, portfolio pages,
              landing pages, and redesigns. Built clean, fast, and easy to
              maintain.
            </p>
            <p>
              <strong>Custom tools.</strong> Calculators, internal dashboards,
              workflow helpers — the stuff that saves hours of manual work
              every week.
            </p>
            <p>
              <strong>Fabrication.</strong> 3D printing, laser cutting, and CNC
              milling for prototypes, replacement parts, and one-off pieces. No
              CAD experience required.
            </p>
            <p>
              <strong>Learning and sharing.</strong> I enjoy figuring things out
              and helping others do the same. If you have a question, ask.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">How I work</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              I prefer projects where there&apos;s a real need to solve. Send me
              a written brief — what&apos;s the problem, what&apos;s the
              deadline, what does success look like. I&apos;ll tell you honestly
              whether it&apos;s a fit.
            </p>
            <p>
              Clear brief → working build → refinement → handover. No drama, no
              mystery, no getting handed off to someone else.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-bold">Let&apos;s work together</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              If you need a website, a custom tool, or help with a fabrication
              project, send me a message. Include the basics of what you&apos;re
              trying to do — I can usually tell you quickly whether it&apos;s a
              good fit and give you a rough idea of cost and timing.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
