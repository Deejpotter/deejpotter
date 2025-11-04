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
      technologies: [
        "ESP32",
        "C++",
        "Arduino",
        "PWM",
        "PID Control",
        "Wi-Fi",
      ],
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

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1>Engineering & Hardware Projects</h1>
            <p className="lead">
              These are hardware and embedded systems projects that combine
              electronics, programming, and mechanical engineering. From
              wireless robotics to CNC control systems, each project explores
              different aspects of embedded development and precision control.
            </p>
          </div>
        </div>

        <div className="row">
          {engineeringProjects.map((project) => (
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
                  <div className="d-flex gap-2">
                    {project.external ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary flex-grow-1"
                      >
                        View Project{" "}
                        <span className="bi bi-box-arrow-up-right ms-1"></span>
                      </a>
                    ) : (
                      <Link
                        href={project.link}
                        className="btn btn-primary flex-grow-1"
                      >
                        View Details
                      </Link>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary"
                        aria-label="View on GitHub"
                      >
                        <span className="bi bi-github"></span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>My Engineering Approach</h2>
            <p>
              When building hardware projects, I focus on practical solutions
              that combine robust software with reliable hardware. My
              development process includes:
            </p>
            <ul>
              <li>
                <strong>Understanding requirements:</strong> Define the problem
                and constraints before selecting components
              </li>
              <li>
                <strong>Prototyping:</strong> Breadboard circuits, test
                assumptions, iterate quickly
              </li>
              <li>
                <strong>Embedded programming:</strong> Efficient C/C++ code
                optimized for microcontrollers
              </li>
              <li>
                <strong>Real-time systems:</strong> Interrupt handling, timing
                constraints, resource management
              </li>
              <li>
                <strong>Sensor integration:</strong> Encoders, IMUs,
                ultrasonic, temperature, etc.
              </li>
              <li>
                <strong>Communication protocols:</strong> UART, I2C, SPI,
                Wi-Fi, Bluetooth
              </li>
              <li>
                <strong>Testing & debugging:</strong> Oscilloscope, logic
                analyzer, serial debugging
              </li>
              <li>
                <strong>Documentation:</strong> Circuit diagrams, pin
                assignments, API documentation
              </li>
            </ul>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>Technologies & Tools</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="h5 card-title">Microcontrollers</h3>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <strong>ESP32:</strong> Wi-Fi/Bluetooth, dual-core,
                        240MHz
                      </li>
                      <li>
                        <strong>Arduino:</strong> AVR, Due, Mega for various
                        projects
                      </li>
                      <li>
                        <strong>Raspberry Pi:</strong> Linux-based embedded
                        computing
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="h5 card-title">Development Tools</h3>
                    <ul className="list-unstyled mb-0">
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
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h2>3D Printing Services</h2>
            <p>
              Looking for custom 3D printed parts for your project? I offer 3D
              printing services for prototypes, enclosures, and custom
              mechanical components.
            </p>
            <Link
              href="/projects/services/3d-printing"
              className="btn btn-outline-primary"
            >
              Learn About 3D Printing Services
            </Link>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col text-center">
            <p>
              Interested in collaborating on an engineering or embedded systems
              project?
            </p>
            <Link href="/contact" className="btn btn-lg btn-outline-primary">
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
