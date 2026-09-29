/**
 * session.ts — The one place server code asks "who is signed in?"
 *
 * Pages and API routes call these helpers instead of an auth library, so the
 * site can move from Clerk to Better Auth by changing this file alone
 * (docs/AUTH_MIGRATION_PLAN.md, phase 1). Admin decisions live in
 * admin-auth.ts and build on these.
 */

import { auth, currentUser } from "@clerk/nextjs/server";

/** The signed-in person, in the shape every caller needs regardless of auth provider. */
export type SessionUser = {
  id: string;
  email: string;
  /** Whether the provider has confirmed the person owns this address. */
  emailVerified: boolean;
  /** Full name, or "" when the person hasn't given one. */
  name: string;
};

/**
 * The signed-in user's id, or null when signed out.
 *
 * Cheap: reads the session without a network call, so it's the right choice
 * when only "is anyone signed in, and who" matters. Returns null instead of
 * throwing when auth isn't set up (local development without keys), because
 * signed-out is the safe answer for every caller.
 */
export async function getSessionUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

/**
 * The signed-in user with their email, or null when signed out.
 *
 * Costs a request to the auth provider, so use it only where the email or
 * name is needed. The email is the primary address, and emailVerified is that
 * address's own status, so callers can refuse to trust an unconfirmed one.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const user = await currentUser();
    if (!user) return null;
    const primary =
      user.primaryEmailAddress ??
      user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId) ??
      user.emailAddresses?.[0];
    return {
      id: user.id,
      email: primary?.emailAddress ?? "",
      emailVerified: primary?.verification?.status === "verified",
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
    };
  } catch {
    return null;
  }
}
