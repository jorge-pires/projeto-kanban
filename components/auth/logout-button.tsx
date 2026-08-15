"use client";

import { useFormStatus } from "react-dom";

import { logoutUser } from "@/app/(dashboard)/actions";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutUser}>
      <LogoutSubmitButton />
    </form>
  );
}
