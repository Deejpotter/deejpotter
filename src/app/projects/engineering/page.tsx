import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Engineering(): ReactElement {
  // Define the engineering project data
  const engineeringProjects = [
    {
      id: "wireless-car",
      name: "ESP32 Wireless Car",
      description:
        "Precision-controlled wireless RC car with dual motor control, encoder feedback, and PID speed control. Features Wi-Fi web interface for real-time monitoring and control.",
      technologies: ["ESP32", "C++", "Arduino", "PWM", "PID Control", "Wi-Fi"],
      image: "/images/deejPotterLogo.svg",
      link: "/projects/engineering/wireless-car",
      external: false,
      github: "https://github.com/Deejpotter/esp32-wireless-car",
    },
    {
      id: "cyd-controller",
      name: "CYD Wireless Controller",
      description:
        "ESP32 display-based controller for wireless car. Features touch interface and real-time telemetry display using LVGL graphics library.",
      technologies: ["ESP32", "C++", "LVGL", "Touch Display", "Bluetooth"],
      image: "/images/deejPotterLogo.svg",
      link: "https://github.com/Deejpotter/cyd-wireless-controller",
      external: true,
      github: "https://github.com/Deejpotter/cyd-wireless-controller",
    },
    {
      id: "drawbot",
      name: "Simple Drawbot Software",
      description:
        "G-code generator for pen plotters and CNC drawing machines. Converts SVG paths to G-code with customizable settings for precision positioning.",
      technologies: ["Python", "G-code", "SVG", "CNC", "Kinematics"],
      image: "/images/deejPotterLogo.svg",
      link: "https://github.com/Deejpotter/simple-drawbot-software",
      external: true,
      github: "https://github.com/Deejpotter/simple-drawbot-software",
    },
  ];

  return (
    <>
      <Script id="schema-engineering-projects" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://deejpotter.com/projects/engineering/#collection",
            "name": "Engineering & Hardware Projects",
            "description": "A collection of engineering and embedded systems projects by Deej Potter.",
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
                    "@type": "CreativeWork",
                    "name": "ESP32 Wireless Car",
                    "url": "https://deejpotter.com/projects/engineering/wireless-car",
                    "description": "Precision-controlled wireless RC car with encoder feedback and PID control"
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
            Engineering &amp; Hardware Projects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Hardware and embedded systems projects that combine electronics, programming, and mechanical
            engineering. From wireless robotics to CNC control systems, each project explores a different
            facet of embedded development and precision control.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {engineeringProjects.map((project) => (
            <div
              key={project.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
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
                <div className="flex gap-2">
                  {project.external ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                    >
                      View Project <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={project.link}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                    >
                      View Details
                    </Link>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                      aria-label="View on GitHub"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">My Engineering Approach</h2>
            <p className="text-gray-700 dark:text-gray-200">
              I focus on practical solutions that combine robust software with reliable hardware. The process
              I follow includes:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-200">
              <li>
                <strong>Understanding requirements:</strong> Define the problem and constraints before
                selecting components
              </li>
              <li>
                <strong>Prototyping:</strong> Breadboard circuits, test assumptions, iterate quickly
              </li>
              <li>
                <strong>Embedded programming:</strong> Efficient C/C++ code optimized for microcontrollers
              </li>
              <li>
                <strong>Real-time systems:</strong> Interrupt handling, timing constraints, resource
                management
              </li>
              <li>
                <strong>Sensor integration:</strong> Encoders, IMUs, ultrasonic, temperature, etc.
              </li>
              <li>
                <strong>Communication protocols:</strong> UART, I2C, SPI, Wi-Fi, Bluetooth
              </li>
              <li>
                <strong>Testing &amp; debugging:</strong> Oscilloscope, logic analyzer, serial debugging
              </li>
              <li>
                <strong>Documentation:</strong> Circuit diagrams, pin assignments, API documentation
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Technologies &amp; Tools</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Microcontrollers</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <strong>ESP32:</strong> Wi-Fi/Bluetooth, dual-core, 240MHz
                  </li>
                  <li>
                    <strong>Arduino:</strong> AVR, Due, Mega for various projects
                  </li>
                  <li>
                    <strong>Raspberry Pi:</strong> Linux-based embedded computing
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Development Tools</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <strong>PlatformIO:</strong> Cross-platform embedded IDE
                  </li>
                  <li>
                    <strong>Arduino IDE:</strong> Quick prototyping
                  </li>
                  <li>
                    <strong>KiCad:</strong> PCB design and schematics
                  </li>
                  <li>
                    <strong>Fusion 360:</strong> 3D modeling for enclosures
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">3D Printing Services</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              Looking for custom 3D printed parts for your project? I offer 3D printing services for
              prototypes, enclosures, and custom mechanical components.
            </p>
            <Link
              href="/projects/services/3d-printing"
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
            >
              Learn About 3D Printing Services
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Collaborate</h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              Interested in collaborating on an engineering or embedded systems project?
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:border-emerald-400 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
