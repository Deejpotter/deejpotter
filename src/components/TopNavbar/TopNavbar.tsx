"use client";
/**
 * TopNavbar — The primary site navigation bar used in the root layout.
 *
 * Structure:
 *  ┌─────────────────────────────────────────────────────┐
 *  │  [Nav links]         [Logo / Name]       [Auth] [≡] │  ← header bar (h-16)
 *  ├─────────────────────────────────────────────────────┤
 *  │  Full-width dropdown (desktop, fixed under bar)     │  ← appears on hover / click
 *  └─────────────────────────────────────────────────────┘
 *
 * Desktop dropdowns:
 *  - Open on hover (with a 150 ms close delay so the cursor can travel from
 *    the trigger button to the dropdown panel without it vanishing).
 *  - Also togglable on click for keyboard/touch users.
 *  - Close on outside click (mousedown listener) and Escape key.
 *
 * Mobile drawer:
 *  - Slides in from the top as a full-width overlay.
 *  - Uses the native <details>/<summary> pattern for sub-menus.
 *  - Click propagation is stopped on the drawer content so tapping inside
 *    doesn't close the overlay.
 *
 * Route changes automatically close all menus via a pathname effect.
 */
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import AuthButton from "@/components/ui/auth/AuthButton";

export default function TopNavbar() {
  const { navItems } = useNavbar();
  const pathname = usePathname() || "/";

  // Desktop dropdown state — stores the label of the currently open menu (or null)
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ref for outside-click detection
  const navRef = useRef<HTMLElement>(null);

  // Timer ref for the delayed close on mouse-leave (prevents the hover-gap problem)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Keyboard: close everything on Escape ──────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Outside click: close desktop dropdown ─────────────────────────────
  useEffect(() => {
    if (!openMenu) return; // only listen when a dropdown is actually open
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  // ── Route change: close all menus ─────────────────────────────────────
  // Only depends on pathname so it doesn't re-trigger from its own state changes.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // ── Cleanup close timer on unmount ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // ── Hover helpers with 150 ms grace period ────────────────────────────
  // When the mouse enters a dropdown trigger *or* the dropdown panel itself,
  // we cancel any pending close so the menu stays open.
  const handleMouseEnter = useCallback((label: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(label);
  }, []);

  // When the mouse leaves, wait 150 ms before closing. If the mouse re-enters
  // (either the button or panel) before the timer fires, the close is cancelled.
  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  }, []);

  return (
    <header ref={navRef} className="w-full bg-transparent z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* ── Left: Desktop nav links ──────────────────────────────── */}
          <nav
            className="hidden lg:flex lg:items-center lg:space-x-4"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.items && handleMouseEnter(item.label)
                }
                onMouseLeave={() => item.items && handleMouseLeave()}
              >
                {item.items ? (
                  /* Dropdown trigger button — opens on hover (via parent div)
                     and toggles on click. We intentionally do NOT auto-open on
                     focus because the focus event fires before onClick during
                     a mouse click, which would immediately re-open the dropdown
                     that onClick just toggled closed. Keyboard users open the
                     menu by pressing Enter/Space (which fires onClick). */
                  <button
                    onClick={() =>
                      setOpenMenu((s) =>
                        s === item.label ? null : item.label
                      )
                    }
                    className={`px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 inline-flex items-center gap-1 ${
                      pathname.startsWith(item.href || "")
                        ? "text-primary"
                        : "text-gray-200"
                    }`}
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    {/* Chevron rotates 180° when the dropdown is open */}
                    <span
                      className="text-xs transition-transform duration-200 inline-block"
                      style={{
                        transform:
                          openMenu === item.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    >
                      ▾
                    </span>
                  </button>
                ) : (
                  /* Plain nav link (no dropdown) */
                  <Link
                    href={item.href || "#"}
                    className={`px-3 py-2 rounded text-sm font-medium hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      pathname.startsWith(item.href || "")
                        ? "text-primary"
                        : "text-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* ── Desktop dropdown panel ───────────────────────── */}
                {/* Full-width bar pinned directly under the navbar (top-16).
                    Mouse-enter/leave handlers are on both the trigger div and
                    this panel, sharing the same 150 ms timer — so moving the
                    mouse across the gap keeps it open. */}
                {/* ── Desktop dropdown panel (mega-menu) ─────────────
                    Shows category headings with their nested links.
                    Full-width bar pinned directly under the navbar (top-16).
                    Mouse-enter/leave handlers share the same 150 ms timer
                    as the trigger div so the cursor can travel across any
                    gap without closing the menu. */}
                {item.items && openMenu === item.label && (
                  <div
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                    className="navbar-dropdown-gradient fixed left-0 right-0 top-16 bg-gradient-to-b from-primary/0 to-primary border-t border-primary/20 shadow-md"
                    style={{ zIndex: 50 }}
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                      <div className="flex gap-8">
                        {item.items.map((category) => (
                          <div key={category.label} className="min-w-[140px]">
                            {/* Category heading — links to the category index page */}
                            <Link
                              href={category.href || "#"}
                              className="block text-sm font-semibold text-white hover:text-primary mb-2"
                              onClick={() => setOpenMenu(null)}
                            >
                              {category.label}
                            </Link>
                            {/* Nested links under this category */}
                            {category.items && category.items.length > 0 && (
                              <ul className="space-y-1">
                                {category.items.map((sub) => (
                                  <li key={sub.label}>
                                    <Link
                                      href={sub.href || "#"}
                                      className="block text-sm text-gray-300 hover:text-primary px-1 py-0.5 rounded"
                                      onClick={() => setOpenMenu(null)}
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Center: Logo & site name ─────────────────────────────── */}
          <div className="flex-1 flex items-center justify-center lg:justify-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/deejPotterLogo.svg"
                alt="Deej Potter Logo"
                width={40}
                height={40}
              />
              <span className="hidden sm:inline font-bold text-lg text-white">
                Deej Potter
              </span>
            </Link>
          </div>

          {/* ── Right: Auth button & mobile toggle ───────────────────── */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <AuthButton buttonSize="sm" />
            </div>

            <button
              className="lg:hidden p-2 rounded-md bg-gray-800 text-white"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile navigation drawer ───────────────────────────────────── */}
      {/* Always rendered so tests can find it; visibility is controlled via
          aria-expanded and a conditional CSS class. */}
      <nav
        aria-label="Mobile navigation"
        aria-expanded={mobileOpen}
        className={mobileOpen ? "" : "hidden"}
      >
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          >
            {/* Stop propagation so tapping inside the drawer doesn't close it */}
            <div
              className="absolute left-0 top-0 right-0 bg-gray-900 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <Image
                    src="/images/deejPotterLogo.svg"
                    alt="Deej Potter Logo"
                    width={36}
                    height={36}
                  />
                  <span className="font-bold text-white">Deej Potter</span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white"
                  aria-label="Close navigation"
                >
                  Close
                </button>
              </div>

              {/* Mobile nav items */}
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.items ? (
                      <details>
                        <summary className="text-white py-2 cursor-pointer">
                          {item.label}
                        </summary>
                        <ul className="pl-4">
                          {item.items.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href || "#"}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1 text-gray-200"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-white"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Mobile auth button */}
              <div className="mt-4">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
