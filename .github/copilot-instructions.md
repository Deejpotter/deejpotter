# Copilot & AI Agent Instructions for deejpotter Repository

## Project Overview

This is Deej's personal site: a static Next.js export (see `docs/README.md` and `docs/DEVELOPMENT.md`; the root `readme.md` is the GitHub profile page). It has no server code, database, sign-in or forms. The business app (quotes, Stripe, admin, Clerk, MongoDB) moved to the private `lumendot` repo; don't add it back here.

- App code and routes: `src/app` (Next.js App Router, all pages static).
- UI components: `src/components` and `src/templates` (reusable sections like `BasicSection` and `GradientHeroSection`).
- Home page data: `src/content/projects.ts` (project grid) and `src/content/links.ts` (GitHub, LinkedIn, Lumendot).
- Old URL redirects: `public/_redirects`, read by the static host (Next.js can't redirect in a static export).
- Static assets and games: `public/` (Unity WebGL in `public/basicBases/Build/`).
- **Docs**: TypeDoc output goes to `public/docs` (`typedoc.json` and `yarn docs`).

## AI Agent Tips

1. Read `docs/DEVELOPMENT.md` first to understand the correct workflow.
2. Use context7 to find exact documentation before making changes.
3. Also, use my-mcp-server's google and duckduckgo search tools to find officical documentation references or search online for information for things that don't have documentation.
4. Keep my current code and comments where possible or add your own detailed comments from my point of view to explain the purpose of the code.
5. Prioritize updating and improving files over creating new ones.
   Update my current files instead of making new ones and copying them over.

6. Each project should have a TODO list under .github/TODOs.md to show the workflow to follow for updates and additions.

7. First consider how to find the best actions. Then make a detailed plan. Remember this plan and refer back to it regularly to make sure you're on track.Then make the changes following the plan.

## Architecture & Structure (practical details)

- Pages live in `src/app/*`; components are kept in `src/components/*` and global styles in `src/styles/globals.css`.
- Styling uses **Tailwind CSS v4** with CSS-first configuration (`@theme` blocks in `src/styles/globals.css`). Custom design tokens for colors, spacing and typography are defined there. Legacy SCSS files may still exist but Tailwind utilities are the standard.
- Blog posts are written by hand: Markdown files in `src/content/blog-md` or TSX pages in `src/content/blog`, both loaded by `src/lib/blog.ts` (see `src/content/blog-md/README.md`). There is no CMS.
- Tests use Vitest + React Testing Library for unit/component tests and Playwright for E2E and visual tests. See `vitest.config.ts` and `playwright.config.ts`.
- When converting or adding UI components, add a top-of-file comment describing the purpose, rationale (e.g., Tailwind-first and accessibility considerations), and the testing approach (Vitest unit tests + Playwright visual test). Also include short block comments above major implementation sections explaining _why_ the structure was chosen (accessibility, performance, or testability), not only _what_ the code does.
- Alias imports use `@/` mapped to `src/` (resolved via `vitest.config.ts` for tests and `tsconfig.json` for the app).
- CSS and theme overrides: We use **Tailwind CSS** and utility classes in `src/styles` (see `TAILWIND-MIGRATION-PLAN.md` for migration notes). Tailwind-first development is the standard for new components.
- Design: brand gradients are accents, not fills. Use the `text-gradient`, `gradient-line`, `btn-gradient` and `glow-card` utilities in `globals.css` (see `.github/GRADIENT-GUIDE.md`), one gradient primary button per section, and the compact spacing scale (page titles `text-3xl sm:text-4xl`, sections `py-10`, cards `p-5`). Keep motion short and respect `prefers-reduced-motion`.

## Next.js 16 rules (these have caused real bugs)

- Route `params` and `searchParams` are **Promises**: `const { slug } = await params;`. Synchronous access was removed in Next.js 16 ([Vercel, 2026c](#ref-vercel-2026c)). Reading `params.slug` directly made every blog post 404.
- Metadata is only read from `page.tsx` or `layout.tsx`, and only in Server Components ([Vercel, 2026a](#ref-vercel-2026a)). A file named `metadata.tsx` is ignored unless the page re-exports it (`export { metadata } from "./metadata";`). Client-component pages can't export metadata; put it in a pass-through `layout.tsx` beside them.
- The root layout's title template adds "| Deej Potter" to child segments ([Vercel, 2026a](#ref-vercel-2026a)). Page titles must not include it.
- Rendering: the site is a static export (`output: "export"`). No ISR, cookies, proxy, server actions, request-reading route handlers, or `next.config.js` redirects/rewrites/headers ([Vercel, 2026b](#ref-vercel-2026b)). Dynamic routes need `generateStaticParams()`. Details in `docs/ARCHITECTURE.md` ("Static export").
- Route handlers and metadata routes must set `export const dynamic = "force-static"` to be prerendered in a static export ([Vercel, 2026b](#ref-vercel-2026b)); see `robots.ts`, `sitemap.ts` and `blog/rss.xml`.
- Unknown URLs render `src/app/not-found.tsx`; runtime errors render `src/app/error.tsx`.

## Developer Workflows (must-know commands)

- Local dev: `yarn dev` — Next.js dev server.
- Build (CI / production): `yarn build` writes the static site to `out/`. `yarn start` doesn't work with a static export; serve `out/` with any static server.
- Run tests: `yarn test`.
- Lint: `yarn lint`.
- Docs: `yarn docs` (writes to `public/docs`).
- CI: GitHub Actions runs lint, stylelint, Vitest and the build on pushes and PRs (`.github/workflows/ci.yml`).
- Env: none required. `NEXT_PUBLIC_API_URL` (optional, build time) connects the CNC Technical AI chat and box calculator items to a backend.
- Node: 24 LTS (`.nvmrc`, `engines`, CI).

- Deploys: Render static sites. `dev` deploys to `deejpotter-static-staging` (staging.deejpotter.com) and `main` to `deejpotter-static` (deejpotter.com). Work on a branch, PR into `dev`, check staging, then merge `dev` into `main`. Redirect routes live in `public/_redirects` (generate `render.yaml` with `node scripts/render-routes.mjs`) and are applied to both services through the Render API.

## Integration Points & Environment

- No contact form: work enquiries link to lumendot.com, everything else to GitHub (`src/content/links.ts`).
- Project cards link only to public repos. Never name private personal subdomains on the site, in the sitemap or in `robots.txt`.
- Box shipping calculator and CNC Technical AI: need `NEXT_PUBLIC_API_URL` (an external backend). It's unset, so they show that they aren't connected.

## Project-Specific Conventions

- Prefer `type` declarations and keep exported types in `src/types/*` (e.g. `box-shipping-calculator/ShippingItem.ts`, `cutCalculator.ts`).
- Explain intent with comments — the repo contains many well-scoped explanatory comments; preserve or extend them.
- Use `use client` only when necessary in server components (Next.js App Router rule).
- When changing public-facing data shapes, update TypeDoc and add tests for API surface changes.
- Docs referencing: cite external claims (framework behaviour, release schedules, standards) in APA 7 style. In-text citations link to the entry in a `## References` section at the end of the file, e.g. `([Vercel, 2026a](#ref-vercel-2026a))` pointing at `<a id="ref-vercel-2026a"></a>`. Open each source and confirm it states the claim before citing it; cite the specific page, not a docs homepage. Same-author same-year letters (2026a, 2026b) are assigned per reference list, alphabetically by title.

## Quick file pointers (examples)

- `src/components/TopNavbar/TopNavbar.tsx` — Sticky primary navigation: logo left, mega-menu dropdown anchored to the header (hover + click, animated), mobile drawer.
- `src/app/metadata.ts` — Default metadata, title template, and `generatePageMetadata()` for page titles, canonical URLs and OpenGraph.
- `src/content/projects.ts` — The home page project grid; only public repos get code links.
- `src/contexts/NavbarContext.tsx` — Navigation state (items, dropdown open/close) via React reducer + context.
- `public/_redirects` — Old business URLs to lumendot.com, `/groceries` to the Grocery Visualiser repo.
- `typedoc.json` + `yarn docs` — docs generation.
- `public/basicBases/Build/` — Unity WebGL assets; treat as static assets.
- `vitest.config.ts` — Test runner config with `@/` alias resolution and jsdom environment.

---

## Top tools for this repo

- Next.js 16 (static export), Tailwind CSS v4, TypeScript, Vitest, TypeDoc

## Env keys quicklist

Tools degrade gracefully when optional keys are missing (DuckDuckGo works without keys).

## Security posture

- Enforce timeouts and buffer limits for command execution.

---

## References

<a id="ref-vercel-2026a"></a>Vercel. (2026a, August 25). *generateMetadata*. Next.js Docs. https://nextjs.org/docs/app/api-reference/functions/generate-metadata

<a id="ref-vercel-2026b"></a>Vercel. (2026b, August 25). *How to create a static export of your Next.js application*. Next.js Docs. https://nextjs.org/docs/app/guides/static-exports

<a id="ref-vercel-2026c"></a>Vercel. (2026c, August 25). *How to upgrade to version 16*. Next.js Docs. https://nextjs.org/docs/app/guides/upgrading/version-16
