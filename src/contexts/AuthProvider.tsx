"use client";

import AuthProviderBase from "@/components/ui/auth/AuthProvider";
import { ReactNode } from "react";

// Fallback wrapper: if Clerk publishable key is missing, avoid using
// Clerk hooks during build/prerender. `AuthProviderBase` expects to be
// nested inside `ClerkProvider` so we only use it when Clerk is configured.
const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (!hasClerk) {
    // No-op / safe provider during build: render children directly
    return <>{children}</>;
  }

  return <AuthProviderBase>{children}</AuthProviderBase>;
}
