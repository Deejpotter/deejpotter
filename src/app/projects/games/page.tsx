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

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1>Game Development Projects</h1>
            <p className="lead">
              These are games that I&apos;ve designed and developed. Game
              development allows me to combine my programming skills with
              creativity.
            </p>
          </div>
        </div>

        <div className="row">
          {gameProjects.map((project) => (
            <div key={project.id} className="col-12 col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h2 className="h5 card-title">{project.name}</h2>
                  <p className="card-text">{project.description}</p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="badge bg-success">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <Link href={project.link} className="btn btn-success w-100">
                    Play Game
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>Game Development Skills</h2>
            <p>
              Game development is a fun way to practice programming skills and
              explore interactive digital experiences. My game development
              approach includes:
            </p>
            <ul>
              <li>Creating engaging gameplay mechanics</li>
              <li>Programming game logic and systems</li>
              <li>Designing user interfaces for intuitive interactions</li>
              <li>Optimizing for performance across devices</li>
              <li>Building WebGL exports for browser-based games</li>
            </ul>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col text-center">
            <p>Have an idea for a game or interactive experience?</p>
            <Link href="/contact" className="btn btn-lg btn-outline-success">
              Let&apos;s Discuss It
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
