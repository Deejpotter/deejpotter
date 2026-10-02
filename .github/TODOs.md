# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

The business app (quote to order flow, staging isolation, Better Auth plan, Stripe, admin, contact leads) moved to the private `lumendot` repo on 30 Sept 2026, with its full history and its TODO list. This file covers the personal site only.

---

## Personal static site (2026-10-01)

Plan and reasoning: `docs/PERSONAL_SITE_PLAN.md`. Branch `feat/personal-site`. Don't merge into `dev` or `main` until lumendot.com has the quote flow (Render still deploys the old app from those branches).

- [x] 1. Remove what moved out
  - [x] 1.1 API routes, admin, account, sign-in/up, contact form, terms, services pages
  - [x] 1.2 Clerk (layout, proxy, navbar button, CNC AI tool tokens)
  - [x] 1.3 MongoDB, Stripe, R2, Resend, shipping, quote and groceries libraries and their tests
  - [x] 1.4 Unused dependencies (22 packages) and the dead legacy `Navbar` and `FileUpload` components
- [x] 2. Static export
  - [x] 2.1 `output: "export"`, `trailingSlash`, unoptimised images
  - [x] 2.2 `force-static` on robots and sitemap
  - [x] 2.3 Old URLs in `public/_redirects` (business pages to Lumendot, `/groceries` to the Grocery Visualiser repo)
- [x] 3. Content
  - [x] 3.1 Home page: hero, project grid from `src/content/projects.ts`, "Also on this site", Lumendot and GitHub endings
  - [x] 3.2 Navbar (Write-ups, GitHub button), footer, About, Privacy, 404 and error pages
  - [x] 3.3 Blog relabelled as write-ups at the same URLs
  - [x] 3.4 Default metadata, robots, sitemap
- [x] 4. Tests, lint, build, and a look at the built site in Chrome
- [x] 5. Docs: README, DEVELOPMENT, ARCHITECTURE, copilot instructions, this file, `.env.example`
- [ ] 6. (Deej) Review the copy and the project list on the draft PR
- [ ] 7. Check the mobile layout (couldn't be checked in the browser session on 1 Oct)
- [x] 8. Phase A (plan section 6): Render static site from `render.yaml` on this branch; check pages, games, every redirect, mobile, Lighthouse
- [x] 9. Phase B gate: Lumendot live on lumendot.com (lumendot.com.au waits for the ABN)
- [x] 10. Phase C, 2 Oct 2026: #144 and #143 merged; static sites `deejpotter-static` (main) and `deejpotter-static-staging` (dev); domains and Cloudflare records moved; staging kept
- [ ] 11. Phase D, about two weeks later: delete the old Render services, Stripe and Clerk leftovers, old branches

## Show-off ideas (Deej wants JavaScript on this site)

- [ ] Interactive demos on project cards (for example a live cut optimiser run, or a CYD screen mock)
- [ ] Real photos or short clips of the hardware builds
- [ ] Per-project write-up pages for Game Agent and the CYD boards

## Follow-ups

- [ ] Box shipping calculator and CNC Technical AI: connect a backend with `NEXT_PUBLIC_API_URL`, or mark them as demos
- [ ] Update the GitHub repo description (still describes the quote system) once this is merged
- [ ] Delete old branches (`feature/ecommerce-shop`, `deploy-ecommerce`, `feat/quote-order-flow`, `spike/better-auth`, `feat/astro-site`); that history is kept in the `lumendot` repo
- [ ] `.github/agents` and `.github/prompts` still hold business prompts (customer replies, CNC triage); move them to `lumendot` or delete them

## Dependency follow-ups

- [ ] Later (separate PRs): vitest 5 + jest-dom 7; ESLint 10 once next/typescript-eslint support it; TypeScript 7 held

---

## Completed (last 10)

- Personal static site on `feat/personal-site` (2026-10-01)
- Business app moved to the `lumendot` repo with its history (2026-09-30)
- Local dev database `deejpotter_dev` (mirrored with mongosh); `.env.example` defaults to it
- 3D printing materials from MongoDB; quote page ISR + revalidatePath on admin save (#127)
- Blog posts 404 fixed (Next 16 async params); per-page titles; branded 404/error pages (#125)
- Brand gradients as accents: header line, dropdown wash, hero glows, gradient CTA (#125)
- Sticky navbar, logo left, dropdown anchored to header and animated (#124)
- Site-wide spacing and type scale tightened for medium screens (#123)
- Box calculator no longer re-fetches items in a loop (#121)
- Node 24 LTS and latest minor/patch dependencies; Babel/Jest leftovers removed (#119)

---

## Notes

- Run tests: `yarn test` (requires Node 24)
- Look at the built site: `yarn build`, then serve `out/` with any static server
