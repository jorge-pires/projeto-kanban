import { ButtonLink } from "@/components/ui/button-link";

export function Hero() {
  return (
    <section id="home" className="mx-auto max-w-6xl px-6 py-24 text-center">
      <h1 className="text-4xl font-bold md:text-6xl">
        Organize suas tarefas com o TaskFlow
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
        Uma forma simples e visual de acompanhar suas atividades e manter o foco
        no que realmente importa.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <ButtonLink href="/login" size="lg">
          Começar agora
        </ButtonLink>

        <a
          href="#features"
          className="inline-flex items-center justify-center rounded-xl border border-blue-600 px-8 py-4 text-lg font-medium text-blue-600 transition hover:bg-blue-50"
        >
          Ver recursos
        </a>
      </div>
    </section>
  );
}
