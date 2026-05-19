/**
 * middleware.ts — Next.js middleware for route protection
 *
 * Uses Clerk to protect /admin routes — only signed-in users can access them.
 * The admin role check happens in the page component itself via currentUser().
 *
 * To set your admin role:
 * 1. Go to https://dashboard.clerk.com
 * 2. Find your user
 * 3. Set publicMetadata: { "role": "admin" }
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/groceries(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and webhooks (no auth needed)
    "/((?!_next/static|_next/image|favicon.ico|images/|api/webhooks/).*)",
  ],
};
