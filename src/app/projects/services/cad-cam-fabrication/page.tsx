import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "CAD, CAM, and Fabrication Support",
  "CAD/CAM prep, machine-ready files, and light fabrication support for 3D printing, laser work, and basic milling - with honest limits around the Snapmaker A250T 2.0.",
  "/projects/services/cad-cam-fabrication"
);

const capabilities = [
  "CAD models for prototypes, simple parts, and practical fixtures",
  "CAM prep and machine-ready files for basic production work",
  "STL, STEP, and DXF cleanup for downstream printing or cutting",
  "3D printing, basic laser work, and light milling where the job fits the machine",
];

const goodFit = [
  "Small business parts and fixtures",
  "Hobby and maker projects",
  "Prototype work and test pieces",
  "Simple custom jobs that need quick, practical turnaround",
];

const limits = [
  "This is not industrial CNC production",
  "Large batches or heavy machining are not the right fit",
  "If the job is beyond the Snapmaker A250T 2.0, I will say so clearly",
];

const faqs = [
  {
    question: "Do you do CAD only, or CAD plus the making too?",
    answer:
      "Both. I can help shape the file, prep it for print or cutting, and then handle the fabrication side when it suits the job.",
  },
  {
    question: "Can you take on local delivery or home visits?",
    answer:
      "Yes, for the right job. That is most sensible for local small business and hobbyist work within about an hour's drive.",
  },
  {
    question: "What if I only need a simple model or toolpath check?",
    answer:
      "That is fine. Not every job needs a big build. Sometimes the useful part is just making sure the file is sane before production starts.",
  },
];

export default function CadCamFabricationService(): ReactElement {
  return (
    <>
      <Script id="schema-cad-cam-fabrication-service" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "CAD, CAM, and Fabrication Support",
          provider: {
            "@type": "Person",
            name: "Deej Potter",
            url: "https://deejpotter.com",
          },
          areaServed: ["Australia", "Local delivery and home visits within about an hour's drive"],
          serviceType: "CAD/CAM and light fabrication",
          url: "https://deejpotter.com/projects/services/cad-cam-fabrication",
          description:
            "CAD/CAM prep, machine-ready files, and light fabrication support for 3D printing, laser work, and basic milling.",
        })}
      </Script>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Service
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            CAD, CAM, and fabrication support
          </h1>
          <p className="mb-10 max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Practical CAD/CAM work for small businesses, hobbyists, and local projects that need machine-ready files, light fabrication, or a clear second pair of eyes before production starts.
          </p>

          <section className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">What I can help with</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {capabilities.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">Best fit for</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {goodFit.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">What this is not</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                {limits.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">How the work usually starts</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Send through the file, the rough size, the material or finish you have in mind, and whether the job needs printing, laser work, milling, or just CAD/CAM cleanup. If it is local and you need delivery or a visit, mention that too.
              </p>
              <p className="mb-0 text-gray-700 dark:text-gray-300">
                The goal is to keep the process simple and honest - enough detail to price and plan the job properly without turning it into a giant back-and-forth.
              </p>
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
            <h2 className="mb-3 text-3xl font-bold">Want to talk through a fabrication job?</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Start with a short written brief and I will tell you whether it fits the machine, the timeline, and the level of finish you want.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Start with a message
              </Link>
              <Link
                href="/projects/services"
                className="inline-flex items-center rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-transform hover:scale-[1.02] dark:text-white"
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
