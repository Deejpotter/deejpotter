# Full Codebase Audit — Fix & Implement Plan

## Executive Summary

The project has **significant technical debt** across security, dead code, and duplicated systems. The most impactful issues are: (1) 3 API routes with no/insufficient auth, (2) parallel quote storage systems (file vs MongoDB), and (3) ~15 dead files/components. This plan addresses all issues in priority order.

---

## Phase 1: Security Fixes (Critical)

### 1a. `/api/mongo-crud` GET has no auth — exposes users collection
**File**: `src/app/api/mongo-crud/route.ts`
**Fix**: Add auth check to GET handler matching the pattern used in POST/PUT/DELETE.
**Logic**: Any visitor can currently read the `users` collection. This is a data exposure risk.

### 1b. `/api/contact` PATCH/GET lacks admin role check
**File**: `src/app/api/contact/route.ts`
**Fix**: Add `isAdmin()` check to both GET and PATCH handlers.
**Logic**: Currently any authenticated user can read/update all contact leads.

### 1c. `/api/3d-printing-quote/[id]/file` — no ownership verification
**File**: `src/app/api/3d-printing-quote/[id]/file/route.ts`
**Fix**: After fetching the quote, verify `quote.userId === session.userId` or user is admin.
**Logic**: Any logged-in user can download any other user's uploaded files.

### 1d. Email templates — unescaped user input in HTML
**File**: `src/lib/email.ts`
**Fix**: Move `escapeHtml()` to `src/lib/utils.ts`, use it in all email template interpolations.
**Logic**: User-submitted names could contain HTML that renders in email clients.

---

## Phase 2: Dead Code Cleanup (Quick Wins)

### 2a. Delete 15 unused components/types/files
**Files to delete**:
- `src/contexts/AuthContext.tsx` — dead, superseded by `components/ui/auth/AuthProvider.tsx`
- `src/proxy.ts` — orphaned middleware-like file (no `middleware.ts`)
- `src/components/Sidebar/Sidebar.tsx` — never imported
- `src/components/Modal.tsx` — never imported
- `src/components/Image/ImageFallback.tsx` — never imported
- `src/components/Form/FormError.tsx` — never imported
- `src/components/Popover.tsx` — never imported
- `src/components/TileSection.tsx` — never imported
- `src/templates/BasicSection/BasicSection.tsx` — never imported
- `src/components/ModelDropZone/DXFPreview.tsx` — never imported
- `src/lib/BootstrapClient.ts` — never imported, empty
- `src/types/Project.ts` — never imported
- `src/types/RepoObject.ts` — never imported
- `src/app/contact/page.metadata.tsx` — dead duplicate
- `src/app/contact/metadata.tsx` — dead duplicate
**Logic**: These files add noise, confuse developers, and slow builds.

### 2b. Delete orphaned CSS/SCSS files
**Files to delete**:
- `src/styles/blog.css` — duplicate of `blog.scss`
- `src/styles/_variables.scss` — unused migration infrastructure
- `src/styles/_tokens.scss` — unused migration infrastructure
- `src/styles/_bootstrap-module.scss` — unused migration infrastructure
**Logic**: The project uses Tailwind; these are dead SCSS artifacts.

### 2c. Delete other orphaned files
**Files to delete**:
- `src/app/projects/tools/box-shipping-calculator/BoxCalculationsTest.js` — legacy manual test
- `src/__tests__/a11y.spec.tsx` — duplicate of `a11y.test.tsx`
**Logic**: Legacy test files that duplicate existing coverage.

### 2d. Update .gitignore
**Add to .gitignore**: `next-dev.log`, `tmp/`, `sb-original/`, `data/`
**Logic**: Development artifacts and temporary files shouldn't be tracked.

---

## Phase 3: DRY — Extract Admin Auth Helpers

### 3a. Create shared `requireAdmin()` helper
**New file**: `src/lib/admin-auth.ts`
**Logic**: Extract the repeated 5-line auth guard from 9 API handlers and 3 admin pages into a single reusable function.

