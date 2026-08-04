import { RegisterForm } from "@/components/auth/register-form"
import { ButtonLink } from "@/components/ui/button-link"

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Criar conta
        </h1>

        <p className="mt-3 text-gray-600">
          Cadastre-se para começar a organizar suas tarefas.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
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

        <ButtonLink
          href="/"
          variant="ghost"
          size="sm"
          className="mt-2 w-full"
        >
          Voltar para a página inicial
        </ButtonLink>
      </section>
    </main>
  )
}