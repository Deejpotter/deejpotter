# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

---

## Phase 1: E-commerce Frontend

### ✅ STEP 1: Shop landing page — DONE
- `src/app/shop/page.tsx` — product grid from `/api/shop/products`

### ✅ STEP 2: Product detail page — DONE
- `src/app/shop/products/[slug]/page.tsx` — detail view + AddToCartButton

### ✅ STEP 3: Cart drawer UI — DONE
- `src/components/CartDrawer.tsx`, `CartButton.tsx`, wired in TopNavbar

### ✅ STEP 4: Checkout with Stripe — DONE
- `src/app/shop/checkout/page.tsx` — Stripe Elements
- `src/app/api/shop/create-payment-intent/route.ts` — creates order + payment intent
- `src/lib/db-shop-orders.ts` — order persistence
- Stripe webhook handles `payment_intent.succeeded` for shop orders
- Success/cancelled pages exist

### ⬜ STEP 5: Populate shop with products
**Sub-steps:**
5.1. Run `scripts/add-test-product.mjs` against MongoDB
5.2. Add real product images under `public/images/products/`
5.3. Use `/admin/products` to manage catalog

### ⬜ STEP 6: Digital download delivery
**Logic:** Digital products need post-purchase download link delivery (email or account page).

---

## Phase 2: Admin & Auth

### ✅ Admin dashboard, quotes, leads, settings — DONE

### ✅ Admin shop orders — DONE
- `/admin/orders` — list, filter, status updates, Stripe links

### ✅ Admin shop products — DONE
- `/admin/products` — CRUD, publish toggle

### ✅ Unified admin auth — DONE
- `requireAdminPage()` checks MongoDB + Clerk metadata
- Leads page now admin-guarded

---

## Phase 3: Quote System

### ✅ MongoDB quote migration — DONE
- Status lookup and file download use `db-quotes` (quote numbers)
- Legacy `quote-storage.ts` removed

### ⬜ STL client estimate — placeholder math remains in QuoteRequestForm (server analysis is real)

---

## Phase 4: Gelato / POD (moved out)

Print-on-demand and Gelato integration moved to sibling repo: `../deejpotter-gelato/`

deejpotter shop now supports **digital** and **service** products only.

---

## Phase 5: Build & CI

### ✅ CI pipeline — PASSING (Node 22)
- Lint, stylelint, vitest (178 tests), build

### ✅ Workflow fixes — DONE
- Removed broken Playwright workflow stub
- Stylelint workflow uses Node 22
- `.nvmrc` aligned to Node 22

---

## Completed (last 10)

- Gelato/POD removed; placeholder repo at `deejpotter-gelato`
- Shop order flow: db-shop-orders, webhook, admin orders/products pages
- Quote status lookup migrated to MongoDB quote numbers
- Admin auth unified via requireAdminPage; leads page secured
- CI/workflow fixes, gitignore cleanup, vitest canvas stub
- Cart drawer + Stripe checkout completed
- Clerk auth routes, design/copywriting agents
- Live route 404 fixes (privacy, terms, projects page)
- R2 persistent file storage for quote uploads
- MongoDB DAO layer (db-quotes, db-config, db-users)

---

## Notes

- Run tests: `yarn vitest run` (requires Node 22)
- Seed shop: `node scripts/add-test-product.mjs` (needs MONGODB_URI)
- Gelato merch site: see `../deejpotter-gelato/README.md`
