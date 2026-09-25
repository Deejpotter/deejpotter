import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const deliverables = [
  "Small business websites",
  "Portfolio and personal brand sites",
  "Landing pages for enquiries or bookings",
  "Redesigns and fixes for existing sites",
  "Sites that work properly on phones",
];

const process = [
  "Work out who the site is for and what you want visitors to do.",
  "Plan the pages and wording so it's easy to find your way around.",
  "Build it (or fix what you have) so it's fast, works on any screen, and is easy to update.",
  "Tidy up the details, like buttons, the contact form, and the text, until it feels right.",
];

const faqs = [
  {
    question: "What kinds of website projects are the best fit?",
    answer:
      "Small business sites, portfolios, landing pages, and redesigns. It goes best when you know what you want the site to do.",
  },
  {
    question: "Do I need to start with a phone call?",
    answer:
      "No. I prefer to start by message. A short note about what you need is plenty.",
  },
  {
    question: "Can you improve an existing website instead of rebuilding from scratch?",
    answer:
      "Yes. Sometimes a rebuild makes sense, but often fixing the layout, wording, or speed of what you have is enough.",
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Service
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Website design and development
          </h1>
          <p className="mb-10 max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Websites for small businesses and personal projects that look good, load fast, and make it easy for people to get in touch.
          </p>

          <section className="mb-10 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">What this service is for</h2>
              <p className="text-gray-700 dark:text-gray-300">
                This is for you if you need a site that explains what you do and makes it easy for people to contact you.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                I can build one from scratch, or fix up a site you already have if it&apos;s looking dated or hard to use.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">What you get</h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {deliverables.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-3xl font-bold">How I work</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {process.map((step, index) => (
                <article
                  key={step}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    Step {index + 1}
                  </p>
                  <p className="mb-0 text-gray-700 dark:text-gray-300">{step}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-3xl font-bold">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm open:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none px-5 py-4 text-lg font-semibold text-gray-900 outline-none transition hover:bg-gray-50 group-open:border-b group-open:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-800/60">
                    {faq.question}
                  </summary>
                  <div className="px-5 py-4 text-gray-700 dark:text-gray-300">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="mb-3 text-3xl font-bold">Want to talk about a website?</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Send me a message about what you need. A few lines is enough to start.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Start with a message
              </Link>
              <Link
                href="/projects/websites"
                className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white"
              >
                View website projects
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
