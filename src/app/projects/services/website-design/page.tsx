import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const deliverables = [
  "Small business websites",
  "Portfolio and personal brand sites",
  "Landing pages focused on enquiries or bookings",
  "Content and layout improvements for existing websites",
  "Responsive frontends that work cleanly across devices",
];

const process = [
  "Clarify the goal, audience, and primary action the site needs to drive.",
  "Plan structure, messaging, and pages so the site is easy to navigate.",
  "Build or improve the frontend with performance, responsiveness, and maintainability in mind.",
  "Refine calls to action, contact flow, and content so the site is easier to use and easier to trust.",
];

const faqs = [
  {
    question: "What kinds of website projects are the best fit?",
    answer:
      "Small business websites, portfolio sites, landing pages, and practical redesigns are the strongest fit. The work tends to go best when the goal is clear and the site needs to do a real job.",
  },
  {
    question: "Do I need to start with a phone call?",
    answer:
      "No. Written communication is the preferred starting point. A short message or brief usually makes the first steps clearer and more efficient.",
  },
  {
    question: "Can you improve an existing website instead of rebuilding from scratch?",
    answer:
      "Yes. Some projects need a full rebuild, but many benefit more from targeted improvement to structure, design, content, performance, or conversion paths.",
  },
];

export default function WebsiteDesignService(): ReactElement {
  return (
    <>
      <Script id="schema-website-design-service" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Website Design and Development",
          provider: {
            "@type": "Person",
            name: "Deej Potter",
            url: "https://deejpotter.com",
          },
          areaServed: "Australia",
          serviceType: "Website design and development",
          url: "https://deejpotter.com/projects/services/website-design",
          description:
            "Website design and development for small businesses, portfolio sites, landing pages, and practical website improvements.",
          mainEntityOfPage: "https://deejpotter.com/projects/services/website-design",
          faqPage: {
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        })}
      </Script>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <p className="text-uppercase text-muted small mb-2">Service</p>
            <h1 className="display-5 mb-3">Website design and development</h1>
            <p className="lead text-muted mb-5">
              Practical websites for businesses, brands, and projects that need
              to look clear, work properly, and make it easy for people to take
              the next step.
            </p>

            <div className="row g-4 mb-5">
              <div className="col-lg-7">
                <h2 className="h3 mb-3">What this service is for</h2>
                <p>
                  This is the right fit when you need a website that does a real
                  job - explaining what you offer, building trust, attracting
                  enquiries, or presenting your work more clearly.
                </p>
                <p>
                  Some projects start from scratch. Others are already online but
                  need a stronger structure, better messaging, cleaner design, or
                  a more usable contact flow. Both are valid.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="card h-100 shadow-sm border-0 bg-light">
                  <div className="card-body">
                    <h2 className="h4 mb-3">Typical deliverables</h2>
                    <ul className="mb-0">
                      {deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-5">
              <h2 className="h3 mb-3">How I approach website work</h2>
              <div className="row g-3">
                {process.map((step, index) => (
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
              <h2 className="h3 mb-3">Frequently asked questions</h2>
              <div className="accordion" id="website-service-faq">
                {faqs.map((faq, index) => (
                  <div key={faq.question} className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className={`accordion-button ${index === 0 ? "" : "collapsed"}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#website-service-faq-${index}`}
                        aria-expanded={index === 0 ? "true" : "false"}
                        aria-controls={`website-service-faq-${index}`}
                      >
                        {faq.question}
                      </button>
                    </h3>
                    <div
                      id={`website-service-faq-${index}`}
                      className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                      data-bs-parent="#website-service-faq"
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="text-center">
              <h2 className="h3 mb-3">Want to talk about a website?</h2>
              <p className="text-muted mb-4">
                Start with a written brief. A short message is enough to begin.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Start with a message
                </Link>
                <Link href="/projects/websites" className="btn btn-outline-primary btn-lg">
                  View website projects
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
