"use client";
import Link from "next/link"; 
import React, { useState } from "react"; 
import Auth from "./Auth"; 


const Navbar = () => {
	// State for managing the collapsed state of the navbar. Initially set to true (collapsed).
	const [isNavCollapsed, setIsNavCollapsed] = useState(true);

	// State for managing the visibility of the dropdown menu. Initially set to false (hidden).
	const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
	const [isWebsiteDropdownOpen, setIsWebsiteDropdownOpen] = useState(false);

	// Function to toggle the collapsed state of the navbar.
	// This will be triggered when the navbar toggler button is clicked.
	const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

	// Function to toggle the visibility of the dropdown menu.
	// This will be triggered when the dropdown menu is clicked.
	const toggleAppDropdown = () => setIsAppDropdownOpen(!isAppDropdownOpen);
	const toggleWebsiteDropdown = () => setIsWebsiteDropdownOpen(!isWebsiteDropdownOpen);

	return (
		// Bootstrap's navbar component
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				{/* Next.js Link for client-side routing. The navbar brand is wrapped inside the Link. */}
				<Link href="/">
					<span className="navbar-brand">Maker Store Calculations</span>
				</Link>

				{/* Button to toggle the navbar on mobile devices. */}
				<button
					className="navbar-toggler"
					type="button"
					onClick={handleNavCollapse} // Set to call handleNavCollapse on click
					aria-expanded={!isNavCollapsed} // Accessibility attribute
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>{" "}
					{/* Hamburger icon from Bootstrap */}
				</button>

				{/* Collapsible part of the navbar. Its visibility is controlled by isNavCollapsed state. */}
				<div
					className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
					id="navbarNav"
				>
					<ul className="navbar-nav">
						{/* Navigation items, each wrapped in a Next.js Link for client-side routing */}

						{/* Dropdown Menu */}
						<li className={`nav-item dropdown`} onMouseEnter={toggleAppDropdown} onMouseLeave={toggleAppDropdown} onClick={toggleAppDropdown}>
							<span
								className="nav-link dropdown-toggle"
								role="button"
								aria-expanded={isAppDropdownOpen}
							>
								Apps
							</span>
							<ul className={`dropdown-menu ${isAppDropdownOpen ? "show" : ""}`}>
								<li>
									<Link href="/website1">
										<span className="dropdown-item">
											Todo App
										</span>
									</Link>
								</li>
								{/* Add more dropdown items as needed */}
							</ul>
						</li>

						{/* Websites Menu */}
						<li className={`nav-item dropdown`} onMouseEnter={toggleWebsiteDropdown} onMouseLeave={toggleWebsiteDropdown} onClick={toggleWebsiteDropdown}>
							<span
								className="nav-link dropdown-toggle"
								role="button"
								aria-expanded={isWebsiteDropdownOpen}
							>
								Websites
							</span>
							<ul className={`dropdown-menu ${isWebsiteDropdownOpen ? "show" : ""}`}>
								<li>
									<Link href="/website1">
										<span className="dropdown-item">
											Website 1
										</span>
									</Link>
								</li>
								{/* Add more dropdown items as needed */}
							</ul>
						</li>

						<li className="nav-item">
							<Link href="/websites">
								<span className="nav-link">Websites</span>
							</Link>
						</li>

						<li className="nav-item">
							<Link href="/about">
								<span className="nav-link">About Me</span>
							</Link>
						</li>
						{/* Add more nav-items as needed */}
					</ul>
				</div>
				<Auth />
			</div>
		</nav>
	);
};

export default Navbar;