```ts
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "./db-users";

export async function requireAdmin() {
  const session = await auth();
  if (!session.userId) throw new Error("UNAUTHORIZED");
  if (!(await isAdmin(session.userId))) throw new Error("FORBIDDEN");
  return session;
}
```

### 3b. Refactor admin API routes to use `requireAdmin()`
**Files**: All 4 route files under `src/app/api/admin/`
**Logic**: Replace 9 copy-pasted auth blocks with `requireAdmin()` calls in try/catch.

### 3c. Refactor admin pages to use shared auth check
**Files**: `src/app/admin/page.tsx`, `admin/3d-printing/page.tsx`, `admin/settings/page.tsx`
**Logic**: Extract the `hasClerk` + `currentUser()` + role check into a shared helper.

### 3d. Standardize auth imports across all API routes
**Files**: `src/app/api/3d-printing-quote/route.ts`, `quotes/route.ts`, `contact/route.ts`, `mongo-crud/route.ts`, `3d-printing-quote/[id]/file/route.ts`
**Logic**: Replace 3 different fragile auth patterns with the standard `import { auth } from "@clerk/nextjs/server"` pattern.

---

## Phase 4: Fix Specific Bugs

### 4a. Redundant ternary in admin quotes route
**File**: `src/app/api/admin/quotes/route.ts` L80-82
**Fix**: Both branches of the ternary call the same function. Simplify to a direct call.
**Logic**: Dead code from an incomplete refactor.

### 4b. Add missing env vars to .env.example
**File**: `.env.example`
**Add**: `RESEND_API_KEY`, `CLERK_WEBHOOK_SECRET`, `ADMIN_EMAIL`, `ALLOWED_COLLECTIONS`
**Logic**: New developers won't know these are needed.

### 4c. Fix email XSS by escaping user input
**File**: `src/lib/email.ts`
**Fix**: Apply `escapeHtml()` to all user-provided values (`name`, `email`) in HTML templates.
**Logic**: Prevents stored XSS in email clients.

### 4d. Add logging to critical silent catch blocks
**Files**: API routes, `db-quotes.ts`, `db.ts`
**Fix**: Add `console.error` to catch blocks in API route handlers and database operations.
**Logic**: Makes production debugging possible.

### 4e. Remove legacy Stripe webhook dead branches
**File**: `src/app/api/webhooks/stripe/route.ts` L110-114, L140-143
**Fix**: Remove the `metadata.type === "3d-printing-quote"` legacy handling blocks.
**Logic**: Dead code paths that log "skipping (flat files deprecated)" — the flat file system is being removed.

---

## Phase 5: Larger Refactors (If Time Permits)

### 5a. Migrate `quote-storage.ts` callers to `db-quotes.ts`
**Files**: `api/3d-printing-quote/[id]/file/route.ts`, `api/shop/3d-printing-checkout/route.ts`, `api/3d-printing-quote/status/route.ts`
**Logic**: Complete the migration from flat-file to MongoDB, then delete `quote-storage.ts`.

### 5b. Consolidate duplicate cut calculator types
**Files**: `src/types/cutCalculator.ts` and `src/types/linear-cut-calculator/cutCalculator.ts`
**Fix**: Re-export from a shared location.
**Logic**: Eliminates identical type definitions.

### 5c. Add Zod validation to admin PATCH routes
**Files**: `api/admin/settings/route.ts`, `api/admin/quotes/route.ts`, `api/admin/service-config/route.ts`
**Logic**: Prevents malformed data from being written to the database.

---

## Verification

1. `yarn test` — all tests must pass
2. `yarn build` — all pages must build
3. `yarn lint` — no new errors
4. Manual check: `/api/mongo-crud` GET returns 401 without auth
5. Manual check: `/api/contact` PATCH returns 401 without auth
6. Manual check: File download returns 403 for non-owner
