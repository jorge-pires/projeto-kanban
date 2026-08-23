import { ButtonLink } from "@/components/ui/button-link";

export function CTA() {
  return (
    <section className="bg-blue-50 px-6 py-20 text-center">
      <h2 className="text-3xl font-bold">
        Pronto para organizar suas tarefas?
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        Comece agora e transforme a forma como você acompanha suas atividades.
      </p>

      <ButtonLink href="/login" size="lg" className="mt-8">
        Começar agora
      </ButtonLink>
    </section>
  );
}
