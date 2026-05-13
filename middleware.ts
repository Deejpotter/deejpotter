import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// Default: no routes protected, authentication available everywhere.
// When Clerk is not configured, fall through cleanly instead of throwing at runtime.
const clerk = clerkMiddleware();

export default function middleware(request: NextRequest) {
  if (!hasClerk) {
    return NextResponse.next();
  }

  return clerk(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
