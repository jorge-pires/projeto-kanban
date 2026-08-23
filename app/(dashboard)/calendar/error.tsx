"use client";

import { useEffect } from "react";

interface CalendarErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function CalendarError({ error, reset }: CalendarErrorProps) {
  useEffect(() => {
    console.error("Calendar page error:", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl">
      <section
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/40"
      >
        <p className="text-sm font-semibold tracking-wide text-red-700 uppercase dark:text-red-300">
          Erro inesperado
        </p>

        <h1 className="mt-2 text-2xl font-bold text-red-950 dark:text-red-100">
          Não foi possível abrir o calendário
        </h1>

        <p className="mt-3 text-sm text-red-700 dark:text-red-300">
          Ocorreu um problema inesperado. Você pode tentar carregar a página
          novamente.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
