"use client";

import Link from "next/link";
import { useState } from "react";

import { NavigationLink } from "@/components/navigation/navigation-link";
import { navigationLinks } from "@/data/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((previousState) => !previousState);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          TaskFlow
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navigationLinks.map((link) => (
            <NavigationLink
              key={link.href}
              href={link.href}
              external={link.external}
            >
              {link.label}
            </NavigationLink>
          ))}

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
          >
            Entrar
          </Link>
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
          }
        >
          {isMenuOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t bg-gray-50 px-6 py-4 md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {navigationLinks.map((link) => (
              <NavigationLink
                key={link.href}
                href={link.href}
                external={link.external}
                onClick={closeMenu}
                className="w-full rounded-lg px-4 py-3 hover:bg-gray-200"
              >
                {link.label}
              </NavigationLink>
            ))}
            2
            <Link
              href="/login"
              onClick={closeMenu}
              className="mt-2 w-full rounded-xl bg-blue-600 px-3 py-2 text-center text-sm text-white transition hover:bg-blue-700"
            >
              Entrar
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
