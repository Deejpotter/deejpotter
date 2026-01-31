import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Websites(): ReactElement {
  // Define the website project data
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
    // Note: You can add more website projects here as they are developed
  ];

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

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Website Development Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            These are websites that I&apos;ve designed and developed. Each project
            demonstrates my skills in frontend development, responsive design,
            accessibility, and user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {websiteProjects.map((project) => (
            <div
              key={project.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex justify-center">
                  <Image
                    src={project.image}
                    alt={`${project.name} logo`}
                    width={100}
                    height={100}
                    className="h-20 w-20 object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                {project.external ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    Visit Site
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link
                    href={project.link}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    View Project
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              My Web Development Approach
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              When building websites, I focus on creating solutions that are not only visually
              appealing but also functional, accessible, and optimized for search engines.
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-200">
              <li>Understanding client requirements and user needs</li>
              <li>Creating responsive designs that work across all devices</li>
              <li>Implementing modern frontend technologies (React, Next.js)</li>
              <li>Ensuring accessibility compliance</li>
              <li>Optimizing for performance and SEO</li>
              <li>Testing thoroughly across browsers and devices</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Interested in working together on a website project?
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
