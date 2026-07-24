"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((previousState) => !previousState);
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">TaskFlow</h1>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#home" className="hover:text-blue-600">
            Início
          </a>

          <a href="#features" className="hover:text-blue-600">
            Recursos
          </a>

          <a href="#about" className="hover:text-blue-600">
            Sobre
          </a>

          <Button text="Entrar" variant="primary" size="sm" />
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
          }
        >
          {isMenuOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t px-6 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <a
              href="#home"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-600"
            >
              Início
            </a>

            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-600"
            >
              Recursos
            </a>

            <a
              href="#about"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-600"
            >
              Sobre
            </a>

            <Button text="Entrar" variant="primary" size="sm" />
          </div>
        </nav>
      )}
    </header>
  );
}
