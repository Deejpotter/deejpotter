"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useNavbar } from "@/contexts/NavbarContext";
import AuthButton from "@/components/ui/auth/AuthButton";

export default function TopNavbar() {
  const { navItems, openDropdowns, toggleDropdown, closeAllDropdowns } =
    useNavbar();
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  return (
    <header className="w-full bg-transparent z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: links */}
          <nav
            className="hidden lg:flex lg:items-center lg:space-x-4"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.items ? (
                  <button
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                    onFocus={() => setOpenMenu(item.label)}
                    onBlur={() => setOpenMenu(null)}
                    onClick={() =>
                      setOpenMenu((s) => (s === item.label ? null : item.label))
                    }
                    className={`px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      pathname.startsWith(item.href || "")
                        ? "text-primary"
                        : "text-gray-200"
                    }`}
                    aria-expanded={openMenu === item.label}
                  >
                    {item.label}
                  </button>
                ) : (
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

                {/* Thin full-width dropdown */}
                {item.items && openMenu === item.label && (
                  <div
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                    className="absolute left-0 right-0 top-full mt-2 bg-gray-900 bg-opacity-95 border-t border-gray-800 shadow-md"
                    style={{ zIndex: 50 }}
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
                      <div className="flex gap-6">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href || "#"}
                            className="text-sm text-gray-200 hover:text-primary px-2 py-1 rounded"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Center: logo */}
          <div className="flex-1 flex items-center justify-center lg:justify-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/deejPotterLogo.svg"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="hidden sm:inline font-bold text-lg text-white">
                Deej Potter
              </span>
            </Link>
          </div>

          {/* Right: auth & mobile */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <AuthButton buttonSize="sm" />
            </div>

            <button
              className="lg:hidden p-2 rounded-md bg-gray-800 text-white"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute left-0 top-0 right-0 bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/images/deejPotterLogo.svg"
                  alt="Logo"
                  width={36}
                  height={36}
                />
                <span className="font-bold text-white">Deej Potter</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white"
              >
                Close
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.items ? (
                      <details>
                        <summary className="text-white py-2">
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
            </nav>
            <div className="mt-4">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
