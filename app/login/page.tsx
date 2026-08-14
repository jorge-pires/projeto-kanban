import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua conta do TaskFlow.",
};

interface LoginPageProps {
  searchParams: Promise<{
    registered?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const accountWasCreated = registered === "true";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12"
    >
      <section
        aria-labelledby="login-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 id="login-title" className="text-3xl font-bold text-slate-950">
          Entrar
        </h1>

        <p className="mt-3 text-slate-600">
          Entre na sua conta para acessar suas tarefas.
        </p>

        {accountWasCreated && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            Conta criada com sucesso. Agora você pode entrar.
          </p>
        )}

        <LoginForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          Ainda não possui uma conta?
        </p>

        <ButtonLink
          href="/register"
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
        >
          Criar conta
        </ButtonLink>

        <ButtonLink href="/" variant="ghost" size="sm" className="mt-2 w-full">
          Voltar para a página inicial
        </ButtonLink>
      </section>
    </main>
  );
}
