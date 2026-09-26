import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "CAD, CAM, and Fabrication",
  "Laser engraving, CNC milling, and CAD file prep for prototypes, one-off parts, and small-run fabrication. Send me a DXF or SVG and I'll give you a price.",
  "/projects/services/cad-cam-fabrication"
);

const whatIDo = [
  {
    title: "Laser engraving",
    desc: "Names, logos, and designs engraved into wood or acrylic. Send me a DXF or SVG and I'll give you a price.",
  },
  {
    title: "CNC milling",
    desc: "Signs, panels, and practical parts from wood or acrylic. Send me a DXF and I'll check it before anything gets cut.",
  },
  {
    title: "CAD file prep",
    desc: "Got a sketch, an idea, or a rough file? I will clean it up, prep it for production, or model it from scratch. No CAD skills required on your end.",
  },
];

const faqs = [
  {
    question: "I do not have a DXF or SVG. Can I still get something made?",
    answer:
      "Yes. Send me what you have, like a sketch, a photo, or a description, and I will model it for you. You do not need to know CAD.",
  },
  {
    question: "What materials do you work with?",
    answer:
      "Wood and acrylic are my standard materials for engraving and milling. If you need something specific like aluminium or carbon fibre, send me an email and I can test it. I only engrave with the laser, I don't cut with it.",
  },
  {
        question: "What file should I send?",
    answer:
      "A DXF or SVG is best. If you only have a sketch, a photo, or a PDF, send that and I'll turn it into a file that works.",
  },
  {
    question: "What if the job is too big or complex?",
    answer:
      "I will tell you. There is no point taking on work I cannot do properly. If it's beyond my setup, I will let you know and point you in the right direction.",
  },
];

export default function CadCamFabricationService(): ReactElement {
  return (
    <>
      <Script id="schema-cad-cam-fabrication" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "CAD, CAM, and Fabrication",
          provider: {
            "@type": "Person",
            name: "Deej Potter",
            url: "https://deejpotter.com",
          },
          areaServed: ["Frankston", "Mornington Peninsula", "Australia"],
          serviceType: "CAD/CAM and light fabrication",
          url: "https://deejpotter.com/projects/services/cad-cam-fabrication",
          description:
            "Laser engraving, CNC milling, and CAD file prep for prototypes, one-off parts, and small-run fabrication.",
        })}
      </Script>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Service
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            CAD, CAM, and fabrication
          </h1>
          <p className="mb-6 max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Laser engraving, CNC milling, and CAD file prep for people who need a physical result without learning the software. Send me a DXF or SVG and I&apos;ll get back to you with a price.
          </p>

          <section className="mb-6 grid gap-4 md:grid-cols-3">
            {whatIDo.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h2 className="mb-2 text-xl font-bold">{item.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </article>
            ))}
          </section>

          <section className="mb-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">Who this is for</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Small businesses needing signs, panels, or custom parts</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Hobbyists and makers with one-off projects</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>People who have a sketch or idea but do not use CAD</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Prototypes and test pieces before larger production runs</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">How it starts</h2>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                Send me a message with your file, or with what you are trying to make: a sketch, a description, or a rough idea. I will tell you whether it fits and
                give you a price.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Not every job needs a big build. Sometimes the useful part is
                just making sure the file is right before production.
              </p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="mb-4 text-3xl font-bold">Questions people ask</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
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
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Start with a message
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
