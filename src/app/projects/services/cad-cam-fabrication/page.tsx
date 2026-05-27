import { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "CAD, CAM, and Fabrication",
  "Laser cutting, CNC milling, and CAD file prep for prototypes, one-off parts, and small-run fabrication. Upload a DXF or SVG and get an instant preview.",
  "/projects/services/cad-cam-fabrication"
);

const whatIDo = [
  {
    title: "Laser cutting and engraving",
    desc: "Wood and acrylic up to 6mm. Upload a DXF or SVG to see your design and get a price. Cut, engrave, or both.",
  },
  {
    title: "CNC milling",
    desc: "Signs, panels, and practical parts from wood or acrylic. DXF upload with live preview — see your toolpath before committing.",
  },
  {
    title: "CAD file prep",
    desc: "Got a sketch, an idea, or a rough file? I'll clean it up, prep it for production, or model it from scratch. No CAD skills required on your end.",
  },
];

const faqs = [
  {
    question: "I don't have a DXF or SVG. Can I still get something made?",
    answer:
      "Yes. Send me what you have — a sketch, a photo, a description — and I'll model it for you. You don't need to know CAD.",
  },
  {
    question: "What materials do you work with?",
    answer:
      "Wood and acrylic are my standard materials for both laser and milling. If you need something specific like aluminium or carbon fibre, send me an email and I can test it — but I can't laser metal.",
  },
  {
    question: "How accurate is the preview?",
    answer:
      "The preview shows you the actual cut lines or engraving paths from your file. The real result will match what you see — within the tolerances of my machine.",
  },
  {
    question: "What if the job is too big or complex?",
    answer:
      "I'll tell you. No point taking on work I can't do properly. If it's beyond my setup, I'll let you know and point you in the right direction.",
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
            "Laser cutting, CNC milling, and CAD file prep for prototypes, one-off parts, and small-run fabrication.",
        })}
      </Script>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Service
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            CAD, CAM, and fabrication
          </h1>
          <p className="mb-10 max-w-4xl text-lg text-gray-600 dark:text-gray-400">
            Laser cutting, CNC milling, and CAD file prep for people who need a
            physical result without learning the software. Upload a DXF or SVG,
            see your design, and get a price.
          </p>

          <section className="mb-10 grid gap-6 md:grid-cols-3">
            {whatIDo.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h2 className="mb-2 text-xl font-bold">{item.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </article>
            ))}
          </section>

          <section className="mb-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
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
                  <span>People who have a sketch or idea but don't do CAD</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                  <span>Prototypes and test pieces before larger production runs</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-2xl font-bold">How it starts</h2>
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                Upload your file to see a live preview and get a price. Or send
                me a message with what you're trying to make — a sketch, a
                description, a rough idea. I'll tell you whether it fits and
                give you a price.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Not every job needs a big build. Sometimes the useful part is
                just making sure the file is right before production.
              </p>
            </div>
          </section>

          <section className="mb-10">
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
