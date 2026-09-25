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

---

## Phase 4: Gelato / POD (moved out)

Print-on-demand and Gelato integration moved to sibling repo: `../deejpotter-gelato/`

deejpotter no longer has a shop; service payments go through quotes.

---

## Phase 5: Build & CI

### ✅ CI pipeline — PASSING (Node 22)
- Lint, stylelint, vitest, build

### ✅ Workflow fixes — DONE
- Removed broken Playwright workflow stub
- Stylelint workflow uses Node 22
- `.nvmrc` aligned to Node 22

---

## Completed (last 10)

- Generic shop removed; quote-based service payments kept
- Docs refreshed; leftover files (sb-original, next-dev.log, test hero page) removed
- Gelato/POD removed; placeholder repo at `deejpotter-gelato`
- Shop order flow: db-shop-orders, webhook, admin orders/products pages
- Quote status lookup migrated to MongoDB quote numbers
- Admin auth unified via requireAdminPage; leads page secured
- CI/workflow fixes, gitignore cleanup, vitest canvas stub
- Cart drawer + Stripe checkout completed
- Clerk auth routes, design/copywriting agents
- Live route 404 fixes (privacy, terms, projects page)

---

## Notes

- Run tests: `yarn vitest run` (requires Node 22)
- Gelato merch site: see `../deejpotter-gelato/README.md`
