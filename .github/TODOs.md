# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

---

## Design + Next.js pass (2026-09-26)

- [x] 1. Brand gradients: verify dropdown, commit (one PR with the rest)
- [x] 2. Blog post 404 fix
  - [x] 2.1 Await `params` (Next 16) in `blog/[slug]` page + `generateMetadata`
  - [x] 2.2 `dynamicParams = false` so unknown slugs 404 at build
  - [x] 2.3 Confirm posts render locally
- [x] 3. Per-page titles and descriptions
  - [x] 3.1 Title template in `src/app/metadata.ts`
  - [x] 3.2 `metadata` on server pages missing it
  - [x] 3.3 `layout.tsx` metadata for client-only pages
- [ ] 4. Branded `not-found.tsx` and `error.tsx`
- [ ] 5. Quote form materials/prices from `config/printing-materials.json` via the server page (no hard-coded copy)
- [ ] 6. Rendering/caching approach in `ARCHITECTURE.md` (static default; ISR + `revalidatePath` when public pages read MongoDB)
- [ ] 7. Verify: tsc, vitest, eslint, `next build` route table, browser checks
- [ ] 8. PR into `dev`, check staging, ask before production
- [ ] Decision needed: make MongoDB service config the source for public 3D printing materials (then ISR the page)

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

### ✅ CI pipeline — PASSING (Node 22)
- Lint, stylelint, vitest, build

### ✅ Workflow fixes — DONE
- Removed broken Playwright workflow stub
- Stylelint workflow uses Node 22
- `.nvmrc` aligned to Node 22

---

## Completed (last 10)

- Contact form always posts to /api/contact (fixed failed submissions)
- Admins set by ADMIN_USER_IDS; quote submissions no longer demote admins; footer gap fixed
- Laser engraving only; broken laser/milling quote tabs removed; API rejects laser cutting
- Contact leads and grocery orders moved to MongoDB; indexes created on first use
- Security: Next.js 16.3.6, Clerk proxy restored, mongo-crud admin-only, quote payment ownership check
- Content: redesign folded into web design; plain first-person copy without em dashes
- Decap CMS removed; blog posts written by hand
- Generic shop removed; quote-based service payments kept
- Docs refreshed; leftover files removed (Netlify, Jest, old reports)
- Quote status lookup migrated to MongoDB quote numbers

---

## Notes

- Run tests: `yarn vitest run` (requires Node 22)
- Gelato merch site: see `../deejpotter-gelato/README.md`
