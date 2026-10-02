import { ReactElement } from "react";
import Link from "next/link";
import { links } from "@/content/links";

// The site has no contact form: work goes to Lumendot, everything else to
// GitHub or LinkedIn, so those are the only ways out the footer offers.
const outbound = [
  { href: links.github, label: "GitHub" },
  { href: links.linkedin, label: "LinkedIn" },
  { href: links.lumendot, label: "Lumendot (for work)" },
];

export default function MainFooter(): ReactElement {
  return (
    <footer id="main-footer" className="mt-auto bg-gray-100 py-6 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-gray-600 dark:text-gray-400">
          Deej Potter ·{" "}
          <a href={links.siteRepo} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            Source for this site
          </a>
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {outbound.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-700 transition-colors hover:text-primary dark:text-gray-300"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/privacy" className="text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
              Privacy
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
