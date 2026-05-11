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
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <header className="mb-5">
            <p className="text-uppercase text-muted small mb-2">Website project</p>
            <h1 className="display-4 mb-3">deejpotter.com</h1>
            <p className="lead text-muted mb-0">
              My personal website, portfolio, and lead-generation platform. It
              is designed to promote my work as a website designer and developer
              while also giving me room to publish technical tools, project
              write-ups, and practical experiments.
            </p>
          </header>

          <section className="mb-5">
            <h2 className="h3 mb-3">What this site needs to do</h2>
            <p>
              deejpotter.com is not just a portfolio archive. It needs to work
              as a clear public front door for client work - especially website
              design, website development, and related digital problem solving.
            </p>
            <p>
              That means it has to balance two jobs at once: show enough
              technical depth to build trust, and stay approachable enough that
              a small business owner or freelance client can quickly understand
              what I do and how to contact me.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Current stack</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 card-title">Core technologies</h3>
                    <ul className="mb-0">
                      {currentStack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 card-title">Working approach</h3>
                    <ul className="mb-0">
                      <li>Iterative refactoring instead of destructive rewrites</li>
                      <li>Technical fixes and test coverage improved in the same pass</li>
                      <li>Public pages and practical custom tools living side by side</li>
                      <li>Performance, SEO, and maintainability treated as product features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Product and marketing priorities</h2>
            <div className="row g-3">
              {priorities.map((priority) => (
                <div key={priority.title} className="col-md-4">
                  <div className="card h-100 border-0 bg-light">
                    <div className="card-body">
                      <h3 className="h5 card-title">{priority.title}</h3>
                      <p className="card-text mb-0 text-muted">{priority.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Client-fit direction</h2>
            <p>
              The strongest fit for this site is clients who want to discuss a
              project through written messages first - via a contact form,
              social media DMs, or freelance platforms such as Fiverr or
              Upwork. That keeps the contact flow lighter, easier to manage,
              and more comfortable for both sides.
            </p>
            <p>
              For that reason, the site should avoid presenting phone-first
              contact expectations or physical contact details. The better path
              is clear written calls to action, examples of work, and direct
              invitations to start the conversation in text.
            </p>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Roadmap</h2>
            <ul>
              {roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-5">
            <h2 className="h3 mb-3">Links</h2>
            <p className="mb-2">
              <strong>Production:</strong>{" "}
              <a
                href="https://deejpotter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                deejpotter.com
              </a>
            </p>
            <p className="mb-0">
              <strong>Repository:</strong>{" "}
              <a
                href="https://github.com/Deejpotter/deejpotter"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/Deejpotter/deejpotter
              </a>
            </p>
          </section>

          <section>
            <div className="alert alert-info">
              <h3 className="h5 mb-2">Want the broader context?</h3>
              <p className="mb-0">
                Explore more <Link href="/projects/websites">website projects</Link>,
                read the <Link href="/blog">blog</Link>, or <Link href="/contact">send a message</Link>
                if you want to talk about a website or custom build.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
