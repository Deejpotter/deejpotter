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
    href: "/contact",
    label: "Start with a message",
    tone: "bg-white text-gray-950",
    primary: true,
  },
  {
    href: "/projects/websites",
    label: "Website projects",
    tone: "border border-white/15 text-white/90 hover:bg-white/5",
  },
  {
    href: "/projects/services",
    label: "Services",
    tone: "border border-white/15 text-white/90 hover:bg-white/5",
  },
  {
    href: "https://www.linkedin.com/in/daniel-potter-5224a4119",
    label: "LinkedIn",
    tone: "border border-emerald-300/40 text-emerald-200 hover:bg-emerald-400/10",
    external: true,
  },
];

const heroBullets = [
  "Small business websites and portfolio refreshes",
  "Custom tools, calculators, and automation helpers",
  "CAD/CAM, 3D printing, laser, and basic milling support",
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

      <section className="bg-gray-950 px-4 pb-16 pt-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">
              Deej Potter
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
              Practical digital tools and fabrication
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Website designer - maker - developer
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.92] sm:text-5xl lg:text-7xl">
                Your website, your parts, your tools — built so you don&apos;t have to.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
                I design websites that bring in customers while you run your business. I fabricate parts for people who need a physical result without learning CAD. Based in Frankston, VIC — local pickup and delivery around the Mornington Peninsula.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {quickLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${link.tone}`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${link.tone}`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {heroBullets.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-white/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                What I help with
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white">
                Clear structure. Clean execution. No wasted motion.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                I work best on websites and digital tools that need thoughtful structure, clean implementation, and a practical result.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  "Website design and development projects",
                  "Small business and hobbyist projects in Australia",
                  "CAD/CAM, 3D printing, laser, and basic milling work",
                  "Custom tools and automation helpers",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/82"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-950">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl bg-white p-8 shadow-bs-lg dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
              You tell me what you need. I make it happen.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300">
              No drawn-out proposals, no jargon, no getting handed off to someone else. Send me the brief and I&apos;ll tell you honestly whether it&apos;s a fit. If it is, you get a working result — not a long email thread.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["1", "You brief me", "Tell me the problem, the deadline, and what success looks like."],
                ["2", "I build it", "Clear structure, working build, then refinement. No black boxes."],
                ["3", "You get results", "A site that converts, a part that fits, a tool that works."],
              ].map(([num, title, text]) => (
                <div key={title} className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                  <p className="text-sm font-bold text-primary">{num}</p>
                  <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-bs-lg dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Who this is for
            </p>
            <ul className="mt-5 space-y-3 text-gray-700 dark:text-gray-300">
              <li>- Small businesses who want a website that works without the hassle</li>
              <li>- Hobbyists and makers who need parts but don&apos;t do CAD</li>
              <li>- Anyone who&apos;d rather get a result than learn another skill</li>
              <li>- People who value clear communication and honest pricing</li>
            </ul>
            <p className="mt-6 text-sm font-medium text-primary">
              <li>- Custom tools and automation helpers</li>
              <li>- Text-first communication through forms, social, or freelance platforms</li>
            </ul>
            <div className="mt-8 rounded-2xl bg-gray-50 p-5 dark:bg-gray-950/80">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-500">
                Working style
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-300">
                Clear brief, sensible structure, working build, then refinement. No drama, no mystery, just deliberate progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
                What I can build for you
              </h2>
            </div>
            <Link
              href="/projects/services"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              See the full services page
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {serviceOfferings.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-bs transition-all hover:-translate-y-1 hover:shadow-bs-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Service
                </p>
                <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {service.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.link}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
                >
                  {service.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
                How I work
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                A simple process that keeps things moving
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-right">
              Clear brief, sensible structure, working build, then refinement. No drama, no mystery, just deliberate progress.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step, index) => (
              <article
                key={step.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold text-emerald-300">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-950/60">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-bs-lg dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Explore the work
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              Browse the parts of the site that show the range.
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Website projects, custom tools, maker and engineering work, and the blog all point back to the same idea: solve the problem properly, then make the result easy to use.
            </p>
            <div className="mt-6 space-y-4">
              {showcaseItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="block rounded-2xl border border-gray-200 p-5 transition-colors hover:border-primary/40 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/60"
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex text-sm font-semibold text-primary">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-primary to-emerald-700 p-8 text-white shadow-bs-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Want to work together?
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Start with a message.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/86">
              The easiest way to begin is with a brief. Send me the problem, the deadline, and the result you want. I can usually tell you quickly whether it is a fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-950 transition-transform hover:scale-[1.01]"
              >
                Start with a message
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
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
