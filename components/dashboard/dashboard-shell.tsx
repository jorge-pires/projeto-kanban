"use client"

import { useState } from "react"
import type { ReactNode } from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Sidebar } from "@/components/dashboard/sidebar"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({
  children,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false)

  function openMobileMenu() {
    setIsMobileMenuOpen(true)
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

          <div className="relative h-full w-72 shadow-xl">
            <Sidebar onNavigate={closeMobileMenu} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <DashboardHeader
          onOpenMenu={openMobileMenu}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}