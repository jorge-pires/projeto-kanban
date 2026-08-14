import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página solicitada não foi encontrada no TaskFlow.",
};

export default function NotFoundPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12"
    >
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-lg text-center"
      >
        <p className="text-7xl font-bold text-blue-600">404</p>

        <h1
          id="not-found-title"
          className="mt-6 text-3xl font-bold text-slate-950"
        >
          Página não encontrada
        </h1>

        <p className="mt-4 text-slate-600">
          O endereço acessado não existe ou a página pode ter sido movida.
        </p>

        <ButtonLink href="/" variant="primary" size="md" className="mt-8">
          Voltar para a página inicial
        </ButtonLink>
      </section>
    </main>
  );
}
