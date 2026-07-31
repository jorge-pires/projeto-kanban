import { ButtonLink } from "@/components/ui/button-link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Entrar</h1>

        <p className="mt-3 text-gray-600">
          A página de autenticação será desenvolvida nas próximas etapas.
        </p>

        <ButtonLink href="/" variant="ghost" size="sm" className="mt-6">
          Voltar para a página inicial
        </ButtonLink>
      </section>
    </main>
  );
}
