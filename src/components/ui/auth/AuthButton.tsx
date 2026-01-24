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
			<div className={`navbar-nav ${className}`}>
				<div className="nav-item">
					<span className="text-muted">Loading...</span>
				</div>
			</div>
		);
	}

	const btnSizeClass = `btn-${buttonSize}`;

	return (
		<div className={`navbar-nav ${className}`}>
			{isSignedIn && user ? (
				<div className="nav-item d-flex align-items-center">
					{showGravatar && (
						<Gravatar
							email={
								user.emailAddresses?.[0]?.emailAddress ||
								user.primaryEmailAddress?.emailAddress ||
								""
							}
							size={gravatarSize}
							className="rounded-circle mx-1 shadow"
						/>
					)}
					<button
						onClick={logout}
						className={`btn ${btnSizeClass} btn-outline-danger shadow`}
					>
						Logout
					</button>
				</div>
			) : (
				<div className="nav-item">
					<button
						onClick={login}
						className={`btn ${btnSizeClass} btn-outline-secondary shadow mx-1`}
					>
						Login
					</button>
					<button
						onClick={signup}
						className={`btn ${btnSizeClass} btn-outline-secondary shadow`}
					>
						Sign up
					</button>
				</div>
			)}
		</div>
	);
};

export default AuthButton;
