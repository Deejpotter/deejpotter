/**
 * admin-auth.ts — Shared admin authentication helpers
 *
 * Extracts the repeated auth guard pattern from admin API routes and pages.
 */

import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "./db-users";

export type AdminAuthError = "UNAUTHORIZED" | "FORBIDDEN";

/**
 * Verify the current user is authenticated and has admin role.
 * Returns the session on success, throws a string error code on failure.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const session = await auth();
  if (!session.userId) {
    throw new Error("UNAUTHORIZED" as AdminAuthError);
  }
  if (!(await isAdmin(session.userId))) {
    throw new Error("FORBIDDEN" as AdminAuthError);
  }
  return { userId: session.userId };
}
