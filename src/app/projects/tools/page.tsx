import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Tools(): ReactElement {
  // Define the tools project data
  const toolProjects = [
    {
      id: "20-series-cut-calculator",
      name: "20 Series Aluminum Extrusion Cut Calculator",
      description:
        "Advanced cut optimization calculator supporting multiple stock lengths with quantity tracking. Uses Best Fit Decreasing algorithm and accounts for blade kerf (4mm) to minimize material waste.",
      technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
      image: "/images/deejPotterLogo.svg",
      link: "/projects/tools/20-series-cut-calculator",
      external: false,
      features: [
        "Multiple stock length support",
        "Stock quantity tracking",
        "4mm kerf consideration",
        "Best Fit Decreasing algorithm",
        "Visual cut pattern display",
      ],
    },
    // Note: You can add more tool projects here as they are developed
  ];

  return (
    <>
      <Script id="schema-tool-projects" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://deejpotter.com/projects/tools/#collection",
            "name": "Development Tools & Calculators",
            "description": "A collection of calculators and tools developed by Deej Potter for engineering and manufacturing applications.",
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
                    "@type": "SoftwareApplication",
                    "name": "20 Series Aluminum Extrusion Cut Calculator",
                    "url": "https://deejpotter.com/projects/tools/20-series-cut-calculator",
                    "description": "Advanced cut optimization calculator with multi-stock support and kerf consideration",
                    "applicationCategory": "EngineeringApplication"
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
            Engineering Tools &amp; Calculators
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A collection of engineering and manufacturing tools I&apos;ve built to solve
            practical problems. Many of these originated from my CNC tooling and fabrication work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolProjects.map((project) => (
            <div
              key={project.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex justify-center">
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={80}
                    height={80}
                    className="h-16 w-16 rounded-lg object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                </div>

                {project.features && (
                  <div className="space-y-2">
                    <h6 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Key Features
                    </h6>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-200">
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <h6 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Technologies
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
                {project.external ? (
                  <a
                    href={project.link}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Tool <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link
                    href={project.link}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    Use Tool
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h5 className="text-lg font-semibold">More Tools Coming Soon</h5>
              <p className="text-sm text-emerald-900/80 dark:text-emerald-100">
                I&apos;m continuously developing new tools and calculators for engineering and manufacturing applications. Check back regularly for updates.
              </p>
            </div>
            <a
              href="https://cnctools.deejpotter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Visit CNC Tools
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
