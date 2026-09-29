import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  processSteps,
  serviceOfferings,
  showcaseItems,
} from "@/content/site-data";

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

      {/* Hero: one type-led block. The services line replaces the old boxed
          tiles so the headline carries the page instead of competing with them. */}
      <section className="relative isolate overflow-hidden bg-gray-950 px-4 pb-14 pt-10 text-white sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 -z-10 h-[22rem] w-[22rem] rounded-full bg-info/20 blur-3xl"
        />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Deej Potter · Frankston, VIC
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.95] sm:text-5xl lg:text-7xl">
            I build websites, custom tools, and{" "}
            <span className="text-gradient">physical parts.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Websites for small businesses, tools that save manual work, and 3D printed, engraved or milled parts for people who don&apos;t want to learn CAD. Pickup and delivery around the Mornington Peninsula.
          </p>
          <p className="mt-5 text-sm text-white/60">
            Websites <span aria-hidden="true">·</span> Custom tools <span aria-hidden="true">·</span> 3D printing <span aria-hidden="true">·</span> Laser engraving <span aria-hidden="true">·</span> CNC milling
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects/services/3d-printing"
              className="btn-gradient inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
            >
              Get a 3D print quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 transition-transform hover:scale-[1.02] hover:bg-white/5"
            >
              Start with a message
            </Link>
          </div>
        </div>
      </section>

      {/* Services as one bento grid. 3D printing gets the big tile because it's
          the one people can price and order online right now. */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              What I can make for you
            </h2>
            <Link href="/projects/services" className="text-sm font-semibold text-primary hover:underline">
              All services
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {serviceOfferings.map((service) => {
              const featured = service.id === "3d-printing";
              return (
                <Link
                  key={service.id}
                  href={service.link}
                  className={
                    featured
                      ? "flex flex-col justify-between rounded-3xl bg-gradient-to-br from-primary to-emerald-700 p-6 text-white md:order-first md:col-span-2 md:row-span-3"
                      : "flex flex-col justify-between rounded-3xl bg-white p-5 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                  }
                >
                  <div>
                    <h3 className={featured ? "text-3xl font-black" : "text-lg font-bold text-gray-900 dark:text-white"}>
                      {service.name}
                    </h3>
                    <p className={featured ? "mt-3 max-w-lg text-base leading-7 text-white/85" : "mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"}>
                      {service.description}
                    </p>
                    {featured && (
                      <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-white/85">
                        {service.features.slice(0, 3).map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <span className={featured ? "mt-8 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-950" : "mt-4 text-sm font-semibold text-primary"}>
                    {service.cta} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* The one process section; the page used to show the same three steps twice. */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">
              How a job goes
            </h2>
            <p className="mt-4 text-base leading-8 text-gray-700 dark:text-gray-300">
              You deal with me the whole way, with no long proposals or jargon.
            </p>
            <h3 className="mt-8 font-semibold text-gray-900 dark:text-white">Who this is for</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
              <li>Small businesses that need a website without the hassle</li>
              <li>Hobbyists and makers who need parts but don&apos;t do CAD</li>
              <li>Anyone who&apos;d rather get a result than learn another skill</li>
            </ul>
          </div>
          <ol className="ml-4 space-y-8 border-l-2 border-primary/30 pl-8">
            {processSteps.map((step, index) => (
              <li key={step.id} className="relative">
                <span className="absolute -left-[3.2rem] flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 leading-7 text-gray-600 dark:text-gray-400">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work and contact share one dark band so the page ends on a single clear
          action. Photos of real prints and sites go in these rows once they exist. */}
      <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">Things I&apos;ve made</h2>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {showcaseItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.link} className="group flex items-baseline justify-between gap-4 py-4">
                    <span>
                      <span className="block text-lg font-bold group-hover:text-emerald-300">{item.title}</span>
                      <span className="mt-1 block text-sm text-white/65">{item.description}</span>
                    </span>
                    <span aria-hidden="true" className="text-emerald-300">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pl-10">
            <h2 className="text-3xl font-black">Got a job in mind?</h2>
            <p className="mt-4 max-w-lg text-base leading-8 text-white/78">
              Send me the problem, the deadline and what done looks like. I&apos;ll tell you quickly whether I can help and roughly what it&apos;ll cost.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-gradient inline-flex items-center rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-[1.01]"
              >
                Start with a message
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              >
                About me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
