/**
 * admin-auth.ts — Shared admin authentication helpers
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "./db-users";

export type AdminAuthError = "UNAUTHORIZED" | "FORBIDDEN";

export const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/**
 * True if the user is an admin by MongoDB role or Clerk publicMetadata.role.
 * Every admin check should use this so pages and APIs agree.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  if (await isAdmin(userId)) return true;
  const user = await currentUser();
  return user?.publicMetadata?.role === "admin";
}

/**
 * Verify the current user is authenticated and has admin role (API routes).
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const session = await auth();
  if (!session.userId) {
    throw new Error("UNAUTHORIZED" as AdminAuthError);
  }
  if (!(await isAdminUser(session.userId))) {
    throw new Error("FORBIDDEN" as AdminAuthError);
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

  if (await isAdminUser(session.userId)) {
    return { userId: session.userId };
  }

  redirect("/");
}
