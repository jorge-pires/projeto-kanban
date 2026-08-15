import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RegisterForm } from "@/components/auth/register-form";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta gratuita no TaskFlow.",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12"
    >
      <section
        aria-labelledby="register-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 id="register-title" className="text-3xl font-bold text-slate-950">
          Criar conta
        </h1>

        <p className="mt-3 text-slate-600">
          Cadastre-se para começar a organizar suas tarefas.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-slate-600">
          Já possui uma conta?
        </p>

        <ButtonLink
          href="/login"
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
        >
          Entrar
        </ButtonLink>

        <ButtonLink href="/" variant="ghost" size="sm" className="mt-2 w-full">
          Voltar para a página inicial
        </ButtonLink>
      </section>
    </main>
  );
}
