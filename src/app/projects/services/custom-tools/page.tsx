import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const examples = [
  "Custom calculators for pricing, stock, sizing, or estimates",
  "Internal workflow helpers that remove repetitive admin work",
  "Operational dashboards and technical utility pages",
  "Small automation tools where a full software platform would be overkill",
];

export default function CustomToolsService(): ReactElement {
  return (
    <>
      <Script id="schema-custom-tools-service" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Custom Tools and Automation",
          provider: {
            "@type": "Person",
            name: "Deej Potter",
            url: "https://deejpotter.com",
          },
          areaServed: "Australia",
          serviceType: "Custom tools and automation",
          url: "https://deejpotter.com/projects/services/custom-tools",
          description:
            "Custom calculators, workflow helpers, dashboards, and small automation systems for practical business and operational problems.",
        })}
      </Script>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <p className="text-uppercase text-muted small mb-2">Service</p>
            <h1 className="display-5 mb-3">Custom tools and automation</h1>
            <p className="lead text-muted mb-5">
              Sometimes the real problem is not the website itself - it is the
              repetitive process behind the work. That is where custom tools can
              help.
            </p>

            <section className="mb-5">
              <h2 className="h3 mb-3">What this can include</h2>
              <ul>
                {examples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-5">
              <h2 className="h3 mb-3">When a custom tool makes sense</h2>
              <p>
                A custom tool is often the right choice when there is a small,
                specific problem that keeps costing time, attention, or accuracy
                - but not enough of a problem to justify a giant software system.
              </p>
              <p>
                Good examples include internal calculators, quoting helpers,
                dashboards, admin shortcuts, and workflow tools that remove
                repeated manual steps.
              </p>
            </section>

            <section className="mb-5">
              <div className="card shadow-sm border-0 bg-light">
                <div className="card-body">
                  <h2 className="h4 mb-3">Best starting brief</h2>
                  <p className="mb-0">
                    The clearest way to start is to describe the repetitive task,
                    what is currently painful, and what a better outcome would
                    look like. That is usually enough to tell whether a small
                    custom build is the right move.
                  </p>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="h3 mb-3">Want to talk through a custom tool?</h2>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Start with a message
                </Link>
                <Link href="/projects/tools" className="btn btn-outline-primary btn-lg">
                  View existing tools
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
