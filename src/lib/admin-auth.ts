/**
 * admin-auth.ts — Shared admin authentication helpers
 *
 * Every admin decision goes through getAdminAccess(), so pages, API routes and
 * the navbar always agree on who is an admin. Who is signed in comes from
 * session.ts, which keeps this file free of any auth library.
 */

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getSessionUserId } from "./session";

export type AdminAuthError = "UNAUTHORIZED" | "FORBIDDEN";

/** What the current visitor may do in the admin area. */
export type AdminAccess =
  | { status: "admin"; userId: string }
  | { status: "forbidden"; userId: string }
  | { status: "signed-out" };

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
 * Only getAdminAccess() should need this; callers ask about the current visitor.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  return Boolean(userId) && getAdminUserIds().has(userId);
}

/** Whether the current visitor is signed out, signed in, or an admin. */
export async function getAdminAccess(): Promise<AdminAccess> {
  const userId = await getSessionUserId();
  if (!userId) return { status: "signed-out" };
  return (await isAdminUser(userId)) ? { status: "admin", userId } : { status: "forbidden", userId };
}

/** True when the current visitor is an admin; for showing admin-only links. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  return (await getAdminAccess()).status === "admin";
}

/**
 * Verify the current user is authenticated and an admin (API routes).
 * Throws "UNAUTHORIZED" or "FORBIDDEN" for the route to turn into a response.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const access = await getAdminAccess();
  if (access.status === "signed-out") throw new Error("UNAUTHORIZED" as AdminAuthError);
  if (access.status === "forbidden") throw new Error("FORBIDDEN" as AdminAuthError);
  return { userId: access.userId };
}

/**
 * For API routes: a 401 or 403 response to return straight away, or null when
 * the visitor is an admin and the route can carry on.
 */
export async function adminApiGuard(): Promise<NextResponse | null> {
  const access = await getAdminAccess();
  if (access.status === "signed-out") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (access.status === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

/**
 * Guard admin pages — redirects unauthenticated or non-admin users.
 */
export async function requireAdminPage(): Promise<{ userId: string }> {
  if (!hasClerk) {
    redirect("/");
  }

  const access = await getAdminAccess();
  if (access.status === "signed-out") redirect("/sign-in");
  if (access.status === "forbidden") redirect("/");
  return { userId: access.userId };
}
