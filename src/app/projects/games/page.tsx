import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

export default function Games(): ReactElement {
  const gameProjects = [
    {
      id: "basic-bases",
      name: "Basic Bases",
      description:
        "A simple but fun WebGL game where you defend your base against waves of enemies. Built with Unity.",
      technologies: ["Unity", "C#", "WebGL"],
      image: "/images/games/basic-bases.jpg",
      link: "/projects/games/basic-bases",
    },
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Games
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Game Development Projects
          </h1>
          <p className="max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            These are games that I&apos;ve designed and developed. Game
            development allows me to combine my programming skills with
            creativity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {gameProjects.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary dark:bg-primary/20 dark:text-white">
                    🎮
                  </div>
                </div>
                <h2 className="mb-3 text-2xl font-bold">{project.name}</h2>
                <p className="mb-4 flex-grow text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <Link href={project.link} className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                    Play Game
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-3xl font-bold">Game Development Skills</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Game development is a fun way to practice programming skills and
              explore interactive digital experiences. My game development
              approach includes:
            </p>
            <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" /><span>Creating engaging gameplay mechanics</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" /><span>Programming game logic and systems</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" /><span>Designing user interfaces for intuitive interactions</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" /><span>Optimizing for performance across devices</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-emerald-600" /><span>Building WebGL exports for browser-based games</span></li>
            </ul>
          </div>

          <aside className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-100">
              Want something custom?
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Have an idea for a game or interactive experience? Send a brief
              message and we can talk through the concept.
            </p>
            <Link href="/contact" className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
              Let&apos;s discuss it
            </Link>
          </aside>
        </section>
      </div>
    </>
  );
}
