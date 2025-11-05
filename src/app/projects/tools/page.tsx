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
                    "applicationCategory": "UtilitiesApplication",
                    "operatingSystem": "Web Browser"
                  }
                }
              ]
            }
          }
        `}
      </Script>

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1>Tools & Calculators</h1>
            <p className="lead">
              Engineering and manufacturing tools I&apos;ve developed to solve
              practical problems. Each tool demonstrates algorithm design,
              optimization techniques, and user-focused interface design.
            </p>
          </div>
        </div>

        <div className="row">
          {toolProjects.map((project) => (
            <div key={project.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <Image
                      src={project.image}
                      alt={project.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                  </div>
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text flex-grow-1">
                    {project.description}
                  </p>

                  {project.features && (
                    <div className="mb-3">
                      <h6 className="text-muted small mb-2">Key Features:</h6>
                      <ul className="small mb-0">
                        {project.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-3">
                    <h6 className="text-muted small mb-2">Technologies:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="badge bg-secondary bg-opacity-10 text-dark"
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
                        className="btn btn-primary w-100"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Tool{" "}
                        <i className="bi bi-box-arrow-up-right ms-1"></i>
                      </a>
                    ) : (
                      <Link
                        href={project.link}
                        className="btn btn-primary w-100"
                      >
                        Use Tool <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col">
            <div className="alert alert-info">
              <h5 className="alert-heading">
                <i className="bi bi-info-circle me-2"></i>More Tools Coming
                Soon
              </h5>
              <p className="mb-0">
                I&apos;m continuously developing new tools and calculators for
                engineering and manufacturing applications. Check back regularly
                for updates, or visit{" "}
                <a
                  href="https://cnctools.deejpotter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="alert-link"
                >
                  CNC Tools
                </a>{" "}
                for a comprehensive collection of CNC-specific calculators and
                resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
