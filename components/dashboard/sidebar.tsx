"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { dashboardNavigation } from "@/data/dashboard-navigation";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="text-xl font-bold tracking-tight"
        >
          TaskFlow
        </Link>

        <p className="mt-1 text-xs text-slate-400">
          Gerenciamento de tarefas
        </p>
      </div>

      <nav
        aria-label="Navegação principal do Dashboard"
        className="flex-1 space-y-2 px-4 py-6"
      >
        {dashboardNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={pathname === item.href ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-md bg-slate-800 text-xs font-bold"
            >
              {item.shortLabel}
            </span>

            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <LogoutButton variant="sidebar" />
      </div>
    </aside>
  );
}
