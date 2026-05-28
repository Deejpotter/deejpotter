# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

---

## Phase 1: E-commerce Frontend (Priority: HIGH)

### ✅ STEP 1: Shop landing page — DONE
- `src/app/shop/page.tsx` — hero section, product grid from `/api/shop/products`
- `src/components/ShopCard.tsx` — product card with image, price, type badge
- Responsive grid (1→2→3→4 columns)

### ✅ STEP 2: Product detail page — DONE
- `src/app/shop/products/[slug]/page.tsx` — image, pricing, tags, service config
- `AddToCartButton` component with cart context integration
- POD/digital/service type handling

### ⬜ STEP 3: Cart drawer UI — Cart context done, needs drawer component
**Logic:** The cart context (`src/lib/cart-context.tsx`) handles state + localStorage persistence. Need a visual cart drawer that slides in from the right with item list, quantity controls, and checkout button.

**Sub-steps:**
3.1. Create `src/components/CartDrawer.tsx` — slide-out panel with items, totals, checkout CTA
3.2. Add cart badge to TopNavbar showing item count
3.3. Wire drawer open/close to a cart icon in the nav

### ⬜ STEP 4: Checkout with Stripe — needs checkout page
**Logic:** Cart context exists. Stripe payment-intent route exists at `/api/shop/create-payment-intent`. Need a checkout page with Stripe Elements for card collection.

**Sub-steps:**
4.1. Create `src/app/shop/checkout/page.tsx` — order summary + payment form
4.2. Integrate Stripe Elements for card input
4.3. Call `/api/shop/create-payment-intent` on submit
4.4. Handle success (redirect to thank-you) and failure states
4.5. Create `/shop/checkout/success` and `/shop/checkout/cancelled` pages

### ⬜ STEP 5: Gelato product sync
**Logic:** The `/api/shop/gelato-products` route exists. Need to sync POD catalog into local DB.

**Sub-steps:**
5.1. Create admin button/script to fetch Gelato catalog → MongoDB
5.2. Display Gelato-sourced products with "Sold by Gelato" badge

### ⬜ STEP 6: Admin order management
**Logic:** Admin needs to view and manage shop orders.

**Sub-steps:**
6.1. Create `/admin/orders` page with status filtering
6.2. Admin can update order status
6.3. Link to Stripe dashboard / Gelato tracking

---

## Phase 2: Build Fixes & Polish (Priority: LOW)

### ✅ STEP 7: Build — PASSING
- Build passes with exit code 0
- All packages installed including AWS SDK, three-stdlib
- Pre-existing warning: NFT trace through blog.ts (non-critical)

### ✅ STEP 8: Environment variables — DONE
- `.env.example` includes Stripe, Clerk, MongoDB, Gelato, OpenRouter, R2 vars
- R2 env vars set on Render production and staging

---

## Phase 3: Content & SEO (Priority: LOW)

### ⬜ STEP 9: Populate shop with products
**Logic:** Shop is live but empty (no products in MongoDB `shop_products` collection).

**Sub-steps:**
9.1. Run `scripts/add-test-product.mjs` to seed initial product
9.2. Add real POD products via Gelato catalog sync
9.3. Create product images

### ✅ STEP 10: SEO metadata — DONE
- Shop pages have metadata exports with OpenGraph
- Sitemap includes shop routes

---

## Completed (last 10)

- Branches merged: dev and main unified with full feature set
- R2 persistent file storage deployed (upload/download/delete, dual-write local+R2)
- MongoDB DAO layer (db-quotes, db-config, db-users, db-schemas)
- Admin dashboard with settings, service config, quote board
- Customer account page (`/account`)
- Clerk webhook for user sync to MongoDB
- Stripe quote checkout flow
- Email notifications (Resend) with templates
- Health check endpoint (`/api/health`)
- PASO copy rewrite on homepage, About, 3D printing, CAD/CAM pages

---

## Notes

- Shop API routes exist and are functional
- Cart context works (localStorage persistence, add/remove/update)
- Main blockers were: branch divergence (resolved), missing packages (resolved)
- `three-stdlib` added — STL viewer builds correctly
- All three URL surfaces confirmed healthy (HTTP 200)
