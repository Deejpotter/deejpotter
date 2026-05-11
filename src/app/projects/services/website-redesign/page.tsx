import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const painPoints = [
  "The site looks dated or inconsistent",
  "Content is hard to follow or hard to trust",
  "Calls to action are weak or missing",
  "The mobile experience feels clumsy",
  "The site exists, but does not really help the business",
];

export default function WebsiteRedesignService(): ReactElement {
  return (
    <>
      <Script id="schema-website-redesign-service" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Website Redesign Service",
          provider: {
            "@type": "Person",
            name: "Deej Potter",
            url: "https://deejpotter.com",
          },
          areaServed: "Australia",
          serviceType: "Website redesign",
          url: "https://deejpotter.com/projects/services/website-redesign",
          description:
            "Website redesign service for sites that need clearer structure, better messaging, improved responsiveness, and stronger conversion flow.",
        })}
      </Script>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <p className="text-uppercase text-muted small mb-2">Service</p>
            <h1 className="display-5 mb-3">Website redesign</h1>
            <p className="lead text-muted mb-5">
              Not every site needs to be rebuilt from nothing. Sometimes the
              smarter move is to improve the structure, message, and user
              experience of what is already there.
            </p>

            <div className="row g-4 mb-5">
              <div className="col-lg-6">
                <h2 className="h3 mb-3">Signs a redesign is worth it</h2>
                <ul>
                  {painPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="col-lg-6">
                <div className="card h-100 shadow-sm border-0 bg-light">
                  <div className="card-body">
                    <h2 className="h4 mb-3">Typical redesign goals</h2>
                    <ul className="mb-0">
                      <li>Clearer page structure and hierarchy</li>
                      <li>Stronger calls to action</li>
                      <li>Cleaner visual presentation</li>
                      <li>Better mobile responsiveness</li>
                      <li>Improved SEO basics and internal linking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-5">
              <h2 className="h3 mb-3">What a redesign can focus on</h2>
              <p>
                A redesign can be mostly visual, mostly structural, or more
                conversion-focused. The right scope depends on whether the main
                problem is design, content clarity, technical friction, or weak
                enquiry flow.
              </p>
              <p>
                The point is not to redesign for the sake of change. The point
                is to make the site easier to understand, easier to use, and
                more useful to the people it is meant to serve.
              </p>
            </section>

            <section className="text-center">
              <h2 className="h3 mb-3">Need a second look at an existing site?</h2>
              <p className="text-muted mb-4">
                Send a message with the site link and what feels wrong or underpowered.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Ask about a redesign
                </Link>
                <Link href="/projects/services" className="btn btn-outline-primary btn-lg">
                  View services
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
