import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";

const featuredAreas = [
  {
    title: "Website design and development",
    description:
      "Business websites, portfolio sites, and custom frontends built to be clear, modern, and easy to keep improving over time.",
  },
  {
    title: "Custom tools and automation",
    description:
      "Calculators, internal tools, and workflow helpers that solve a real operational problem instead of adding more admin overhead.",
  },
  {
    title: "Technical problem solving",
    description:
      "Projects that sit between software, engineering, operations, and manufacturing - where details matter and the answer has to actually work.",
  },
];

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
    href: "/blog",
    label: "Read the blog",
    tone: "bg-emerald-600 text-white",
  },
  {
    href: "/contact",
    label: "Send a message",
    tone: "border border-primary text-primary dark:text-white",
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
          jobTitle: "Website Designer and Developer",
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

      <section className="primary-light-gradient text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-4">
              Deej Potter
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Website designer and developer building practical digital tools.
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
              I design and build websites, portfolio sites, and custom tools
              with a focus on clarity, performance, and maintainability. If you
              prefer to start through messages instead of phone calls, that
              suits me just fine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center rounded-full px-5 py-3 font-semibold transition-transform hover:scale-[1.02] ${link.tone}`}
                >
                  {link.label}
                </Link>
              ))}
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
              <li>- Small business and personal brand sites</li>
              <li>- Custom tools and automation helpers</li>
              <li>- Text-first communication through forms, social, or freelance platforms</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Featured areas</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredAreas.map((area) => (
              <article
                key={area.title}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950/60">
        <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-3">Explore the work</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              Browse website projects, custom tools, engineering work, and the
              blog. The common thread is simple: solve the problem properly,
              then make the result easy to use.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects/websites"
                className="text-sm bg-primary text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Websites
              </Link>
              <Link
                href="/projects/tools"
                className="text-sm bg-sky-600 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Tools
              </Link>
              <Link
                href="/blog"
                className="text-sm bg-emerald-600 text-white font-bold py-2 px-4 rounded-full transition-transform hover:scale-105"
              >
                Blog
              </Link>
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
