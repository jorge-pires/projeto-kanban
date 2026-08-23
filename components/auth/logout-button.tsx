"use client";

import { useFormStatus } from "react-dom";

import { logoutUser } from "@/app/(dashboard)/actions";

interface LogoutButtonProps {
  variant?: "header" | "sidebar";
}

function LogoutSubmitButton({ variant = "header" }: LogoutButtonProps) {
  const { pending } = useFormStatus();

  const className =
    variant === "sidebar"
      ? "w-full rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      : "rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={className}
    >
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

export function LogoutButton({ variant = "header" }: LogoutButtonProps) {
  return (
    <form action={logoutUser}>
      <LogoutSubmitButton variant={variant} />
    </form>
  );
}
