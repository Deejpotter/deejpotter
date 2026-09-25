# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

---

## Phase 1: E-commerce (removed)

The generic shop (product pages, cart, shop checkout, admin orders/products) was removed. Payments now only go through the quote system (Phase 3). Print-on-demand lives in the sibling repo `../deejpotter-gelato/`.

---

## Phase 2: Admin & Auth

### ✅ Admin dashboard, 3D printing quotes, leads, settings — DONE

### ✅ Unified admin auth — DONE
- `requireAdminPage()` checks MongoDB + Clerk metadata
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

### ⬜ R2 on production
- Set the R2 variables on the production Render service (see `R2_SETUP.md`) so uploaded quote files persist

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

- Admin link shown for MongoDB-role admins (navbar and account page)
- Laser engraving only; broken laser/milling quote tabs removed; API rejects laser cutting
- Contact leads and grocery orders moved to MongoDB; indexes created on first use
- Security: Next.js 16.3.6, Clerk proxy restored, mongo-crud admin-only, quote payment ownership check
- Content: redesign folded into web design; plain first-person copy without em dashes
- Decap CMS removed; blog posts written by hand
- Generic shop removed; quote-based service payments kept
- Docs refreshed; leftover files removed (Netlify, Jest, old reports)
- Quote status lookup migrated to MongoDB quote numbers
- Admin auth unified via requireAdminPage; leads page secured

---

## Notes

- Run tests: `yarn vitest run` (requires Node 22)
- Gelato merch site: see `../deejpotter-gelato/README.md`
