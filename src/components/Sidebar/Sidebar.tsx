"use client";
import Link from "next/link";
import Image from "next/image";
import { useNavbar } from "@/contexts/NavbarContext";
import AuthButton from "@/components/ui/auth/AuthButton";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { navItems, openDropdowns, toggleDropdown, closeAllDropdowns } =
    useNavbar();
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavItem = (item: any) => {
    const isActive = item.href && pathname.startsWith(item.href);
    const isOpen = openDropdowns.includes(item.label);

    if (item.items && item.items.length > 0) {
      return (
        <div key={item.label} className="mb-2">
          <button
            onClick={() => toggleDropdown(item.label)}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            aria-expanded={isOpen}
          >
            <span className={`font-semibold ${isActive ? "text-primary" : ""}`}>
              {item.label}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isOpen && (
            <ul className="mt-2 pl-4 space-y-1">
              {item.items.map((sub: any) => (
                <li key={sub.label}>
                  <Link
                    href={sub.href || "#"}
                    className={`block p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                      pathname.startsWith(sub.href || "")
                        ? "text-primary font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || "#"}
        className={`block p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          isActive
            ? "bg-primary text-white"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <span className="font-semibold">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
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

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:h-screen lg:sticky top-0 bg-gray-100 dark:bg-gray-900 p-6 flex flex-col border-r border-gray-200 dark:border-gray-800">
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/images/deejPotterLogo.svg"
              alt="Deej Potter Logo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold mt-2 text-primary">
              Deej Potter
            </h1>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Full-Stack Developer
          </p>
        </div>

        <nav className="flex-grow overflow-auto">
          <ul className="space-y-2">
            {navItems.map((item) => renderNavItem(item))}
          </ul>
        </nav>

        <div className="mt-8">
          <AuthButton className="mx-auto" showGravatar={true} buttonSize="sm" />
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Deej Potter. All Rights Reserved.
          </p>
        </div>
      </aside>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-gray-100 dark:bg-gray-900 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/images/deejPotterLogo.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                />
                <span className="font-bold text-lg text-primary">
                  Deej Potter
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded bg-gray-200 dark:bg-gray-800"
                aria-label="Close menu"
              >
                X
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>{renderNavItem(item)}</li>
                ))}
              </ul>
            </nav>
            <div className="mt-6">
              <AuthButton
                className="mx-auto"
                showGravatar={true}
                buttonSize="sm"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
