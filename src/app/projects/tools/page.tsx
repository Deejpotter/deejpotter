import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Tools(): ReactElement {
  const toolProjects = [
    {
      id: "20-series-cut-calculator",
      name: "20 Series Aluminum Extrusion Cut Calculator",
      description:
        "Advanced cut optimization calculator supporting multiple stock lengths with quantity tracking. Uses Best Fit Decreasing algorithm and accounts for blade kerf (4mm) to minimize material waste.",
      technologies: ["Next.js", "TypeScript", "React", "Bootstrap"],
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
                    "applicationCategory": "UtilitiesApplication",
                    "operatingSystem": "Web Browser"
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
            Tools
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Tools & Calculators
          </h1>
          <p className="max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Engineering and manufacturing tools I&apos;ve developed to solve
            practical problems. Each tool demonstrates algorithm design,
            optimization techniques, and user-focused interface design.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {toolProjects.map((project) => (
            <article key={project.id} className="rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex justify-center">
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={80}
                    height={80}
                    className="h-auto w-20 rounded"
                  />
                </div>
                <h2 className="mb-3 text-2xl font-bold">{project.name}</h2>
                <p className="mb-4 flex-grow text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>

                {project.features && (
                  <div className="mb-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950/40">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Key features
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  {project.external ? (
                    <a
                      href={project.link}
                      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Tool <span className="ml-2">↗</span>
                    </a>
                  ) : (
                    <Link href={project.link} className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                      Use Tool <span className="ml-2">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-6 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/30">
          <h2 className="mb-2 text-2xl font-bold">
            More tools coming soon
          </h2>
          <p className="mb-0 text-gray-700 dark:text-gray-300">
            I&apos;m continuously developing new tools and calculators for
            engineering and manufacturing applications. Check back regularly
            for updates, or visit{" "}
            <a
              href="https://cnctools.deejpotter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              CNC Tools
            </a>{" "}
            for a comprehensive collection of CNC-specific calculators and
            resources.
          </p>
        </section>
      </div>
    </>
  );
}
