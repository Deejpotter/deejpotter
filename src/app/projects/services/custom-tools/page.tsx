import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const examples = [
  "Calculators for pricing, stock, sizing, or estimates",
  "Helpers that take care of repetitive admin work",
  "Dashboards and handy utility pages",
  "Small automations where a big software package would be overkill",
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

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Service
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Custom tools and automation
          </h1>
          <p className="mb-10 max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Sometimes the thing slowing you down isn&apos;t your website, it&apos;s a repetitive job behind the scenes. A small custom tool can fix that.
          </p>

          <section className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <h2 className="mb-3 text-3xl font-bold">What this can include</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {examples.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">When a custom tool makes sense</h2>
              <p className="text-gray-700 dark:text-gray-300">
                A custom tool makes sense when a small, specific problem keeps eating your time but isn&apos;t worth buying a big software system for.
              </p>
              <p className="mb-0 text-gray-700 dark:text-gray-300">
                Think quoting calculators, dashboards, admin shortcuts, or anything that saves you doing the same steps by hand.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">What to send me</h2>
              <p className="mb-0 text-gray-700 dark:text-gray-300">
                Tell me what the task is, what&apos;s annoying about it now, and what you&apos;d like to happen instead. That&apos;s usually enough for me to tell whether a custom tool will help.
              </p>
            </div>
          </section>

          <section className="text-center">
            <h2 className="mb-3 text-3xl font-bold">Want to talk through a custom tool?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]">
                Start with a message
              </Link>
              <Link href="/projects/tools" className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white">
                View existing tools
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
