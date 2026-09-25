/**
 * admin-auth.ts — Shared admin authentication helpers
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AdminAuthError = "UNAUTHORIZED" | "FORBIDDEN";

export const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

/**
 * Clerk user IDs allowed into the admin area, from the ADMIN_USER_IDS
 * environment variable (comma-separated, e.g. "user_abc,user_def").
 *
 * Admins are a server setting rather than user data: nothing in the app or
 * database can grant or remove admin access, only the environment can.
 */
export function getAdminUserIds(): Set<string> {
  return new Set(
    (process.env.ADMIN_USER_IDS || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

/**
 * True if the user is listed in ADMIN_USER_IDS.
 * Every admin check should use this so pages and APIs agree.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  return Boolean(userId) && getAdminUserIds().has(userId);
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
