# deejpotter.com — Architecture & Decisions Log

## Overview

A static Next.js 16 site (App Router, `output: "export"`): Deej's personal homepage, a companion to the GitHub profile, and the parent domain for personal apps. It has no server code, database, sign-in or forms.

The business app that used to live here (3D printing quotes, Stripe Payment Links, Australia Post shipping, admin, contact leads, Clerk, MongoDB, R2, Resend) moved to the private `lumendot` repo on 30 Sept 2026 with its full history. Its decisions and the Better Auth plan are recorded there. The groceries tool was replaced by the separate Grocery Visualiser app. The reasoning and remaining steps are in [PERSONAL_SITE_PLAN.md](PERSONAL_SITE_PLAN.md).

---

## Decisions

### Static export, with JavaScript
**Date:** 2026-10-01
**Why:** Nothing left on the site needs a server, so `next build` writes plain files to `out/` that any static host can serve ([Vercel, 2026b](#ref-vercel-2026b)). It stays on Next.js (rather than a lighter static generator) because it is a developer site meant to show off interactive work: the home page motion, the wireframe hero and the browser tools are React components, and they carry over unchanged.

What a static export rules out, and how the site handles it ([Vercel, 2026b](#ref-vercel-2026b)):

| Not supported in a static export | What the site does |
|---|---|
| Redirects, rewrites and headers in `next.config.js` | Redirects live in `public/_redirects`, read by the static host |
| Proxy (middleware) | Removed; the www-to-apex redirect is a host setting |
| Image optimisation with the default loader | `images.unoptimized: true` |
| Dynamic routes without `generateStaticParams()` | Write-ups use `generateStaticParams()` and `dynamicParams = false` |
| Route handlers that read the request | Only `GET` handlers marked `export const dynamic = "force-static"` (`robots.ts`, `sitemap.ts`, `blog/rss.xml`) |

`trailingSlash: true` makes Next.js emit `/about/index.html` instead of `/about.html` ([Vercel, 2026b](#ref-vercel-2026b)), so every static host serves `/about/` without extension rewriting.

### No login, no contact form
**Date:** 2026-10-01
**Why:** Everything that needed sign-in moved out (admin, accounts and contact leads to Lumendot; groceries to the Grocery Visualiser). Work enquiries go to lumendot.com and everything else to GitHub, so there is no email address or form to maintain or protect from spam. All outbound links are in `src/content/links.ts`.

### Old URLs
**Date:** 2026-10-01
**Why:** Business URLs have links, QR codes and search results pointing at them. `public/_redirects` sends them to Lumendot (and `/groceries` to the Grocery Visualiser repo). Cloudflare Pages reads this file from the build output, accepts absolute external destinations and `*` wildcards, and always follows a redirect even when a file exists at that path ([Cloudflare, 2026](#ref-cloudflare-redirects)). Netlify reads the same file.

The write-ups keep their `/blog/<slug>` URLs, and `/projects/*` keeps its paths, because lumendot.com redirects those paths here.

### Project list as data
**Why:** The home page grid comes from `src/content/projects.ts`, so adding a project is a data change. Only public repos get a code link. Private projects are listed without links, and personal app subdomains are never named on the site (see the plan's "Subdomains" section).

### Design system: brand gradients as accents
**Date:** 2026-09-26
**Why:** Large gradient fills read as dated and hurt legibility. The brand green (`#1E9952`) and info blue (`#59B7CC`) are accents: glows behind the hero, thin accent lines, gradient text on a key phrase, one gradient primary button per section. Utilities live in `src/styles/globals.css` and are documented in `.github/GRADIENT-GUIDE.md`. Interaction feedback is short (about 150 to 200ms); the home page's slower ambient motion (drifting glows, the printing wireframe part, scroll reveals, the cursor spotlight on project cards) is in `src/components/home/motion.tsx`. It never hides content before JavaScript runs, and all motion stops for `prefers-reduced-motion`, which reports that a user has asked their device to minimise non-essential motion ([MDN contributors, n.d.](#ref-mdn-reduced-motion)).

- **Navbar:** sticky 56px header, logo top-left, links beside it, theme toggle and GitHub on the right. The dropdown panel is absolutely positioned inside the header, so it moves with it.
- **Spacing:** 16px body text, page titles `text-3xl`/`sm:text-4xl`, sections `py-10`, cards `p-5`.

### Next.js 16 conventions
Synchronous access to `params` and `searchParams` was removed in Next.js 16, so they must be awaited ([Vercel, 2026c](#ref-vercel-2026c)). Metadata is exported from `layout.js` or `page.js` and only in Server Components ([Vercel, 2026a](#ref-vercel-2026a)), so client-component pages use a pass-through `layout.tsx`. The root layout's `title.template` appends "| Deej Potter" to child segments ([Vercel, 2026a](#ref-vercel-2026a)), so page titles don't include it.

---

## Hosting

**Now (1 Oct 2026):** deejpotter.com still runs the old business app on Render (`main` to production, `dev` to staging), and will until lumendot.com takes the quote flow. This static site is on the `feat/personal-site` branch and deploys nowhere yet.

**Planned:** a free static host (Cloudflare Pages), build command `yarn build`, output folder `out`. Then the Render services are retired. Order of work: [PERSONAL_SITE_PLAN.md](PERSONAL_SITE_PLAN.md) section 6.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Optional | Backend for the CNC Technical AI chat and the box shipping calculator's item list. Unset, so those two tools show that they aren't connected. It is read at build time |

---

## Directory structure

```
src/
├── app/                 # Pages (all static)
│   ├── blog/            # Write-ups (URLs kept from the old blog) + RSS
│   ├── projects/        # apps, engineering, games, tools, websites
│   ├── about/, privacy/
│   └── robots.ts, sitemap.ts
├── components/home/     # Home page and its motion
├── content/
│   ├── projects.ts      # Project grid data
│   ├── links.ts         # GitHub, LinkedIn, Lumendot
│   └── blog/, blog-md/  # Write-up sources
└── lib/                 # blog.ts, cutOptimizer.ts, utils.ts
public/
├── _redirects           # Old business URLs to Lumendot
├── basicBases/          # Unity WebGL game
└── geek-pride-day/      # Pixel-art game
```

---

## References

<a id="ref-cloudflare-redirects"></a>Cloudflare. (2026, August 25). *Redirects*. Cloudflare Pages docs. https://developers.cloudflare.com/pages/configuration/redirects/

<a id="ref-mdn-reduced-motion"></a>MDN contributors. (n.d.). *prefers-reduced-motion*. MDN Web Docs. Retrieved September 26, 2026, from https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

<a id="ref-vercel-2026a"></a>Vercel. (2026a, August 25). *generateMetadata*. Next.js Docs. https://nextjs.org/docs/app/api-reference/functions/generate-metadata

<a id="ref-vercel-2026b"></a>Vercel. (2026b, August 25). *How to create a static export of your Next.js application*. Next.js Docs. https://nextjs.org/docs/app/guides/static-exports

<a id="ref-vercel-2026c"></a>Vercel. (2026c, August 25). *How to upgrade to version 16*. Next.js Docs. https://nextjs.org/docs/app/guides/upgrading/version-16
