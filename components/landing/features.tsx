const features = [
  {
    id: 1,
    title: "Organize tarefas",
    description:
      "Centralize suas atividades em um quadro visual simples e organizado.",
  },
  {
    id: 2,
    title: "Acompanhe o progresso",
    description:
      "Visualize rapidamente o que ainda precisa ser feito e o que já foi concluído.",
  },
  {
    id: 3,
    title: "Aumente a produtividade",
    description:
      "Mantenha o foco nas tarefas mais importantes e reduza a desorganização.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <h2 className="mb-10 text-center text-3xl font-bold">
        Recursos
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.id}
            className="rounded-xl border p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold">
              {feature.title}
            </h3>

            <p className="mt-3 text-gray-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}