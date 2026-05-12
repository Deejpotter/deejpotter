import { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function Engineering(): ReactElement {
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Engineering
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Engineering & Hardware Projects
          </h1>
          <p className="max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            These are hardware and embedded systems projects that combine
            electronics, programming, and mechanical engineering. From wireless
            robotics to CNC control systems, each project explores different
            aspects of embedded development and precision control.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {engineeringProjects.map((project) => (
            <article key={project.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex justify-center">
                  <Image
                    src={project.image}
                    alt={`${project.name} logo`}
                    width={100}
                    height={100}
                    className="h-auto w-24"
                  />
                </div>
                <h2 className="mb-3 text-2xl font-bold">{project.name}</h2>
                <p className="mb-4 flex-grow text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20 dark:text-white">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex gap-2">
                  {project.external ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
                    >
                      View Project <span className="ml-2">↗</span>
                    </a>
                  ) : (
                    <Link href={project.link} className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                      View Details
                    </Link>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-gray-700 transition-transform hover:scale-[1.02] dark:border-gray-700 dark:text-gray-200"
                      aria-label="View on GitHub"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-3xl font-bold">My Engineering Approach</h2>
            <p className="text-gray-700 dark:text-gray-300">
              When building hardware projects, I focus on practical solutions
              that combine robust software with reliable hardware. My
              development process includes:
            </p>
            <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Understanding requirements:</strong> Define the problem and constraints before selecting components</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Prototyping:</strong> Breadboard circuits, test assumptions, iterate quickly</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Embedded programming:</strong> Efficient C/C++ code optimized for microcontrollers</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Real-time systems:</strong> Interrupt handling, timing constraints, resource management</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Sensor integration:</strong> Encoders, IMUs, ultrasonic, temperature, etc.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Communication protocols:</strong> UART, I2C, SPI, Wi-Fi, Bluetooth</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Testing & debugging:</strong> Oscilloscope, logic analyzer, serial debugging</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span><strong>Documentation:</strong> Circuit diagrams, pin assignments, API documentation</span></li>
            </ul>
          </div>

          <aside className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-sky-500/10 p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Technologies &amp; Tools</h2>
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-gray-950/40">
                <h3 className="mb-2 text-lg font-semibold">Microcontrollers</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li><strong>ESP32:</strong> Wi-Fi/Bluetooth, dual-core, 240MHz</li>
                  <li><strong>Arduino:</strong> AVR, Due, Mega for various projects</li>
                  <li><strong>Raspberry Pi:</strong> Linux-based embedded computing</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 shadow-sm dark:bg-gray-950/40">
                <h3 className="mb-2 text-lg font-semibold">Development Tools</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li><strong>PlatformIO:</strong> Cross-platform embedded IDE</li>
                  <li><strong>Arduino IDE:</strong> Quick prototyping</li>
                  <li><strong>KiCad:</strong> PCB design and schematics</li>
                  <li><strong>Fusion 360:</strong> 3D modeling for enclosures</li>
                </ul>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 text-3xl font-bold">3D Printing Services</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Looking for custom 3D printed parts for your project? I offer 3D
              printing services for prototypes, enclosures, and custom
              mechanical components.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/projects/services/3d-printing" className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                Learn about 3D printing services
              </Link>
              <Link href="/contact" className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white">
                Contact me
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-3 text-3xl font-bold">Open to collaboration</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Interested in collaborating on an engineering or embedded systems
              project? I&apos;m happy to start with a brief written summary of the
              problem, the constraints, and what success should look like.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
