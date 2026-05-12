import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

const websiteProjects = [
  {
    id: "cnc-tools",
    name: "CNC Tools Application",
    description:
      "A comprehensive technical resource hub with 12+ calculators, tools, and AI assistant for CNC enthusiasts. Features role-based authentication and admin panel.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Clerk", "Bootstrap"],
    image: "/images/deejPotterLogo.svg",
    link: "https://cnctools.deejpotter.com",
    external: true,
  },
  {
    id: "deejpotter",
    name: "Deej Potter Portfolio",
    description:
      "My personal portfolio website built with Next.js and React, featuring responsive design and modern UI components.",
    technologies: ["Next.js", "React", "TypeScript", "Bootstrap", "SCSS"],
    image: "/images/deejPotterLogo.svg",
    link: "/projects/websites/deejpotter",
    external: false,
  },
];

export default function Websites(): ReactElement {
  return (
    <>
      <Script id="schema-website-projects" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://deejpotter.com/projects/websites/#collection",
            "name": "Web Development Projects",
            "description": "A collection of websites designed and developed by Deej Potter.",
            "isPartOf": {
              "@type": "ProfilePage",
              "@id": "https://deejpotter.com/#portfolio"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "item": {
                    "@type": "WebSite",
                    "name": "Deej Potter Portfolio",
                    "url": "https://deejpotter.com/projects/websites/deejpotter",
                    "description": "My personal portfolio website built with Next.js and React"
                  }
                }
              ]
            }
          }
        `}
      </Script>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Websites
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Website Development Projects
          </h1>
          <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
            These are websites that I&apos;ve designed and developed. Each
            project demonstrates my skills in frontend development, responsive
            design, accessibility, and user experience.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {websiteProjects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex justify-center">
                  <Image
                    src={project.image}
                    alt={`${project.name} logo`}
                    width={100}
                    height={100}
                    className="h-auto w-24"
                  />
                </div>
                <h2 className="mb-3 text-2xl font-bold">{project.name}</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  {project.external ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
                    >
                      Visit Site <span className="ml-2">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={project.link}
                      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
                    >
                      View Project
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-900">
            <h2 className="mb-4 text-3xl font-bold">My Web Development Approach</h2>
            <p className="text-gray-600 dark:text-gray-400">
              When building websites, I focus on creating solutions that are not
              only visually appealing but also functional, accessible, and
              optimized for search engines. My development process includes:
            </p>
            <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
              <li>Understanding client requirements and user needs</li>
              <li>Creating responsive designs that work across all devices</li>
              <li>Implementing modern frontend technologies (React, Next.js)</li>
              <li>Ensuring accessibility compliance</li>
              <li>Optimizing for performance and SEO</li>
              <li>Testing thoroughly across browsers and devices</li>
            </ul>
          </div>

          <aside className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-sky-500/10 p-6 shadow-sm dark:border-primary/30">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Interested in working together?
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              If you want a website project with a clear purpose, send a message
              and I&apos;ll help work through the scope and next steps.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] dark:bg-gray-100 dark:text-gray-900"
            >
              Contact me
            </Link>
          </aside>
        </section>
      </div>
    </>
  );
}
