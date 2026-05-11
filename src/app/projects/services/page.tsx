import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const services = [
  {
    id: "website-design-development",
    name: "Website Design and Development",
    description:
      "Practical websites, landing pages, portfolio sites, and redesigns built to be clear, responsive, and easy to maintain.",
    features: [
      "Small business websites",
      "Portfolio and personal brand sites",
      "Landing pages and lead-generation pages",
      "Redesigns and technical improvements",
    ],
    link: "/contact",
    cta: "Start a website project",
  },
  {
    id: "custom-tools-automation",
    name: "Custom Tools and Automation",
    description:
      "Purpose-built calculators, internal tools, and workflow helpers for situations where off-the-shelf software is not quite right.",
    features: [
      "Custom calculators",
      "Small internal utilities",
      "Operational workflow helpers",
      "Automation for repetitive digital tasks",
    ],
    link: "/contact",
    cta: "Ask about a custom tool",
  },
  {
    id: "3d-printing",
    name: "3D Printing Service",
    description:
      "Professional 3D printing for hobbyists and small businesses around the Mornington Peninsula, with local delivery in Frankston.",
    features: [
      "Prototype prints",
      "Small-run functional parts",
      "Design assistance",
      "Local delivery options",
    ],
    link: "/projects/services/3d-printing",
    cta: "View 3D printing details",
  },
];

export default function Services(): ReactElement {
  return (
    <>
      <Script id="schema-services-page" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": "https://deejpotter.com/projects/services/#collection",
          name: "Services by Deej Potter",
          description:
            "Website design and development, custom digital tools, automation, and selected technical services.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Service",
                name: service.name,
                description: service.description,
                url: `https://deejpotter.com${service.link}`,
              },
            })),
          },
        })}
      </Script>

      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-lg-10 mx-auto text-center">
            <p className="text-uppercase text-muted small mb-2">Services</p>
            <h1 className="display-5 mb-3">Practical digital work, built properly</h1>
            <p className="lead text-muted mb-0">
              I help with website design and development, custom tools, and
              selected technical projects that need a clear result rather than a
              pile of vague promises.
            </p>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {services.map((service) => (
            <div key={service.id} className="col-12 col-lg-4">
              <div className="card h-100 shadow-sm border-0 bg-light">
                <div className="card-body d-flex flex-column">
                  <h2 className="h4 card-title mb-3">{service.name}</h2>
                  <p className="card-text text-muted">{service.description}</p>
                  <ul className="mt-3 mb-4">
                    {service.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Link href={service.link} className="btn btn-primary w-100">
                      {service.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-7">
            <h2 className="h3 mb-3">How I approach service work</h2>
            <p>
              The goal is not to sell as many disconnected services as possible.
              The goal is to solve the actual problem in front of you - whether
              that is a weak website, a missing workflow tool, or a technical
              process that wastes time.
            </p>
            <p>
              I prefer written communication first because it keeps briefs,
              scope, and next steps clearer. That usually leads to better work
              and less confusion than forcing everything into phone-first calls.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 bg-white">
              <div className="card-body">
                <h2 className="h4 mb-3">Best fit projects</h2>
                <ul className="mb-4">
                  <li>Small business websites</li>
                  <li>Portfolio and personal brand sites</li>
                  <li>Landing pages with clearer calls to action</li>
                  <li>Custom calculators and small internal tools</li>
                  <li>Technical cleanup and iterative improvements</li>
                </ul>
                <Link href="/contact" className="btn btn-outline-primary w-100">
                  Start with a message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
