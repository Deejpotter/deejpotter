"use client";

import AuthProviderBase from "@/components/ui/auth/AuthProvider";
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthProviderBase>{children}</AuthProviderBase>;
}
