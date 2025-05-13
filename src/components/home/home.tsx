import { ReactElement } from "react";
import GradientHeroSection from "@/templates/GradientHeroSection/GradientHeroSection";
import BasicSection from "@/templates/BasicSection/BasicSection";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverHeading,
  PopoverDescription,
  PopoverClose,
} from "@/components/Popover";
import { Container } from "react-bootstrap";
import Link from "next/link";
import Script from "next/script";

export default function Home(): ReactElement {
  return (
    <>
      <Script id="schema-person" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://deejpotter.com/#person",
            "name": "Deej Potter",
            "jobTitle": "Web Developer",
            "url": "https://deejpotter.com",
            "sameAs": [
              "https://www.facebook.com/deej.potter.7/",
              "https://www.linkedin.com/in/daniel-potter-5224a4119"
            ]
          }
        `}
      </Script>

      <Script id="schema-portfolio" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": "https://deejpotter.com/#portfolio",
            "about": {
              "@id": "https://deejpotter.com/#person"
            },
            "mainEntity": {
              "@id": "https://deejpotter.com/#person"
            }
          }
        `}
      </Script>

      <GradientHeroSection
        title="Deej Potter"
        subtitle="A passionate web developer creating modern, responsive websites and applications."
        gradientFrom="primary"
        gradientTo="light"
        textColour="dark"
      />

      <BasicSection
        heading="Welcome to My Portfolio"
        paragraph="I'm a web developer focused on creating high-quality, user-friendly websites and applications. With expertise in modern frameworks like React and Next.js, I build solutions that are both beautiful and functional."
        backgroundColour="light"
        textColour="dark"
      />

      <Container className="my-5">
        <div className="row">
          <div className="col-md-6">
            <h2>My Expertise</h2>
            <ul className="list-unstyled">
              <li className="mb-3">
                <strong>Frontend Development</strong>
                <p>
                  Creating responsive, accessible user interfaces with React,
                  TypeScript, and modern CSS.
                </p>
              </li>
              <li className="mb-3">
                <strong>Backend Integration</strong>
                <p>
                  Building APIs and server-side logic that powers web
                  applications.
                </p>
              </li>
              <li className="mb-3">
                <strong>Performance Optimization</strong>
                <p>
                  Ensuring websites load quickly and function smoothly on all
                  devices.
                </p>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <h2>Featured Work</h2>
            <div className="card mb-3">
              <div className="card-body">
                <h3 className="h5">Portfolio Projects</h3>
                <p>
                  Explore my various projects across web development, apps,
                  games, and engineering.
                </p>
                <div className="d-flex gap-2">
                  <Link
                    href="/projects/websites"
                    className="btn btn-sm btn-primary"
                  >
                    Websites
                  </Link>
                  <Link href="/projects/apps" className="btn btn-sm btn-info">
                    Apps
                  </Link>
                  <Link
                    href="/projects/games"
                    className="btn btn-sm btn-success"
                  >
                    Games
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </Container>

      <Container className="mb-4">
        <Popover>
          <PopoverTrigger>Test Popover</PopoverTrigger>
          <PopoverContent className="Popover">
            <PopoverHeading>Test popover heading</PopoverHeading>
            <PopoverDescription>Test popover description</PopoverDescription>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </Popover>
      </Container>
    </>
  );
}
