import { ReactElement } from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Deej Potter",
  description:
    "A collection of websites, tools, apps, engineering projects, and games built by Deej Potter.",
};

// Each project category with a short description and the sub-page link.
// This page acts as the top-level projects index — the "Projects" dropdown in the
// navbar links here as a fallback landing, and each card drives users to the
// relevant category page.
const categories = [
  {
    id: "websites",
    label: "Websites",
    href: "/projects/websites",
    description:
      "Websites I've designed and developed for clients and as personal projects — responsive, accessible, and optimised for SEO.",
    icon: "🌐",
  },
  {
    id: "tools",
    label: "Tools & Calculators",
    href: "/projects/tools",
    description:
      "Custom calculators and technical tools — cut optimisers, CNC helpers, and other utilities built to solve real problems.",
    icon: "🔧",
  },
  {
    id: "apps",
    label: "Apps",
    href: "/projects/apps",
    description:
      "Full-stack web applications including task managers, dashboards, and the CNC Tools platform with 12+ specialised calculators.",
    icon: "📱",
  },
  {
    id: "engineering",
    label: "Engineering",
    href: "/projects/engineering",
    description:
      "Hardware and embedded projects — ESP32 wireless cars, CYD controllers, and other builds that combine firmware with electronics.",
    icon: "⚙️",
  },
  {
    id: "games",
    label: "Games",
    href: "/projects/games",
    description:
      "Unity WebGL games playable in the browser — from base-defence shooters to Geek Pride Day platformers.",
    icon: "🎮",
  },
  {
    id: "services",
    label: "Services",
    href: "/projects/services",
    description:
      "Website design, custom tools, CAD/CAM support, 3D printing, and laser cutting — practical work with a clear deliverable.",
    icon: "🛠️",
  },
];

export default function Projects(): ReactElement {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12 lg:py-16">
      {/* Page header */}
      <section className="mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Projects
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Things I&apos;ve built.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Websites, tools, apps, engineering builds, and games. Browse by
          category to see the work and dig into the details of each project.
        </p>
      </section>

      {/* Category grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary/60"
          >
            <span className="mb-3 text-3xl">{cat.icon}</span>
            <h2 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
              {cat.label}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {cat.description}
            </p>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-2 text-2xl font-bold">
          Want to work on something together?
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          If you have a project idea — a website, a tool, a fabrication job —
          send me a short brief and I&apos;ll tell you whether it&apos;s a fit.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-[1.01]"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
