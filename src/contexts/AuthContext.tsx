"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";

// The AuthContextType interface defines the shape of the context object for authentication.
interface AuthContextType {
  user: any | null; // Represents the current user object or null if no user is logged in.
  login: () => void; // Function to initiate the login process.
  signup: () => void; // Function to initiate the signup process.
  logout: () => void; // Function to log out the current user.
  isLoaded: boolean; // Whether Clerk has loaded
  isSignedIn: boolean; // Whether user is signed in
}

// The default value for the AuthContext, used when initializing the context.
const defaultAuthContextValue: AuthContextType = {
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isLoaded: false,
  isSignedIn: false,
};

// Creating the AuthContext with the default value.
export const AuthContext = createContext<AuthContextType>(
  defaultAuthContextValue
);

// AuthProvider component that will wrap the application components and provide authentication context.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  // Function to open the Clerk sign-in modal.
  const login = () => openSignIn();
  // Function to open the Clerk sign-up modal.
  const signup = () => openSignUp();
  // Function to log out the current user.
  const logout = () => signOut();

  // Providing the authentication context to the children components.
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

// Custom hook to use the auth context in components.
export const useAuth = () => useContext(AuthContext);
