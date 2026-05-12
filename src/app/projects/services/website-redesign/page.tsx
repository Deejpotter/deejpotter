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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Service
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Website redesign
          </h1>
          <p className="mb-10 max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Not every site needs to be rebuilt from nothing. Sometimes the
            smarter move is to improve the structure, message, and user
            experience of what is already there.
          </p>

          <section className="mb-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <h2 className="mb-3 text-3xl font-bold">Signs a redesign is worth it</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {painPoints.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">Typical redesign goals</h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span>Clearer page structure and hierarchy</span></li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span>Stronger calls to action</span></li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span>Cleaner visual presentation</span></li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span>Better mobile responsiveness</span></li>
                <li className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-primary" /><span>Improved SEO basics and internal linking</span></li>
              </ul>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-3xl font-bold">What a redesign can focus on</h2>
            <p className="text-gray-700 dark:text-gray-300">
              A redesign can be mostly visual, mostly structural, or more
              conversion-focused. The right scope depends on whether the main
              problem is design, content clarity, technical friction, or weak
              enquiry flow.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              The point is not to redesign for the sake of change. The point is
              to make the site easier to understand, easier to use, and more
              useful to the people it is meant to serve.
            </p>
          </section>

          <section className="text-center">
            <h2 className="mb-3 text-3xl font-bold">Need a second look at an existing site?</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Send a message with the site link and what feels wrong or underpowered.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                Ask about a redesign
              </Link>
              <Link href="/projects/services" className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white">
                View services
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
