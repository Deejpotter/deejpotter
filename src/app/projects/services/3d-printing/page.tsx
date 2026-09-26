import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import QuoteRequestForm from "./QuoteRequestForm";
import QuoteStatusLookup from "./QuoteStatusLookup";

const benefits = [
  {
    title: "On-demand printing",
    body: "Get parts printed when you need them. Good for prototypes, replacements, hobby projects, and small runs.",
  },
  {
    title: "Next-day turnaround for locals",
    body: "If you're nearby and the print isn't huge, I can often have it ready the next day.",
  },
  {
    title: "Local and personal",
    body: "I'm in Frankston, so if you're around the Mornington Peninsula you can deal with me directly and pick up your part.",
  },
  {
    title: "Instant quotes",
    body: "Upload your file and see the price before you pay anything.",
  },
];

const useCases = [
  "Prototype parts",
  "Replacement brackets and small functional parts",
  "Hobby and maker projects",
  "Small-run custom pieces",
  "Test prints before a bigger run",
];

const quoteFactors = [
  "File size and print time",
  "Material required",
  "Part dimensions and quantity",
  "Whether it needs support removal or extra finishing",
  "Delivery or pickup requirements",
];

const nextSteps = [
  "Upload the STL or other supported model file.",
  "Let me know if you're local and want it next day.",
  "Get a quote based on print time, material, and handling.",
  "Approve the quote and I'll print it.",
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

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Service
            </p>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              On-demand 3D printing
            </h1>
            <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-400">
              Upload your file, see it in 3D, and get a price in seconds. No CAD experience needed. If you don&apos;t have a model, tell me what you need and I&apos;ll design it.
            </p>
          </div>

          <section className="mb-6">
            <div className="grid gap-4 md:grid-cols-2">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <h2 className="mb-3 text-2xl font-bold">{benefit.title}</h2>
                  <p className="mb-0 text-gray-600 dark:text-gray-400">{benefit.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-2 lg:items-start">
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
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">How quoting works</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The upload form gives you an estimate straight away. The final price also depends on a few things:
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

          <section className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-sky-500/10 p-5 shadow-sm dark:from-primary/15 dark:via-primary/10 dark:to-sky-500/10">
            <h2 className="mb-3 text-3xl font-bold">Next-day local turnaround</h2>
            <p className="mb-3 text-gray-700 dark:text-gray-300">
              If you&apos;re local and the print is a reasonable size, I can often have it ready the next day. Big prints or parts that need a lot of cleanup take longer.
            </p>
            <p className="mb-0 text-gray-700 dark:text-gray-300">
              Tell me when you need it and I&apos;ll let you know if next day is doable.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-4 text-3xl font-bold">How it works</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Upload your STL file (or tell me what you need and I&apos;ll model it)",
                "See a 3D preview and get an instant price",
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

          <section className="mb-6">
            <QuoteRequestForm />
          </section>

          <section className="mb-6">
            <QuoteStatusLookup />
          </section>

          <section className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sky-950 shadow-sm dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-50">
            <h2 className="mb-2 text-2xl font-bold">Instant quotes: upload a file and see the price</h2>
            <p className="mb-0">
              Drop in your STL file to see a 3D preview and a price estimate straight away.
            </p>
          </section>

          <section className="text-center">
            <h2 className="mb-3 text-3xl font-bold">Need something custom instead?</h2>
            <p className="mx-auto mb-6 max-w-3xl text-gray-600 dark:text-gray-400">
              If the job is more than a simple print, send me a message with the file, sizes, how many you need, and whether you&apos;re local.
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
