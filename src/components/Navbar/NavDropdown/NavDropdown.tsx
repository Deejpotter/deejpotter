"use client";
import Link from "next/link";
import React from "react";
import { useNavbar } from "@/contexts/NavbarContext";

type Item = { label: string; href?: string };

export default function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: Item[];
}) {
  const { openDropdowns, toggleDropdown, closeAllDropdowns } = useNavbar();
  const isOpen = openDropdowns.includes(label);

  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(label)}
        className={`px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          isOpen ? "text-primary" : "text-white"
        }`}
        aria-expanded={isOpen}
      >
        {label}
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-48 bg-gradient-to-b from-primary/0 to-primary border-t border-primary/20 shadow-md z-50"
          onMouseLeave={() => closeAllDropdowns()}
        >
          <ul className="py-2">
            {items.map((sub) => (
              <li key={sub.label}>
                <Link
                  href={sub.href || "#"}
                  className="block px-3 py-2 text-sm text-white hover:text-primary"
                  onClick={() => closeAllDropdowns()}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
