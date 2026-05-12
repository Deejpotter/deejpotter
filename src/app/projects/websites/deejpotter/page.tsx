import { ReactElement } from "react";
import Link from "next/link";
import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "Portfolio Website",
  "Technical overview of deejpotter.com - a portfolio and lead-generation site for website design, website development, and practical custom tools.",
  "/projects/websites/deejpotter",
  "/images/og/portfolio-deejpotter.png"
);

const currentStack = [
  "Next.js App Router",
  "TypeScript",
  "React",
  "Tailwind CSS with legacy SCSS where migration is still in progress",
  "Clerk authentication",
  "MongoDB-backed API routes",
  "Vitest, Testing Library, Storybook, and TypeDoc",
];

const priorities = [
  {
    title: "Clear positioning",
    body: "The site needs to explain quickly that I design and build websites, not just experiment with code in private repos.",
  },
  {
    title: "Useful proof of work",
    body: "Project pages should show practical thinking, technical range, and the ability to finish real work - not just list buzzwords.",
  },
  {
    title: "Low-friction contact",
    body: "The goal is to attract text-first conversations through forms, messaging, social platforms, or freelance marketplaces instead of pushing phone calls.",
  },
];

const roadmap = [
  "Keep refining the homepage and service positioning around website design and development.",
  "Improve project case studies so they explain the problem, approach, and result more clearly.",
  "Strengthen SEO, metadata, and internal linking so the site works harder as a marketing asset.",
  "Continue replacing older styling patterns with cleaner reusable components and stronger tests.",
  "Prepare for self-hosted deployment and tighter operational control as the surrounding stack matures.",
];

export default function Deejpotter(): ReactElement {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Website project
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            deejpotter.com
          </h1>
          <p className="max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            My personal website, portfolio, and lead-generation platform. It is
            designed to promote my work as a website designer and developer
            while also giving me room to publish technical tools, project
            write-ups, and practical experiments.
          </p>
        </header>

        <section className="mb-10 space-y-4">
          <h2 className="text-3xl font-bold">What this site needs to do</h2>
          <p className="max-w-4xl text-gray-700 dark:text-gray-300">
            deejpotter.com is not just a portfolio archive. It needs to work as
            a clear public front door for client work - especially website
            design, website development, and related digital problem solving.
          </p>
          <p className="max-w-4xl text-gray-700 dark:text-gray-300">
            That means it has to balance two jobs at once: show enough technical
            depth to build trust, and stay approachable enough that a small
            business owner or freelance client can quickly understand what I do
            and how to contact me.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">Current stack</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-xl font-bold">Core technologies</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {currentStack.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-xl font-bold">Working approach</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Iterative refactoring instead of destructive rewrites</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Technical fixes and test coverage improved in the same pass</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Public pages and practical custom tools living side by side</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Performance, SEO, and maintainability treated as product features</span>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">Product and marketing priorities</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {priorities.map((priority) => (
              <article
                key={priority.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-3 text-xl font-bold">{priority.title}</h3>
                <p className="mb-0 text-gray-600 dark:text-gray-400">{priority.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-3xl font-bold">Client-fit direction</h2>
          <p className="max-w-4xl text-gray-700 dark:text-gray-300">
            The strongest fit for this site is clients who want to discuss a
            project through written messages first - via a contact form, social
            media DMs, or freelance platforms such as Fiverr or Upwork. That
            keeps the contact flow lighter, easier to manage, and more
            comfortable for both sides.
          </p>
          <p className="max-w-4xl text-gray-700 dark:text-gray-300">
            For that reason, the site should avoid presenting phone-first
            contact expectations or physical contact details. The better path is
            clear written calls to action, examples of work, and direct
            invitations to start the conversation in text.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">Roadmap</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {roadmap.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-3xl font-bold">Links</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Production:</strong>{" "}
              <a
                href="https://deejpotter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                deejpotter.com
              </a>
            </p>
            <p>
              <strong>Repository:</strong>{" "}
              <a
                href="https://github.com/Deejpotter/deejpotter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/Deejpotter/deejpotter
              </a>
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-6 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/30">
          <h3 className="mb-2 text-2xl font-bold">Want the broader context?</h3>
          <p className="mb-0 text-gray-700 dark:text-gray-300">
            Explore more <Link href="/projects/websites">website projects</Link>,
            read the <Link href="/blog">blog</Link>, or <Link href="/contact">send a message</Link>
            if you want to talk about a website or custom build.
          </p>
        </section>
      </div>
    </div>
  );
}
