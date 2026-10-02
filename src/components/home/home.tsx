import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { links } from "@/content/links";
import { projects, type Project } from "@/content/projects";
import { PrintCube, Reveal, SpotlightGrid } from "./motion";

// Status chips share one colour scale so "live" reads as done at a glance.
const statusStyle: Record<Project["status"], string> = {
  live: "bg-emerald-300 text-gray-950",
  "in progress": "bg-amber-200 text-gray-950",
  archived: "bg-white/10 text-white/70",
};

// Smaller corners of the site that aren't repos of their own.
const onThisSite = [
  {
    title: "Tools",
    description: "Cut optimisers, a box packing calculator and a CNC calibration helper that run in the browser.",
    href: "/projects/tools",
  },
  {
    title: "Games",
    description: "Unity and pixel-art games you can play right here.",
    href: "/projects/games",
  },
  {
    title: "Engineering",
    description: "Hardware builds: ESP32 cars, CYD touchscreens and 3D printer firmware.",
    href: "/projects/engineering",
  },
  {
    title: "Write-ups",
    description: "Longer notes on how some of these were built and what went wrong.",
    href: "/blog",
  },
];

function ProjectLinks({ project }: { project: Project }): ReactElement | null {
  const items = [
    project.live && { href: project.live, label: "Live", external: true },
    project.repo && { href: project.repo, label: "Code", external: true },
    project.page && { href: project.page, label: "Read more", external: false },
  ].filter(Boolean) as { href: string; label: string; external: boolean }[];

  // Private projects have nothing to link to; say so rather than show an empty row.
  if (items.length === 0) {
    return <span className="text-sm text-white/50">Private repo for now</span>;
  }

  return (
    <span className="flex flex-wrap gap-4 text-sm font-semibold">
      {items.map((item) =>
        item.external ? (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 hover:underline"
          >
            {item.label} <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <Link key={item.label} href={item.href} className="text-emerald-300 hover:underline">
            {item.label} <span aria-hidden="true">→</span>
          </Link>
        ),
      )}
    </span>
  );
}

export default function Home(): ReactElement {
  return (
    <>
      <Script id="schema-person" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://deejpotter.com/#person",
          name: "Deej Potter",
          jobTitle: "Developer and maker",
          url: "https://deejpotter.com",
          sameAs: [links.github, links.linkedin],
        })}
      </Script>

      {/* Hero: who this is and where to go next. GitHub is the main destination,
          so it gets the primary button; this page is its companion. */}
      <section className="relative isolate overflow-hidden bg-gray-950 px-4 pb-14 pt-10 text-white sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="glow-drift pointer-events-none absolute -left-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="glow-drift pointer-events-none absolute -right-24 top-24 -z-10 [animation-delay:-7s] h-[22rem] w-[22rem] rounded-full bg-info/20 blur-3xl"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Deej Potter · Frankston, VIC
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] sm:text-5xl lg:text-7xl">
              I build web apps, firmware, and{" "}
              <span className="text-gradient">things that move.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
              Former chef, now a developer and maker. I write TypeScript and
              Next.js for the web, C and C++ for ESP32 boards, and Python for AI
              agents, and I self-host most of what I use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
              >
                GitHub
              </a>
              <Link
                href="#projects"
                className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 transition-transform hover:scale-[1.02] hover:bg-white/5"
              >
                See the projects
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <PrintCube />
          </div>
        </div>
      </section>

      {/* Projects as one bento grid; featured ones take the big tiles. */}
      <section id="projects" className="scroll-mt-16 bg-gray-950 px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black text-white">Projects</h2>
          <SpotlightGrid className="mt-6 grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className={
                  project.featured
                    ? "spotlight glow-card flex min-h-64 flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white"
                    : "spotlight glow-card flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 text-white"
                }
              >
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={project.featured ? "text-2xl font-black" : "text-lg font-bold"}>
                      {project.name}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusStyle[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/75">{project.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <ProjectLinks project={project} />
                </div>
              </article>
            ))}
          </SpotlightGrid>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Also on this site</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {onThisSite.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-5 transition-colors hover:border-primary dark:border-gray-800 dark:bg-gray-900"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}{" "}
                    <span aria-hidden="true" className="inline-block text-primary transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <span className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* The site has no contact form. Paid work goes to the business, and
          everything else to GitHub, so the page ends on those two. */}
      <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <Reveal className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">Want something built?</h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/78">
              Websites, custom tools, CAD and 3D printing are handled through my
              business, Lumendot.
            </p>
            <a
              href={links.lumendot}
              className="btn-gradient mt-8 inline-flex items-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.01]"
            >
              Go to Lumendot
            </a>
          </div>
          <div className="lg:pl-10">
            <h2 className="text-3xl font-black">Anything else</h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/78">
              Questions about a project, a bug, or an idea? Open an issue on the
              repo, or find me on GitHub or LinkedIn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                GitHub
              </a>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                LinkedIn
              </a>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                About me
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
