import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Websites(): ReactElement {
  // Define the website project data
  const websiteProjects = [
    {
      id: "deejpotter",
      name: "Deej Potter Portfolio",
      description:
        "My personal portfolio website built with Next.js and React, featuring responsive design and modern UI components.",
      technologies: ["Next.js", "React", "TypeScript", "Bootstrap", "SCSS"],
      image: "/images/deejPotterLogo.svg",
      link: "/projects/websites/deejpotter",
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

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1>Website Development Projects</h1>
            <p className="lead">
              {" "}
              These are websites that I&apos;ve designed and developed. Each
              project demonstrates my skills in frontend development, responsive
              design, accessibility, and user experience.
            </p>
          </div>
        </div>

        <div className="row">
          {websiteProjects.map((project) => (
            <div key={project.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <Image
                      src={project.image}
                      alt={`${project.name} logo`}
                      width={100}
                      height={100}
                      className="img-fluid"
                    />
                  </div>
                  <h2 className="h5 card-title">{project.name}</h2>
                  <p className="card-text">{project.description}</p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="badge bg-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <Link href={project.link} className="btn btn-primary w-100">
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>My Web Development Approach</h2>
            <p>
              When building websites, I focus on creating solutions that are not
              only visually appealing but also functional, accessible, and
              optimized for search engines. My development process includes:
            </p>
            <ul>
              <li>Understanding client requirements and user needs</li>
              <li>Creating responsive designs that work across all devices</li>
              <li>
                Implementing modern frontend technologies (React, Next.js)
              </li>
              <li>Ensuring accessibility compliance</li>
              <li>Optimizing for performance and SEO</li>
              <li>Testing thoroughly across browsers and devices</li>
            </ul>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col text-center">
            <p>Interested in working together on a website project?</p>
            <Link href="/contact" className="btn btn-lg btn-outline-primary">
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
