"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/button-link";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("TaskFlow application error:", error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12"
    >
      <section
        aria-labelledby="error-title"
        className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
      >
        <p className="text-sm font-semibold tracking-wide text-red-700 uppercase">
          Erro inesperado
        </p>

        <h1 id="error-title" className="mt-3 text-3xl font-bold text-slate-950">
          Não foi possível carregar esta página
        </h1>

        <p className="mt-4 text-slate-600">
          Ocorreu uma falha inesperada. Você pode tentar novamente ou voltar
          para a página inicial.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-slate-500">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" variant="primary" size="md" onClick={reset}>
            Tentar novamente
          </Button>

          <ButtonLink href="/" variant="secondary" size="md">
            Voltar ao início
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
