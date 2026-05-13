import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { serviceOfferings } from "@/content/site-data";

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
            "Website design and development, custom digital tools, CAD/CAM support, light fabrication, and selected technical services.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: serviceOfferings.map((service, index) => ({
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

      <div className="space-y-10 py-8 sm:py-12 lg:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Services
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Practical digital work, built properly
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
            I help with website design and development, custom tools, CAD/CAM support, light fabrication, and selected technical projects that need a clear result rather than a pile of vague promises.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {serviceOfferings.map((service) => (
            <article
              key={service.id}
              className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">{service.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link
                  href={service.link}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-[1.01]"
                >
                  {service.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">How I approach service work</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                The goal is not to sell as many disconnected services as possible. The goal is to solve the actual problem in front of you - whether that is a weak website, a missing workflow tool, or a technical process that wastes time.
              </p>
              <p>
                I prefer written communication first because it keeps briefs, scope, and next steps clearer. That usually leads to better work and less confusion than forcing everything into phone-first calls.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Best fit projects</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>Small business websites</li>
              <li>Portfolio and personal brand sites</li>
              <li>Landing pages with clearer calls to action</li>
              <li>Custom calculators and small internal tools</li>
              <li>CAD/CAM prep, print jobs, and light fabrication support</li>
              <li>Technical cleanup and iterative improvements</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-full border border-primary/30 px-4 py-3 font-semibold text-primary transition hover:bg-primary/5"
              >
                Start with a message
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
