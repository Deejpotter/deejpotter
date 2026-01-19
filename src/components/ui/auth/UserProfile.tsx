"use client";

import React from "react";
import { useAuth } from "./AuthProvider";

/**
 * UserProfile component props
 */
export interface UserProfileProps {
	/** Custom render function for user display */
	render?: (user: any) => React.ReactNode;
	/** CSS classes for the container */
	className?: string;
}

/**
 * UserProfile component
 * Displays user profile information when authenticated
 */
const UserProfile: React.FC<UserProfileProps> = ({
	render,
	className = "",
}) => {
	const { user, isLoaded, isSignedIn } = useAuth();

	// Show loading state
	if (!isLoaded) {
		return <div className={className}>Loading...</div>;
	}

	// Not signed in
	if (!isSignedIn || !user) {
		return null;
	}

	// Custom render function
	if (render) {
		return <div className={className}>{render(user)}</div>;
	}

	// Default render
	const email =
		user.emailAddresses?.[0]?.emailAddress ||
		user.primaryEmailAddress?.emailAddress ||
		"";

	const name = user.fullName || user.firstName || user.username || "User";

	return (
		<div className={`user-profile ${className}`}>
			<div className="user-name">{name}</div>
			{email && <div className="user-email text-muted small">{email}</div>}
		</div>
	);
};

export default UserProfile;
