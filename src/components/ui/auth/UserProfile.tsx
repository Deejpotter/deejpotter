"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

export interface UserProfileProps {
  render?: (user: any) => React.ReactNode;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ render, className = "" }) => {
  const { user, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className={className}>Loading...</div>;
  }

  if (!isSignedIn || !user) {
    return null;
  }

  if (render) {
    return <div className={className}>{render(user)}</div>;
  }

  const email =
    user.emailAddresses?.[0]?.emailAddress ||
    user.primaryEmailAddress?.emailAddress ||
    "";

  const name = user.fullName || user.firstName || user.username || "User";

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`.trim()}>
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{name}</div>
      {email && <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{email}</div>}
    </div>
  );
};

export default UserProfile;
