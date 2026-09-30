import { ReactElement } from "react";
import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "Privacy",
  "What deejpotter.com collects: no accounts, no forms and no tracking.",
  "/privacy"
);

// Kept short on purpose: a static site with no accounts or forms has little
// to disclose, and a long generated policy would claim things it doesn't do.
// Update this page if analytics, forms or sign-in are ever added.
export default function Privacy(): ReactElement {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 text-gray-700 sm:py-8 lg:py-10 dark:text-gray-300">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Privacy
      </h1>
      <p className="text-sm">Last updated: 1 October 2026</p>

      <h2 className="pt-2 text-xl font-bold text-gray-900 dark:text-white">What this site collects</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>No accounts, sign-in, contact forms or newsletters.</li>
        <li>No analytics, advertising or tracking cookies.</li>
        <li>
          Your light or dark theme choice is saved in your own browser so the
          site remembers it. It isn&apos;t sent anywhere.
        </li>
        <li>
          The hosting provider keeps standard server logs (such as IP address,
          page requested and time) to run and protect the site.
        </li>
      </ul>

      <h2 className="pt-2 text-xl font-bold text-gray-900 dark:text-white">Tools and games</h2>
      <p>
        The calculators and games run in your browser. The CNC Technical AI chat
        and the box shipping calculator&apos;s item list can connect to a
        separate backend; when one is connected, what you type or upload in
        those tools is sent to it to produce the answer.
      </p>

      <h2 className="pt-2 text-xl font-bold text-gray-900 dark:text-white">Other sites</h2>
      <p>
        Links to GitHub, LinkedIn and Lumendot take you to sites with their own
        privacy policies. Lumendot&apos;s covers anything you send it about paid
        work.
      </p>

      <h2 className="pt-2 text-xl font-bold text-gray-900 dark:text-white">Questions</h2>
      <p>
        Open an issue on{" "}
        <a
          href="https://github.com/Deejpotter/deejpotter/issues"
          className="font-semibold text-primary hover:underline"
        >
          this site&apos;s GitHub repo
        </a>
        .
      </p>
    </div>
  );
}
