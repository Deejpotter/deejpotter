import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  processSteps,
  serviceOfferings,
  showcaseItems,
} from "@/content/site-data";

const quickLinks = [
  {
    href: "/projects/websites/deejpotter",
    label: "About this site",
    tone: "bg-primary text-white",
  },
  {
    href: "/projects/websites",
    label: "Website projects",
    tone: "bg-sky-600 text-white",
  },
  {
    href: "/contact",
    label: "Start with a message",
    tone: "bg-emerald-600 text-white",
  },
  {
    href: "https://www.linkedin.com/in/daniel-potter-5224a4119",
    label: "LinkedIn",
    tone: "border border-primary text-primary dark:text-white",
    external: true,
  },
];

export default function Home(): ReactElement {
  return (
    <>
      <Script id="schema-person" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://deejpotter.com/#person",
          name: "Deej Potter",
          jobTitle: "Website Designer, Maker, and Developer",
          url: "https://deejpotter.com",
          sameAs: [
            "https://www.facebook.com/deej.potter.7/",
            "https://www.linkedin.com/in/daniel-potter-5224a4119",
          ],
        })}
      </Script>

      <Script id="schema-portfolio" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": "https://deejpotter.com/#portfolio",
          about: {
            "@id": "https://deejpotter.com/#person",
          },
          mainEntity: {
            "@id": "https://deejpotter.com/#person",
          },
        })}
      </Script>

      <section className="bg-gradient-to-b from-primary via-primary/95 to-primary/80 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-4">
              Deej Potter
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Website designer, maker, and developer building practical digital and physical tools.
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
              I design and build websites, portfolio sites, custom tools, and
              light fabrication work for small businesses and hobbyists across
              Australia. If you want local delivery or home visits within about
              an hour&apos;s drive, that can work too.
            </p>
            <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl">
              My strongest work tends to live where design, implementation, CAD/CAM,
              and practical operations meet - the projects where a clean answer is
              better than a flashy one.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {quickLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center rounded-full px-5 py-3 font-semibold transition-transform hover:scale-[1.02] ${link.tone}`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center rounded-full px-5 py-3 font-semibold transition-transform hover:scale-[1.02] ${link.tone}`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-900 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold mb-4">What I help with</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl">
              I work best on websites and digital tools that need thoughtful
              structure, clean implementation, and a practical result. That can
              mean a public business site, a portfolio refresh, a custom
              calculator, or a workflow tool that removes repetitive work.
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md p-6">
            <p className="text-sm uppercase tracking-wide text-primary mb-2">
              Best fit
            </p>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>- Website design and development projects</li>
              <li>- Small business and hobbyist projects in Australia</li>
              <li>- CAD/CAM, 3D printing, laser, and basic milling work</li>
              <li>- Custom tools and automation helpers</li>
              <li>- Text-first communication through forms, social, or freelance platforms</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
                Services
              </p>
              <h2 className="text-3xl font-bold">What I can build for you</h2>
            </div>
            <Link
              href="/projects/services"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              See the full services page
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {serviceOfferings.map((service) => (
              <article
                key={service.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col"
              >
                <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {service.features.slice(0, 3).map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
                <Link
                  href={service.link}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                >
                  {service.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary font-semibold">
                How I work
              </p>
              <h2 className="text-3xl font-bold">A simple process that keeps things moving</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl sm:text-right">
              Clear brief, sensible structure, working build, then refinement.
              No drama, no mystery, just deliberate progress.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <article
                key={step.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
              >
                <p className="text-sm font-semibold text-primary mb-2">
                  Step {index + 1}
                </p>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-3">Explore the work</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              Browse website projects, custom tools, maker and engineering work,
              and the blog. The common thread is simple: solve the problem properly,
              then make the result easy to use.
            </p>
            <div className="space-y-4">
              {showcaseItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-colors hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <p className="text-lg font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex text-sm font-semibold text-primary">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-3">Want to work together?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              The easiest way to start is by message. Send me a brief through
              the contact form, reach out on social media, or contact me through
              a freelance platform when those profiles are live. No phone call
              required just to begin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center bg-primary hover:bg-opacity-80 text-white font-bold py-3 px-6 rounded-full transition-transform hover:scale-105"
              >
                Start with a message
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center border border-primary text-primary dark:text-white font-semibold py-3 px-6 rounded-full transition-transform hover:scale-105"
              >
                Learn more about me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
