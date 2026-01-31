import { ReactElement } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio Website | Deej Potter",
  description:
    "Technical details about my portfolio website - built with Next.js, TypeScript, and Tailwind CSS. Three major migrations from PHP to Angular to Next.js.",
  openGraph: {
    title: "Portfolio Website | Deej Potter",
    description:
      "Explore Deej Potter's portfolio, projects, and technical blog posts about web engineering and embedded systems.",
    type: "website",
    url: "https://deejpotter.com/projects/websites/deejpotter",
    images: ["/images/og/portfolio-deejpotter.png"],
  },
};

export default function Deejpotter(): ReactElement {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          Portfolio Website
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          My personal portfolio site — the one you&apos;re viewing right now. Built with Next.js,
          TypeScript, and Tailwind CSS, after migrations from PHP and Angular.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
        <p className="text-gray-700 dark:text-gray-200">
          This portfolio has evolved through three major technology stacks over five years, from PHP
          (2019-2021) to Angular (2022-2023) to Next.js (2024-present). Each migration taught valuable
          lessons about choosing the right tool for the job. The current implementation focuses on
          performance, SEO, and maintainability, combining static site generation with server-side
          rendering when needed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Tech Stack</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {["Frontend", "Backend & Services", "Development Tools", "Hosting & Deployment"].map(
            (title, index) => {
              const items = [
                [
                  "Next.js (App Router)",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "MDX + custom components",
                ],
                [
                  "Next.js Route Handlers",
                  "MongoDB (user data)",
                  "Clerk Authentication",
                  "Netlify Forms (contact)",
                  "Netlify CMS (content management)",
                ],
                ["Yarn", "ESLint + Prettier", "Vitest + Playwright", "TypeDoc", "Git + GitHub"],
                ["Currently: Netlify", "Migrating: Coolify", "CI/CD: GitHub Actions", "Domain: deejpotter.com"],
              ][index];

              return (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            }
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Key Features</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-200">
          <li>
            <strong>Technical Blog</strong> — Project write-ups with code examples and implementation
            details
          </li>
          <li>
            <strong>Project Showcase</strong> — Websites, apps, engineering projects, and games with
            external links
          </li>
          <li>
            <strong>Contact Form</strong> — Netlify Forms integration for contact submissions
          </li>
          <li>
            <strong>Responsive Design</strong> — Tailwind-first, mobile-friendly layout
          </li>
          <li>
            <strong>Type Safety</strong> — Full TypeScript implementation throughout
          </li>
          <li>
            <strong>SEO Optimized</strong> — Static generation with the Next.js metadata API
          </li>
          <li>
            <strong>Accessibility</strong> — WCAG 2.1 AA compliance work in progress
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Migration Journey</h2>
        <div className="space-y-6 border-l-2 border-emerald-200 pl-6 dark:border-emerald-800">
          {[
            {
              title: "Phase 1: PHP (2019-2021)",
              meta: "Traditional LAMP stack: PHP 7.4, jQuery, Bootstrap 4, MySQL",
              body:
                "Simple deployment and cheap hosting, but limited reusability and no type safety. jQuery spaghetti code became unmaintainable.",
            },
            {
              title: "Phase 2: Angular (2022-2023)",
              meta: "Single Page Application: Angular 14, TypeScript, RxJS",
              body:
                "Modernized with component architecture and type safety. Large bundle sizes and SEO challenges without SSR led to the next migration.",
            },
            {
              title: "Phase 3: Next.js (2024-Present)",
              meta: "React Server Components: Next.js App Router, TypeScript",
              body:
                "Best of both worlds — static generation for performance, server components for SEO, client components for interactivity. Initial load ~200KB, FCP under 1s.",
            },
          ].map((phase) => (
            <div key={phase.title} className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{phase.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{phase.meta}</p>
              <p className="text-gray-700 dark:text-gray-200">{phase.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Technical Challenges Solved</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Angular to Next.js Migration",
              bullets: [
                "Converted Angular services to React hooks",
                "Replaced RxJS observables with async/await",
                "Moved from Angular Router to file-based routing",
                "Migrated forms to React Hook Form",
                "Result: 75% smaller initial bundle and better SEO",
              ],
            },
            {
              title: "Blog System Implementation",
              bullets: [
                "Custom blog content authored in TypeScript instead of MDX",
                "Static generation for all blog routes",
                "Type-safe post structure",
                "Draft management via BookStack",
              ],
            },
            {
              title: "GitHub Packages Integration",
              bullets: [
                "Scoped npm config for @deejpotter packages",
                "PAT-based authentication",
                "Shared UI components between portfolio and CNC Tools",
              ],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Current Status & Roadmap</h2>
        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          <p>
            <strong>Production:</strong> Live at{" "}
            <a
              className="text-emerald-700 underline decoration-emerald-400 decoration-2 underline-offset-4 hover:text-emerald-800 dark:text-emerald-200"
              href="https://deejpotter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              deejpotter.com
            </a>
          </p>
          <p>
            <strong>GitHub:</strong>{" "}
            <a
              className="text-emerald-700 underline decoration-emerald-400 decoration-2 underline-offset-4 hover:text-emerald-800 dark:text-emerald-200"
              href="https://github.com/Deejpotter/deejpotter"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/Deejpotter/deejpotter
            </a>
          </p>
          <p className="mb-0">
            <strong>Upcoming:</strong> Migrating from Netlify to self-hosted Coolify for better control
            and cost optimization.
          </p>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100">
          <h3 className="text-lg font-semibold">Read the full migration story</h3>
          <p className="mt-2 text-sm">
            Check out my {""}
            <Link
              href="/blog/portfolio-migration"
              className="font-semibold text-emerald-800 underline decoration-emerald-500 decoration-2 underline-offset-4 hover:text-emerald-900 dark:text-emerald-100"
            >
              Portfolio Migration blog post
            </Link>{" "}
            for detailed technical insights about the journey from PHP to Angular to Next.js.
          </p>
        </div>
      </section>
    </div>
  );
}
