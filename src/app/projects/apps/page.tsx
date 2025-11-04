import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Apps(): ReactElement {
  // Define the app project data
  const appProjects = [
    {
      id: "todo-app",
      name: "Todo List Application",
      description:
        "Full-featured task management app with CRUD operations, user authentication, and MongoDB backend. Demonstrates modern React patterns and API integration.",
      technologies: [
        "React",
        "TypeScript",
        "MongoDB",
        "Netlify Functions",
        "REST API",
      ],
      image: "/images/deejPotterLogo.svg",
      link: "/projects/apps/todo-app",
      external: false,
    },
    {
      id: "cnc-mini-apps",
      name: "CNC Tools Mini-Apps",
      description:
        "Collection of 12+ specialized calculators and tools for CNC machining, including box shipping calculator, feed rate calculator, and technical AI assistant.",
      technologies: [
        "Next.js",
        "TypeScript",
        "React",
        "Algorithm Design",
        "OpenAI",
      ],
      image: "/images/deejPotterLogo.svg",
      link: "https://cnctools.deejpotter.com",
      external: true,
    },
  ];

  return (
    <>
      <Script id="schema-app-projects" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://deejpotter.com/projects/apps/#collection",
            "name": "Technical Application Projects",
            "description": "A collection of technical applications and interactive tools developed by Deej Potter.",
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
                    "name": "Todo List Application",
                    "url": "https://deejpotter.com/projects/apps/todo-app",
                    "description": "Full-featured task management app with MongoDB backend"
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
            <h1>Technical Applications</h1>
            <p className="lead">
              These are interactive web applications that demonstrate dynamic
              functionality, API integration, and full-stack development
              capabilities. Each app solves specific problems with clean code
              and user-focused design.
            </p>
          </div>
        </div>

        <div className="row">
          {appProjects.map((project) => (
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
                  {project.external ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-100"
                    >
                      Visit App{" "}
                      <span className="bi bi-box-arrow-up-right ms-1"></span>
                    </a>
                  ) : (
                    <Link href={project.link} className="btn btn-primary w-100">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>Application Development Approach</h2>
            <p>
              When building web applications, I focus on creating intuitive
              interfaces backed by robust functionality. My development process
              emphasizes:
            </p>
            <ul>
              <li>
                <strong>User-centered design:</strong> Understanding workflows
                and pain points
              </li>
              <li>
                <strong>Clean architecture:</strong> Separation of concerns,
                modular components
              </li>
              <li>
                <strong>Type safety:</strong> TypeScript throughout for fewer
                runtime errors
              </li>
              <li>
                <strong>API design:</strong> RESTful endpoints with proper
                error handling
              </li>
              <li>
                <strong>State management:</strong> React hooks, context, and
                efficient updates
              </li>
              <li>
                <strong>Performance:</strong> Code splitting, lazy loading,
                optimized renders
              </li>
              <li>
                <strong>Testing:</strong> Unit tests, integration tests, manual
                QA
              </li>
              <li>
                <strong>Documentation:</strong> Code comments, API docs, user
                guides
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>Technology Stack</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="h5 card-title">Frontend</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>React:</strong> Component-based UI with hooks
                      </li>
                      <li>
                        <strong>Next.js:</strong> Server-side rendering and
                        static generation
                      </li>
                      <li>
                        <strong>TypeScript:</strong> Type-safe development
                      </li>
                      <li>
                        <strong>Bootstrap:</strong> Responsive design framework
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="h5 card-title">Backend & APIs</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>Next.js API Routes:</strong> Serverless
                        functions
                      </li>
                      <li>
                        <strong>MongoDB:</strong> Document database for
                        flexible data
                      </li>
                      <li>
                        <strong>Clerk:</strong> User authentication and
                        management
                      </li>
                      <li>
                        <strong>OpenAI API:</strong> AI-powered features
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>Featured Application: CNC Tools</h2>
            <p>
              The CNC Tools application is my most comprehensive project,
              featuring 12+ specialized calculators and tools. Highlights
              include:
            </p>
            <ul>
              <li>
                <strong>Box Shipping Calculator:</strong> 3D bin packing
                algorithm to optimize package layouts
              </li>
              <li>
                <strong>CNC Technical AI:</strong> GPT-4 powered assistant with
                real-time streaming
              </li>
              <li>
                <strong>Feed Rate Calculator:</strong> Precision CNC machining
                calculations
              </li>
              <li>
                <strong>Role-Based Access:</strong> Admin panel with user
                management and permissions
              </li>
              <li>
                <strong>Responsive Design:</strong> Works on desktop, tablet,
                and mobile devices
              </li>
            </ul>
            <a
              href="https://cnctools.deejpotter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Visit CNC Tools{" "}
              <span className="bi bi-box-arrow-up-right ms-1"></span>
            </a>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col text-center">
            <p>Need a custom application or tool built?</p>
            <Link href="/contact" className="btn btn-lg btn-outline-primary">
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
