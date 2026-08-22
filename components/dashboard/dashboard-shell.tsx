"use client";

import { useEffect, useRef, useState } from "react";
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);

  function openMobileMenu() {
    setIsMobileMenuOpen(true);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableElements =
      mobileDialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

    focusableElements?.[0]?.focus();

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab" || !focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeyDown);
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
            ref={mobileDialogRef}
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
        <DashboardHeader
          user={user}
          onOpenMenu={openMobileMenu}
          menuButtonRef={menuButtonRef}
        />

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
