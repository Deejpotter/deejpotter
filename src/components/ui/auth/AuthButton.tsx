"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
import md5 from "md5";

/**
 * Gravatar component props
 */
export interface GravatarProps {
  /** Email address for gravatar lookup */
  email: string;
  /** Size of the avatar in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Gravatar avatar component
 * Displays a gravatar image based on email address
 */
const Gravatar: React.FC<GravatarProps> = ({
  email,
  size = 32,
  className = "",
}) => {
  const hash = md5(email.toLowerCase().trim());
  const url = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;

  return (
    <Image
      src={url}
      alt="User Avatar"
      className={className}
      width={size}
      height={size}
    />
  );
};

/**
 * AuthButton component props
 */
export interface AuthButtonProps {
  /** Additional classes for the container */
  className?: string;
  /** Show gravatar for signed-in users */
  showGravatar?: boolean;
  /** Gravatar size */
  gravatarSize?: number;
  /** Button size variant */
  buttonSize?: "sm" | "md" | "lg";
}

/**
 * Authentication button component
 * Shows login/signup buttons when signed out, logout button when signed in
 */
const AuthButton: React.FC<AuthButtonProps> = ({
  className = "",
  showGravatar = true,
  gravatarSize = 32,
  buttonSize = "sm",
}) => {
  const { user, login, signup, logout, isLoaded, isSignedIn } = useAuth();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-3 text-base",
    lg: "py-3 px-4 text-lg",
  };

  const btnClasses = (variant = "solid") =>
    variant === "solid"
      ? `bg-primary text-white font-semibold ${
          sizeClasses[buttonSize] || sizeClasses.md
        } rounded-full shadow`
      : `bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 ${
          sizeClasses[buttonSize] || sizeClasses.md
        } rounded-full`;

  return (
    <div className={`flex items-center ${className}`}>
      {isSignedIn && user ? (
        <div className="flex items-center gap-3">
          {showGravatar && (
            <Gravatar
              email={
                user.emailAddresses?.[0]?.emailAddress ||
                user.primaryEmailAddress?.emailAddress ||
                ""
              }
              size={gravatarSize}
              className="rounded-full"
            />
          )}
          <button onClick={logout} className={`${btnClasses("solid")}`}>
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button onClick={login} className={`${btnClasses("solid")}`}>
            Login
          </button>
          <button onClick={signup} className={`${btnClasses("outline")}`}>
            Sign up
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
