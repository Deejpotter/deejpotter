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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Service
            </p>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              On-demand 3D printing
            </h1>
            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              Upload your file, see it in 3D, and get a price in seconds. No CAD experience needed — if you don&apos;t have a model, just tell me what you need and I&apos;ll design it.
            </p>
          </div>

          <section className="mb-10">
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <h2 className="mb-3 text-2xl font-bold">{benefit.title}</h2>
                  <p className="mb-0 text-gray-600 dark:text-gray-400">{benefit.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="mb-3 text-3xl font-bold">Good fit for</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {useCases.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">How quoting works</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The upload form below can now give a preliminary STL-based
                preflight estimate, but final quotes still need to account for a
                few practical variables before pricing is locked in:
              </p>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                {quoteFactors.map((factor) => (
                  <li key={factor} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-sky-500/10 p-6 shadow-sm dark:from-primary/15 dark:via-primary/10 dark:to-sky-500/10">
            <h2 className="mb-3 text-3xl font-bold">Next-day local turnaround</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              Next-day turnaround is something worth offering, but only when it
              is genuinely realistic. That normally means the customer is local,
              the file is not excessively large, and the print can be completed
              without blowing out into a multi-day job or heavy post-processing.
            </p>
            <p className="mb-0 text-gray-700 dark:text-gray-300">
              In other words: yes, this can be a strong offer - but it should be
              presented as available <strong>where viable</strong>, not as an
              unconditional promise.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-3xl font-bold">How it works</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Upload your STL file (or tell me what you need and I&apos;ll model it)",
                "See a 3D preview and get an instant price based on real geometry",
                "Choose your material, quality, and delivery",
                "Pay online. Your part arrives. That&apos;s it.",
              ].map((step, index) => (
                <article
                  key={step}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
                    Step {index + 1}
                  </p>
                  <p className="mb-0 text-gray-700 dark:text-gray-300">{step}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <QuoteRequestForm />
          </section>

          <section className="mb-10">
            <QuoteStatusLookup />
          </section>

          <section className="mb-10 rounded-2xl border border-sky-200 bg-sky-50 p-6 text-sky-950 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-50">
            <h2 className="mb-2 text-2xl font-bold">Instant quoting — upload and see your price</h2>
            <p className="mb-0">
              Drop your STL file to see a 3D preview and an immediate price estimate based on your model&apos;s actual geometry. No waiting, no guessing, no back-and-forth.
            </p>
          </section>

          <section className="text-center">
            <h2 className="mb-3 text-3xl font-bold">Need something custom instead?</h2>
            <p className="mx-auto mb-6 max-w-3xl text-gray-600 dark:text-gray-400">
              If the job needs more than straightforward printing, start with a
              message and include the file, dimensions, quantity, and whether
              you are local and hoping for fast turnaround.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white"
              >
                General enquiry
              </Link>
              <Link
                href="/projects/services"
                className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] dark:bg-gray-100 dark:text-gray-900"
              >
                View all services
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
