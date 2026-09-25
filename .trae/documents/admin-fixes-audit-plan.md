# Admin Fixes & Codebase Audit

## Summary

Fix the broken admin quotes page and address other issues discovered during a codebase-wide audit.

---

## Current State Analysis

### What's broken

1. **Admin /3d-printing quotes page** — The server page at `src/app/admin/3d-printing/page.tsx` renders a client component (`QuoteRequestsAdmin`) with **no server-side auth check**. When Clerk is configured but the user isn't signed in, the middleware redirects to `/sign-in` and it works. But when Clerk keys are missing (`.env.local` not set), the middleware skips auth entirely — the page renders, but the client-side API call to `/api/admin/quotes` returns 401 and the user sees "Could not load quotes." with no guidance on why.

2. **Admin /settings page** — `src/app/admin/settings/page.tsx` is a `"use client"` component with no auth guard at all. The child components (`AdminSettings`, `ServiceConfigEditor`) fetch from `/api/admin/settings` and handle 401 silently, showing empty states without context.

3. **Admin /leads page fragile auth** — `src/app/admin/leads/page.tsx` uses a dynamic `import("@clerk/nextjs")` with `as any` casts and try/catch. If the import fails or the API changes between Clerk versions, the fallback silently returns `{ userId: null }` and the page shows "Sign in to view customer leads" — which is technically correct but fragile.

4. **Admin quotes API returns raw MongoDB `_id`** — `src/app/api/admin/quotes/route.ts` returns MongoDB documents without converting `_id` to strings. If any `ObjectId` objects leak through JSON serialization, the API will 500.

5. **QuoteRequestsAdmin fires save on every onChange** — The price `<input>` fires `save(quoteNumber, { quotedPrice: ... })` on every keystroke (`onChange`), not on blur. Same for the status `<select>`. This causes many unnecessary API calls and potential race conditions.

6. **No `/admin/products` or `/admin/orders` pages** — The admin dashboard links to quotes, leads, and settings but has no entries for shop management (products, orders, Gelato sync). These are listed in `.github/TODOs.md` as steps 5, 6, 9 but not wired into the admin nav.

7. **Missing `public/images/products/` directory** — Shop cards reference `/images/products/...` images but no product images directory exists. Only `shop-placeholder.svg` is available.

### What's NOT broken (but worth noting)

- **Build**: passes cleanly (TypeScript, all 74 pages)
- **Unit tests**: 41 suites, 180 tests, all passing
- **E2E tests**: hero style test passes
- **Clerk sign-in**: works with dev keys, `/sign-in` and `/sign-up` pages exist
- **Admin dashboard**: server-side auth check works correctly

---

## Proposed Changes

### Fix 1: Add server-side auth guard to admin/3d-printing page

**File**: `src/app/admin/3d-printing/page.tsx`

**What**: Add `currentUser()` + `redirect("/sign-in")` check before rendering `QuoteRequestsAdmin`, matching the pattern in `src/app/admin/page.tsx`. Also add the Clerk-unconfigured fallback message.

**Why**: Without this, the page renders with no data when Clerk keys are missing, and the user doesn't know why.

**How**:
```tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default async function Admin3DPrintingPage() {
  if (!hasClerk) {
    return <UnconfiguredMessage />;
  }
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  // ... render
}
```

### Fix 2: Convert admin/settings page to server component with auth guard

**File**: `src/app/admin/settings/page.tsx`

**What**: Split into a server wrapper that checks auth + a client `"use client"` inner component. The current file is `"use client"` and has no auth check.

**Why**: Consistent auth pattern across all admin pages.

**How**: Rename existing client component, create a thin server wrapper page with `currentUser()` guard.

### Fix 3: Convert admin/leads page to use standard Clerk auth

**File**: `src/app/admin/leads/page.tsx`

**What**: Replace the fragile `getAuthAsync()` dynamic import with the standard `auth()` from `@clerk/nextjs/server`.

**Why**: Consistent, type-safe, less fragile than dynamic import with `as any`.

**How**: 
```tsx
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) { /* show sign-in prompt */ }
```

### Fix 4: Fix admin quotes API ObjectId serialization

**File**: `src/app/api/admin/quotes/route.ts`

**What**: Convert MongoDB `_id` fields to strings before returning JSON responses, matching the pattern used in `src/app/api/shop/products/route.ts`.

**Why**: ObjectId objects can cause JSON serialization errors.

**How**: Map over results with a mapper function.

### Fix 5: QuoteRequestsAdmin save on blur for price input

**File**: `src/app/projects/services/3d-printing/QuoteRequestsAdmin.tsx`

**What**: Change the price `<input>` from `onChange` to `onBlur` for saving. Leave the status `<select>` on `onChange` (it's a single click).

**Why**: Prevents N API calls per keystroke when typing a price like "25.50".

**How**: Add a local `editingPrice` state, update it on change, save it on blur.

### Fix 6: Add admin nav links for shop management

**File**: `src/app/admin/page.tsx`

**What**: Add placeholder `AdminNavItem` links for shop orders and shop products in the admin sections list.

**Why**: Even if the pages don't exist yet, the links guide the user and document the planned structure. When the pages are created (TODOs 5, 6), the links already exist.

**How**: Add after the existing Settings nav item:
```tsx
<AdminNavItem href="/admin/orders" title="Shop Orders" desc="View and manage customer orders" />
<AdminNavItem href="/admin/products" title="Shop Products" desc="Manage product catalog and Gelato sync" />
```

### Fix 7: Create products image directory with placeholder

**File**: (new) `public/images/products/.gitkeep`

**What**: Create the directory so image references don't 404 silently.

**Why**: Products reference images at `/images/products/...` which doesn't exist.

**How**: Create directory with `.gitkeep`.

---

## Assumptions & Decisions

- **Auth approach**: Continue using the existing `currentUser()` + redirect pattern from `src/app/admin/page.tsx` for all admin sub-pages, rather than middleware-only protection. This is more explicit and works even if Clerk keys aren't set.
- **Scope**: This plan covers **only broken/missing items discovered during audit**, not the full feature work from `.github/TODOs.md` (Gelato sync, order management, product CRUD).
- **No style changes**: All fixes are functional; no visual redesign unless needed for the "not configured" message.

---

## Verification

1. `yarn test` — all 180 tests must pass
2. `yarn build` — all 74 pages must build, `/sign-in` and `/sign-up` dynamic routes included
3. Manual check:
   - Visit `/admin` without Clerk keys → shows "not configured" message
   - Visit `/admin/3d-printing` without Clerk keys → shows "not configured" message
   - Visit `/admin/3d-printing` without being signed in → redirects to `/sign-in`
   - Visit `/admin/3d-printing` after signing in → renders `QuoteRequestsAdmin` component
   - Same for `/admin/settings` and `/admin/leads`
   - Admin dashboard shows new shop nav links
4. `yarn lint` — no new errors
