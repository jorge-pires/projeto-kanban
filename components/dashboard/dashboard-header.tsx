import type { RefObject } from "react";

import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardHeaderUser {
  name: string;
  email: string;
}

interface DashboardHeaderProps {
  user: DashboardHeaderUser;
  onOpenMenu: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

function getUserInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "U";
}

export function DashboardHeader({
  user,
  onOpenMenu,
  menuButtonRef,
}: DashboardHeaderProps) {
  const initials = getUserInitials(user.name);

  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu de navegação"
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 lg:hidden"
        >
          Menu
        </button>

        <div className="min-w-0">
          <p className="text-xs text-slate-500">Área de trabalho</p>

          <p className="truncate font-semibold text-slate-900">Dashboard</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden max-w-48 text-right sm:block">
          <p className="truncate text-sm font-medium text-slate-900">
            {user.name}
          </p>

          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>

        <div
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
        >
          {initials}
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
