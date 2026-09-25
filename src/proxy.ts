/**
 * proxy.ts — Next.js 16 request proxy (formerly middleware.ts)
 *
 * 1. Redirects www.deejpotter.com to the apex domain.
 * 2. Runs Clerk so auth() works in pages and API routes.
 * 3. Requires sign-in for /admin and /groceries. The admin role check
 *    happens in the page itself via requireAdminPage().
 *
 * To set your admin role:
 * 1. Go to https://dashboard.clerk.com
 * 2. Find your user
 * 3. Set publicMetadata: { "role": "admin" }
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const isSignedInRoute = createRouteMatcher(["/admin(.*)", "/groceries(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isSignedInRoute(req)) {
    await auth.protect();
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  const host = request.headers.get("host") || "";
  if (host === "www.deejpotter.com") {
    const url = new URL(request.url);
    url.hostname = "deejpotter.com";
    return NextResponse.redirect(url, 308);
  }

  // When Clerk isn't configured (local dev without keys), fall through
  // instead of throwing. Admin pages still redirect via requireAdminPage().
  if (!hasClerk) {
    return NextResponse.next();
  }

  return clerk(request, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|ya?ml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
