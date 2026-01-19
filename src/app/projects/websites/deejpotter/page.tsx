import { ReactElement } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio Website | Deej Potter",
  description:
    "Technical details about my portfolio website - built with Next.js, TypeScript, and Bootstrap. Three major migrations from PHP to Angular to Next.js.",
};

export default function Deejpotter(): ReactElement {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          {/* Header */}
          <header className="mb-4">
            <h1 className="display-4 mb-3">Portfolio Website</h1>
            <p className="lead text-muted">
              My personal portfolio site - the one you&apos;re viewing right
              now. Built with Next.js, TypeScript, and Bootstrap.
            </p>
          </header>

          {/* Overview */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Overview</h2>
            <p>
              This portfolio has evolved through three major technology stacks
              over five years, from PHP (2019-2021) to Angular (2022-2023) to
              Next.js (2024-present). Each migration taught valuable lessons
              about choosing the right tool for the job.
            </p>
            <p>
              The current Next.js implementation focuses on performance, SEO,
              and maintainability - combining the benefits of static site
              generation with the flexibility of server-side rendering when
              needed.
            </p>
          </section>

          {/* Tech Stack */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Tech Stack</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 card-title">Frontend</h3>
                    <ul className="mb-0">
                      <li>Next.js 14.2 (App Router)</li>
                      <li>React 18</li>
                      <li>TypeScript</li>
                      <li>Bootstrap 5 + SCSS</li>
                      <li>React Bootstrap components</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 card-title">Backend & Services</h3>
                    <ul className="mb-0">
                      <li>Next.js API Routes</li>
                      <li>MongoDB (user data)</li>
                      <li>Clerk Authentication</li>
                      <li>Netlify Forms (contact)</li>
                      <li>Netlify CMS (content management)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 card-title">Development Tools</h3>
                    <ul className="mb-0">
                      <li>Yarn 4 (package management)</li>
                      <li>ESLint + Prettier</li>
                      <li>Jest (testing)</li>
                      <li>TypeDoc (documentation)</li>
                      <li>Git + GitHub</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body">
                    <h3 className="h5 card-title">Hosting & Deployment</h3>
                    <ul className="mb-0">
                      <li>Currently: Netlify</li>
                      <li>Migrating to: Coolify (self-hosted)</li>
                      <li>CI/CD: GitHub Actions</li>
                      <li>Domain: deejpotter.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Key Features</h2>
            <ul>
              <li>
                <strong>Technical Blog</strong> - Project write-ups with code
                examples and implementation details
              </li>
              <li>
                <strong>Project Showcase</strong> - Websites, apps, engineering
                projects, and games with external links
              </li>
              <li>
                <strong>Contact Form</strong> - Netlify Forms integration for
                contact submissions
              </li>
              <li>
                <strong>Responsive Design</strong> - Mobile-first Bootstrap 5
                layout
              </li>
              <li>
                <strong>Type Safety</strong> - Full TypeScript implementation
                throughout
              </li>
              <li>
                <strong>SEO Optimized</strong> - Static generation with Next.js
                metadata API
              </li>
              <li>
                <strong>Accessibility</strong> - WCAG 2.1 AA compliance (in
                progress)
              </li>
            </ul>
          </section>

          {/* Migration Journey */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Migration Journey</h2>
            <div className="timeline">
              <div className="mb-4">
                <h4 className="h5">Phase 1: PHP (2019-2021)</h4>
                <p className="text-muted mb-2">
                  Traditional LAMP stack: PHP 7.4, jQuery, Bootstrap 4, MySQL
                </p>
                <p>
                  Simple deployment and cheap hosting, but limited reusability
                  and no type safety. jQuery spaghetti code became
                  unmaintainable.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="h5">Phase 2: Angular (2022-2023)</h4>
                <p className="text-muted mb-2">
                  Single Page Application: Angular 14, TypeScript, RxJS
                </p>
                <p>
                  Modernized with component architecture and type safety.
                  However, large bundle sizes (850KB after optimization) and SEO
                  challenges without server-side rendering led to the next
                  migration.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="h5">Phase 3: Next.js (2024-Present)</h4>
                <p className="text-muted mb-2">
                  React Server Components: Next.js 14, App Router, TypeScript
                </p>
                <p>
                  Best of both worlds - static generation for performance,
                  server components for SEO, client components for
                  interactivity. Initial load: ~200KB, First Contentful Paint
                  under 1s.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Challenges */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Technical Challenges Solved</h2>
            <div className="accordion" id="challengesAccordion">
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#challenge1"
                  >
                    Angular to Next.js Migration
                  </button>
                </h3>
                <div
                  id="challenge1"
                  className="accordion-collapse collapse"
                  data-bs-parent="#challengesAccordion"
                >
                  <div className="accordion-body">
                    <p>
                      Migrated from Angular&apos;s component architecture to
                      Next.js App Router. Challenges included:
                    </p>
                    <ul>
                      <li>Converting Angular services to React hooks</li>
                      <li>Replacing RxJS observables with async/await</li>
                      <li>
                        Restructuring routing from Angular Router to file-based
                        routing
                      </li>
                      <li>Migrating from Angular Forms to React Hook Form</li>
                    </ul>
                    <p>
                      Result: 75% smaller initial bundle, better SEO, simpler
                      mental model.
                    </p>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#challenge2"
                  >
                    Blog System Implementation
                  </button>
                </h3>
                <div
                  id="challenge2"
                  className="accordion-collapse collapse"
                  data-bs-parent="#challengesAccordion"
                >
                  <div className="accordion-body">
                    <p>
                      Built a custom blog system using TypeScript files as
                      content source (no MDX complexity):
                    </p>
                    <ul>
                      <li>React components for rich content formatting</li>
                      <li>Static generation for all blog routes</li>
                      <li>Type-safe blog post structure</li>
                      <li>Integrated with BookStack for draft management</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h3 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#challenge3"
                  >
                    GitHub Packages Integration
                  </button>
                </h3>
                <div
                  id="challenge3"
                  className="accordion-collapse collapse"
                  data-bs-parent="#challengesAccordion"
                >
                  <div className="accordion-body">
                    <p>Configured private npm packages from GitHub Packages:</p>
                    <ul>
                      <li>
                        Set up npmScopes in yarn configuration for @deejpotter
                        scope
                      </li>
                      <li>Configured authentication with GitHub PAT</li>
                      <li>
                        Shared UI components between portfolio and CNC Tools
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Current Status */}
          <section className="mb-5">
            <h2 className="h3 mb-3">Current Status & Roadmap</h2>
            <p>
              <strong>Production:</strong> Live at{" "}
              <a
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
                href="https://github.com/Deejpotter/deejpotter"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/Deejpotter/deejpotter
              </a>
            </p>
            <p className="mb-3">
              <strong>Upcoming:</strong> Migrating from Netlify to self-hosted
              Coolify for better control and cost optimization.
            </p>
          </section>

          {/* Learn More */}
          <section>
            <div className="alert alert-info">
              <h3 className="h5 mb-2">Read the full migration story</h3>
              <p className="mb-0">
                Check out my{" "}
                <Link href="/blog/portfolio-migration">
                  Portfolio Migration blog post
                </Link>{" "}
                for detailed technical insights about the journey from PHP to
                Angular to Next.js.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
