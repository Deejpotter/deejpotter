"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

/**
 * Auth context type definition
 */
export interface AuthContextType {
  /** Current authenticated user object */
  user: any | null;
  /** Open Clerk sign-in modal */
  login: () => void;
  /** Open Clerk sign-up modal */
  signup: () => void;
  /** Sign out the current user */
  logout: () => void;
  /** Whether Clerk has finished loading */
  isLoaded: boolean;
  /** Whether a user is currently signed in */
  isSignedIn: boolean;
}

/**
 * Default auth context value
 */
const defaultAuthContextValue: AuthContextType = {
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isLoaded: false,
  isSignedIn: false,
};

/**
 * Auth context for accessing authentication state
 */
export const AuthContext = createContext<AuthContextType>(
  defaultAuthContextValue
);

/**
 * Custom hook to access auth context
 * @returns Auth context value
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider props
 */
export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that wraps children with auth context
 * Should be used inside Clerk's ClerkProvider
 * 
 * @example
 * ```tsx
 * import { ClerkProvider } from '@clerk/nextjs';
 * import { AuthProvider } from '@deejpotter/ui-components';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <ClerkProvider>
 *       <AuthProvider>
 *         {children}
 *       </AuthProvider>
 *     </ClerkProvider>
 *   );
 * }
 * ```
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  const login = () => openSignIn();
  const signup = () => openSignUp();
  const logout = () => signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoaded,
        isSignedIn: isSignedIn ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
