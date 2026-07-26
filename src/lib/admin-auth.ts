/**
 * admin-auth.ts — Shared admin authentication helpers
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "./db-users";

export type AdminAuthError = "UNAUTHORIZED" | "FORBIDDEN";

export const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/**
 * Verify the current user is authenticated and has admin role (API routes).
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const session = await auth();
  if (!session.userId) {
    throw new Error("UNAUTHORIZED" as AdminAuthError);
  }
  if (!(await isAdmin(session.userId))) {
    const user = await currentUser();
    if (user?.publicMetadata?.role !== "admin") {
      throw new Error("FORBIDDEN" as AdminAuthError);
    }
  }
  return { userId: session.userId };
}

/**
 * Guard admin pages — redirects unauthenticated or non-admin users.
 */
export async function requireAdminPage(): Promise<{ userId: string }> {
  if (!hasClerk) {
    redirect("/");
  }

  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in");
  }

  const mongoAdmin = await isAdmin(session.userId);
  if (mongoAdmin) {
    return { userId: session.userId };
  }

  const user = await currentUser();
  if (user?.publicMetadata?.role === "admin") {
    return { userId: session.userId };
  }

  redirect("/");
}
