"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Sidebar } from "@/components/dashboard/sidebar";

interface DashboardUser {
  name: string;
  email: string;
}

interface DashboardShellProps {
  children: ReactNode;
  user: DashboardUser;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu de navegação"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/60"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="relative h-full w-72 max-w-[85vw] shadow-xl"
          >
            <Sidebar onNavigate={closeMobileMenu} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <DashboardHeader user={user} onOpenMenu={openMobileMenu} />

        <main
          id="main-content"
          tabIndex={-1}
          className="p-4 outline-none sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
