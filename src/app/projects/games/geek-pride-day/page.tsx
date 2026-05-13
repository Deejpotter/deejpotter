import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Geek Pride Day Platformer Prototype | Deej Potter",
  description:
    "A small browser platformer prototype built from the Geek Pride Day asset pack, ready to embed in a blog post or share directly.",
};

export default function GeekPrideDayPage(): ReactElement {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 py-5 dark:border-gray-800">
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Geek Pride Day prototype
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Playable browser game preview
            </h1>
          </div>

          <div className="aspect-[16/10] w-full bg-black">
            <iframe
              src="/geek-pride-day/index.html"
              title="Geek Pride Day platformer prototype"
              className="h-full w-full border-0"
            />
          </div>
        </section>

        <aside className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start gap-4">
            <Image
              src="/geek-pride-day/resource/The-worker-in-a-yellow-hard-hat-and-blue-overalls-performs-a.webp"
              alt="Worker character artwork from the Geek Pride Day asset pack"
              width={205}
              height={205}
              className="h-24 w-24 rounded-2xl border border-gray-200 bg-gray-100 object-cover dark:border-gray-800 dark:bg-gray-950"
              priority
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Prototype scope
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This first pass proves the assets can become a lightweight
                side-scrolling platformer that is easy to embed in a blog post.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-bold">What this build does</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>Uses the supplied walk, run, jump, flag, and door art.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Adds basic platform physics, checkpointing, and a win state.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Stays iframe-friendly so the blog post can host or feature it.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/25">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
              Next launch step
            </p>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Once the prototype feels right, the same build can be embedded in a
              Geek Pride Day blog post and packaged into a downloadable ZIP.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/geek-pride-day/index.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Open game directly
            </a>
            <a
              href="/downloads/geek-pride-day-prototype.zip"
              download
              className="inline-flex items-center rounded-full border border-emerald-300 px-5 py-3 font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
            >
              Download ZIP
            </a>
            <Link
              href="/projects/games"
              className="inline-flex items-center rounded-full border border-gray-300 px-5 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Back to games
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
