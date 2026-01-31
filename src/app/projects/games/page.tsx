import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

export default function Games(): ReactElement {
  // Define the game projects
  const gameProjects = [
    {
      id: "basic-bases",
      name: "Basic Bases",
      description:
        "A simple but fun WebGL game where you defend your base against waves of enemies. Built with Unity.",
      technologies: ["Unity", "C#", "WebGL"],
      image: "/images/games/basic-bases.jpg", // You might need to add this image
      link: "/projects/games/basic-bases",
    },
    // More games can be added here as they're developed
  ];

  return (
    <>
      <Script id="schema-game-projects" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://deejpotter.com/projects/games/#collection",
            "name": "Game Development Projects",
            "description": "A collection of games developed by Deej Potter.",
            "isPartOf": {
              "@type": "ProfilePage",
              "@id": "https://deejpotter.com/#portfolio"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "name": "Basic Bases",
                  "applicationCategory": "Game",
                  "operatingSystem": "Web Browser",
                  "description": "A simple but fun WebGL game where you defend your base against waves of enemies"
                }
              ]
            }
          }
        `}
      </Script>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Game Development Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            These are games that I&apos;ve designed and developed. Game development allows me to
            combine my programming skills with creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {gameProjects.map((project) => (
            <div
              key={project.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>
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
                <Link
                  href={project.link}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  Play Game
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Game Development Skills
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Game development is a fun way to practice programming skills and explore interactive
              digital experiences. My game development approach includes:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-200">
              <li>Creating engaging gameplay mechanics</li>
              <li>Programming game logic and systems</li>
              <li>Designing user interfaces for intuitive interactions</li>
              <li>Optimizing for performance across devices</li>
              <li>Building WebGL exports for browser-based games</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Have an idea for a game or interactive experience?
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
            >
              Let&apos;s Discuss It
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
