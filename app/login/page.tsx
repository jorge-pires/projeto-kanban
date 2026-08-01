import { LoginForm } from "@/components/auth/login-form"
import { ButtonLink } from "@/components/ui/button-link"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-1000 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-black p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Entrar
        </h1>

        <p className="mt-3 text-gray-600">
          Entre na sua conta para acessar suas tarefas.
        </p>

        <LoginForm />

        <ButtonLink
          href="/"
          variant="ghost"
          size="sm"
          className="mt-6 w-full"
        >
          Voltar para a página inicial
        </ButtonLink>
      </section>
    </main>
  )
}