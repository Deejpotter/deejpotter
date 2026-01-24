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

      <section className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
          Technical Applications
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          These are interactive web applications that demonstrate dynamic
          functionality, API integration, and full-stack development
          capabilities. Each app solves specific problems with clean code and
          user-focused design.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        {appProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="p-6 flex-grow">
              <div className="text-center mb-4">
                <Image
                  src={project.image}
                  alt={`${project.name} logo`}
                  width={80}
                  height={80}
                  className="inline-block"
                />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">
                {project.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center my-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold inline-block py-1 px-3 uppercase rounded-full text-white bg-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 pt-0 bg-gray-50 dark:bg-gray-700">
              {project.external ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-full transition-transform hover:scale-105"
                >
                  Visit App <i className="bi bi-box-arrow-up-right ml-2"></i>
                </a>
              ) : (
                <Link
                  href={project.link}
                  className="block w-full text-center bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-4 rounded-full transition-transform hover:scale-105"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4">
          Application Development Approach
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          When building web applications, I focus on creating intuitive
          interfaces backed by robust functionality. My development process
          emphasizes:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>User-centered design:</strong> Understanding workflows and
            pain points
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
            <strong>API design:</strong> RESTful endpoints with proper error
            handling
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
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Frontend</h3>
            <ul className="list-none space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>React:</strong> Component-based UI with hooks
              </li>
              <li>
                <strong>Next.js:</strong> Server-side rendering and static
                generation
              </li>
              <li>
                <strong>TypeScript:</strong> Type-safe development
              </li>
              <li>
                <strong>Tailwind CSS:</strong> Utility-first styling
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Backend</h3>
            <ul className="list-none space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <strong>Node.js:</strong> JavaScript runtime for server-side
                code
              </li>
              <li>
                <strong>Netlify Functions:</strong> Serverless API
                endpoints
              </li>
              <li>
                <strong>MongoDB:</strong> NoSQL database for flexible data
                storage
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
