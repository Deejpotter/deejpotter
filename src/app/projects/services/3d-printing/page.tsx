import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import QuoteRequestForm from "./QuoteRequestForm";
import QuoteStatusLookup from "./QuoteStatusLookup";

const benefits = [
  {
    title: "On-demand printing",
    body: "Print parts as needed instead of carrying stock you may not use. A good fit for prototypes, replacements, hobby projects, and small-run functional parts.",
  },
  {
    title: "Next-day local turnaround when viable",
    body: "For nearby customers and manageable files, next-day turnaround can be offered when print time and finishing requirements make it realistic.",
  },
  {
    title: "Local-first service",
    body: "A practical option for customers in Frankston and the broader Mornington Peninsula who want a local person to handle the job rather than sending it into a faceless queue.",
  },
  {
    title: "Clear quoting path",
    body: "The goal is to move toward an STL upload workflow with fast quoting, so customers can get pricing before paying and only print what they actually need.",
  },
];

const useCases = [
  "Prototype parts",
  "Replacement brackets and small functional parts",
  "Hobby and maker projects",
  "Small-run custom pieces",
  "Test-fit parts before committing to larger production",
];

const quoteFactors = [
  "File size and print time",
  "Material required",
  "Part dimensions and quantity",
  "Whether the job needs support cleanup or extra finishing",
  "Delivery or pickup requirements",
];

const nextSteps = [
  "Upload the STL or other supported model file.",
  "Confirm location if you want to ask about next-day local turnaround.",
  "Get a quote based on print time, material, and handling.",
  "Approve the job and have it printed on demand.",
];

export default function ThreeDPrintingService(): ReactElement {
  return (
    <>
      <Script id="schema-3d-printing-service" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "3D Printing Service",
          provider: {
            "@type": "Person",
            name: "Deej Potter",
            url: "https://deejpotter.com",
          },
          areaServed: ["Frankston", "Mornington Peninsula", "Australia"],
          serviceType: "On-demand 3D printing",
          url: "https://deejpotter.com/projects/services/3d-printing",
          description:
            "On-demand 3D printing with local service in Frankston and the Mornington Peninsula, including viable next-day turnaround for nearby customers and manageable files.",
        })}
      </Script>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <p className="text-uppercase text-muted small mb-2">Service</p>
            <h1 className="display-5 mb-3">On-demand 3D printing</h1>
            <p className="lead text-muted mb-5">
              Practical 3D printing for prototypes, replacement parts, hobby
              projects, and small-run functional pieces - with local-first
              service around Frankston and the Mornington Peninsula.
            </p>

            <section className="mb-5">
              <div className="row g-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 bg-light">
                      <div className="card-body">
                        <h2 className="h4 mb-3">{benefit.title}</h2>
                        <p className="mb-0 text-muted">{benefit.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <div className="row g-4 align-items-start">
                <div className="col-lg-6">
                  <h2 className="h3 mb-3">Good fit for</h2>
                  <ul>
                    {useCases.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-lg-6">
                  <div className="card shadow-sm border-0 bg-white">
                    <div className="card-body">
                      <h2 className="h4 mb-3">How quoting works</h2>
                      <p className="text-muted">
                        The upload form below can now give a preliminary STL-based
                        preflight estimate, but final quotes still need to account for
                        a few practical variables before pricing is locked in:
                      </p>
                      <ul className="mb-0">
                        {quoteFactors.map((factor) => (
                          <li key={factor}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-5">
              <h2 className="h3 mb-3">Next-day local turnaround</h2>
              <p>
                Next-day turnaround is something worth offering, but only when
                it is genuinely realistic. That normally means the customer is
                local, the file is not excessively large, and the print can be
                completed without blowing out into a multi-day job or heavy
                post-processing.
              </p>
              <p>
                In other words: yes, this can be a strong offer - but it should
                be presented as available <strong>where viable</strong>, not as
                an unconditional promise.
              </p>
            </section>

            <section className="mb-5">
              <h2 className="h3 mb-3">Best customer flow</h2>
              <div className="row g-3">
                {nextSteps.map((step, index) => (
                  <div key={step} className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 bg-light">
                      <div className="card-body">
                        <p className="text-uppercase text-muted small mb-2">Step {index + 1}</p>
                        <p className="mb-0">{step}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <QuoteRequestForm />
            </section>

            <section className="mb-5">
              <QuoteStatusLookup />
            </section>

            <section className="mb-5">
              <div className="alert alert-info mb-0">
                <h2 className="h4 mb-2">Automatic preflight now available for STL files</h2>
                <p className="mb-0">
                  STL uploads can now return a rough starting estimate based on file
                  geometry, quantity, and material choice. It is still a preliminary
                  figure rather than a locked quote, but it gives customers a much
                  better sense of cost and scale before manual review.
                </p>
              </div>
            </section>

            <section className="text-center">
              <h2 className="h3 mb-3">Need something custom instead?</h2>
              <p className="text-muted mb-4">
                If the job needs more than straightforward printing, start with a
                message and include the file, dimensions, quantity, and whether
                you are local and hoping for fast turnaround.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/contact" className="btn btn-outline-primary btn-lg">
                  General enquiry
                </Link>
                <Link href="/projects/services" className="btn btn-outline-secondary btn-lg">
                  View all services
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
