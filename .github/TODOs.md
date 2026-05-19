# Project TODOs (.github/TODOs.md)

Purpose: Track workflow for updates and additions. Use status buckets and keep only the last 10 completed tasks.

---

## Phase 1: E-commerce Frontend (Priority: HIGH)

The e-commerce merge brought in the backend (MongoDB schemas, Stripe API routes, Gelato API routes, payment intents) but the frontend is **completely empty** — `/shop` directory has zero files, no cart, no checkout, no product catalog pages.

### STEP 1: Shop landing page
**Logic:** The `/shop` directory exists but is empty. Create a shop landing page that lists products. The API routes (`/api/shop/products`, `/api/shop/gelato-products`) already exist. Fetch from the API and render a grid.

**Sub-steps:**
1.1. Create `src/app/shop/page.tsx` — layout, hero section, category filters
1.2. Create `src/app/shop/products/page.tsx` — product grid fetching from `/api/shop/products`
1.3. Add `ShopCard` component for product display
1.4. Add responsive grid layout (Tailwind)

### STEP 2: Product detail page
**Logic:** Each product needs a detail page at `/shop/products/[slug]` with pricing, description, images, and "Add to Cart" button.

**Sub-steps:**
2.1. Create `src/app/shop/products/[slug]/page.tsx`
2.2. Fetch product by slug from MongoDB API
2.3. Render product details, price, CTA
2.4. Handle POD vs digital vs service product types

### STEP 3: Cart system
**Logic:** Full cart add/remove/update with session-based storage. Show cart badge in nav, cart drawer or page.

**Sub-steps:**
3.1. Create `src/lib/cart-context.tsx` — React context for cart state
3.2. Create `src/components/CartDrawer.tsx` — slide-out cart panel
3.3. Implement add/remove/update quantity
3.4. Persist cart to localStorage or MongoDB via API

### STEP 4: Checkout with Stripe
**Logic:** Connect the cart to the existing `create-payment-intent` API route. Implement Stripe Elements for card collection.

**Sub-steps:**
4.1. Create `src/app/shop/checkout/page.tsx`
4.2. Integrate Stripe Elements (`@stripe/stripe-js`)
4.3. Create payment form component
4.4. Call `/api/shop/create-payment-intent` on checkout
4.5. Handle success/failure states

### STEP 5: Gelato product sync
**Logic:** The `/api/shop/gelato-products` route exists. Sync Gelato's POD catalog into the local product database. Add "Sold by Gelato" badges.

**Sub-steps:**
5.1. Create sync script or admin button to fetch Gelato catalog
5.2. Display Gelato products on shop pages
5.3. Handle file upload for custom-print products

### STEP 6: Admin order management
**Logic:** The `/admin/leads` page exists. Extend to include order management — view orders, update status, track fulfillment.

**Sub-steps:**
6.1. Create `/admin/orders` page
6.2. List orders with status filtering
6.3. Admin can update order status
6.4. Link to Stripe dashboard / Gelato tracking

---

## Phase 2: Build Fixes & Polish (Priority: MEDIUM)

### STEP 7: Fix pre-existing build errors
**Logic:** The build has pre-existing failures with `20-series-cut-calculator` and `stripe/lucide-react installs`. These need fixing.

**Sub-steps:**
7.1. Fix 20-series-cut-calculator TypeScript errors
7.2. Ensure all missing packages from lockfile drift are installed
7.3. Run full build, fix any new errors

### STEP 8: Environment variables
**Logic:** The e-commerce backend needs Stripe keys, MongoDB URI in production. Create `.env.example` for all new vars.

**Sub-steps:**
8.1. Add `NEXT_PUBLIC_STRIPE_KEY`, `MONGODB_URI`, `STRIPE_SECRET_KEY`, `GELATO_API_KEY` to env
8.2. Update existing `.env.example`
8.3. Verify API routes work with env vars

---

## Phase 3: Content & SEO (Priority: LOW)

### STEP 9: Populate shop with initial products
**Logic:** Add seed data for initial products (print-on-demand, service offerings, digital downloads).

**Sub-steps:**
9.1. Create seed script for initial product catalog
9.2. Add a few POD products via Gelato
9.3. Add service listing (website design, 3D printing, etc.)
9.4. Create basic product images / placeholders

### STEP 10: SEO metadata for shop pages
**Logic:** Add OpenGraph/Twitter metadata for shop pages.

**Sub-steps:**
10.1. Add metadata export to shop pages
10.2. Add canonical URLs
10.3. Verify sitemap includes shop routes

---

## Statuses

- Todo — upcoming tasks
- In Progress — currently being worked on
- Completed — done items (keep only the last 10)

## In Progress

None

## Completed (last 10)

- None

## Notes

- Shop API routes already exist and are functional
- Stripe, MongoDB, Gelato packages already installed
- Cart and checkout are the main missing pieces
- Pre-existing build errors in cut-calculator are unrelated to e-commerce work
