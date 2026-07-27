"use client"

import { useState } from "react"

import { Button } from "@/components/ui/Button"

const navigationLinks = [
  {
    label: "Início",
    href: "#home",
  },
  {
    label: "Recursos",
    href: "#features",
  },
  {
    label: "Sobre",
    href: "#about",
  },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function toggleMenu() {
    setIsMenuOpen((previousState) => !previousState)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">
          TaskFlow
        </h1>

        <nav className="hidden items-center gap-6 md:flex">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}

          <Button
            text="Entrar"
            variant="primary"
            size="sm"
          />
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={
            isMenuOpen
              ? "Fechar menu de navegação"
              : "Abrir menu de navegação"
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
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="w-full rounded-lg px-4 py-3 transition hover:bg-gray-200 hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}

            <Button
              text="Entrar"
              variant="primary"
              size="sm"
              className="mt-2 w-full"
              onClick={closeMenu}
            />
          </div>
        </nav>
      )}
    </header>
  )
}