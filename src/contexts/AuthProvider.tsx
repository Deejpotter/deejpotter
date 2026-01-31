"use client";

/**
 * Auth Provider Wrapper
 * 
 * This component provides a safe wrapper for Clerk authentication that allows
 * the app to build and run even when Clerk keys are not configured.
 * 
 * Architecture:
 * - layout.tsx wraps the app with ClerkProvider (when key exists) → this AuthProvider → children
 * - This wrapper checks if NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
 * - If set: renders AuthProviderBase which provides the useAuth() hook with Clerk
 * - If not set: renders children directly (no auth, but app still works)
 * 
 * This pattern enables:
 * - CI/CD builds without requiring Clerk keys
 * - Local development without auth
 * - Production deployments with full Clerk authentication
 * 
 * To enable authentication:
 * 1. Get Clerk keys from https://dashboard.clerk.com
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
 *    CLERK_SECRET_KEY=sk_test_...
 * 3. Restart the dev server
 * 
 * @see src/components/ui/auth/AuthProvider.tsx - The actual Clerk-based auth context
 * @see src/components/ui/auth/AuthButton.tsx - Login/signup/logout UI component
 */

import AuthProviderBase from "@/components/ui/auth/AuthProvider";
import { ReactNode } from "react";

// Check if Clerk is configured at build time
const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (!hasClerk) {
    // No-op / safe provider during build: render children directly
    // The app will work without auth features when Clerk is not configured
    return <>{children}</>;
  }

  // Clerk is configured - use the full auth provider with useAuth() hook
  return <AuthProviderBase>{children}</AuthProviderBase>;
}
