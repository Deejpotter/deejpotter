# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

---

## Documentation refresh (2026-09-26)

- [x] 1. readme.md
  - [x] 1.1 Local database section (`DB_NAME=deejpotter_dev`, refresh with mongosh)
  - [x] 1.2 Point to rendering/caching notes
- [x] 2. ARCHITECTURE.md
  - [x] 2.1 Databases section (live/dev/staging, shared Atlas user)
  - [x] 2.2 `DB_NAME` in the env var table
  - [x] 2.3 Design system decision (gradient accents, sticky navbar, spacing)
- [x] 3. .github/copilot-instructions.md
  - [x] 3.1 Next.js 16 rules (await params, metadata in page/layout)
  - [x] 3.2 Rendering: static default, ISR when public pages read MongoDB
  - [x] 3.3 Materials source is MongoDB
  - [x] 3.4 Dev database locally
  - [x] 3.5 Design utilities; navbar description
- [x] 4. .github/TODOs.md
  - [x] 4.1 Node 22 references to 24
  - [x] 4.2 Completed (last 10) list
  - [x] 4.3 Follow-ups: staging DB, Atlas dev user, box calculator backend, tautological navbar test
- [x] 5. .github/GRADIENT-GUIDE.md rewritten for current utilities
- [x] 6. .github/ISSUES/006-metadata-og.md status
- [x] 7. Box shipping calculator README: backend/env status
- [x] 8. ops/README.md legacy banner (site runs on Render)
- [x] 9. .github/instructions/nextjs.instructions.md: Jest to Vitest
- [x] 10. Verify referenced paths/classes exist; commit, push, merge dev then main

- [ ] Later: move quality/infill presets and hourly rate into the MongoDB config too

## Follow-ups (2026-09-26)

- [ ] Staging database: set `DB_NAME=deejpotter_staging` on `deejpotter-staging` (check what it uses now) and seed it
- [ ] Dev-only Atlas user limited to `deejpotter_dev` so local scripts can't reach the site's database
- [ ] Box shipping calculator: point `NEXT_PUBLIC_API_URL` at the backend, or move items into MongoDB (recommended)
- [ ] `src/__tests__/navbar-integration.test.ts` asserts string literals equal themselves; replace with real checks or remove
- [ ] Wire `src/test/setupTests.ts` canvas stub into Vitest setup (silences "getContext not implemented" noise)
- [ ] OpenGraph image per page / blog JSON-LD (see `.github/ISSUES/006-metadata-og.md`)

## Dependency follow-ups

- Node 24 + minor/patch refresh done (#119, #120); both Render services on `NODE_VERSION=24`
- [ ] Later (separate PRs): vitest 5 + jsdom 30 + jest-dom 7; svix 2; ESLint 10 once next/typescript-eslint support it; TypeScript 7 held

---

## Phase 1: E-commerce (removed)

The generic shop (product pages, cart, shop checkout, admin orders/products) was removed. Payments now only go through the quote system (Phase 3). Print-on-demand lives in the sibling repo `../deejpotter-gelato/`.

---

## Phase 2: Admin & Auth

### ✅ Admin dashboard, 3D printing quotes, leads, settings — DONE

### ✅ Unified admin auth — DONE
- `requireAdminPage()` / `isAdminUser()` check the `ADMIN_USER_IDS` environment variable
- Leads page now admin-guarded

---

## Phase 3: Quote System

### ✅ MongoDB quote migration — DONE
- Status lookup and file download use `db-quotes` (quote numbers)
- Legacy `quote-storage.ts` removed

### ⬜ STL client estimate — placeholder math remains in QuoteRequestForm (server analysis is real)

### ⬜ Laser engraving and milling quote flow
The quote form is 3D printing only. Laser (engraving only) and milling jobs come in through the contact form. A real flow needs a 2D (DXF/SVG) uploader and the form posting to `/api/quotes` with the service type.

---

## Phase 4: Gelato / POD (moved out)

Print-on-demand and Gelato integration moved to sibling repo: `../deejpotter-gelato/`

deejpotter no longer has a shop; service payments go through quotes.

---

## Phase 5: Hosting & storage

### ✅ Render hosting — DONE
- `dev` deploys to staging, `main` to production. Netlify and Vercel removed.

### ✅ Persistent data — DONE
- Contact leads and grocery orders stored in MongoDB (Render's disk is ephemeral)
- Indexes created automatically on first database use

### ✅ R2 on production — DONE
- All four R2 variables set on the production Render service (see `R2_SETUP.md`)

### ✅ Environment variables — DONE
- `ADMIN_USER_IDS` and `RESEND_API_KEY` set on both Render services

### ⬜ Confirm Resend sending
- Check deejpotter.com is verified in Resend, then submit a test quote and look for `[email] Sent:` in the Render logs

### ⬜ Contact form email
- Contact messages are saved to `/admin/leads` but send no email; decide whether to add a notification

---

## Phase 6: Build & CI

### ✅ CI pipeline — PASSING (Node 24)
- Lint, stylelint, vitest, build

### ✅ Workflow fixes — DONE
- Removed broken Playwright workflow stub
- CI and stylelint workflows use Node 24 (actions/checkout and setup-node v7)
- `.nvmrc`, `engines` and Render `NODE_VERSION` on Node 24

---

## Completed (last 10)

- Local dev database `deejpotter_dev` (mirrored with mongosh); `.env.example` defaults to it
- 3D printing materials from MongoDB; quote page ISR + revalidatePath on admin save (#127)
- Blog posts 404 fixed (Next 16 async params); per-page titles; branded 404/error pages (#125)
- Quote estimate uses server materials/rates (5 of 9 materials were under-priced) (#125)
- Brand gradients as accents: header line, dropdown wash, hero glows, gradient CTA (#125)
- Sticky navbar, logo left, dropdown anchored to header and animated (#124)
- Site-wide spacing and type scale tightened for medium screens (#123)
- Box calculator no longer re-fetches items in a loop (#121)
- Node 24 LTS and latest minor/patch dependencies; Babel/Jest leftovers removed (#119)
- Contact form always posts to /api/contact (fixed failed submissions)

---

## Notes

- Run tests: `yarn test` (requires Node 24)
- Local database: `DB_NAME=deejpotter_dev` (see readme "Local database")
- Gelato merch site: see `../deejpotter-gelato/README.md`
