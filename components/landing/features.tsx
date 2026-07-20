export function Features() {
  const features = [
    "Organize tarefas",
    "Acompanhe progresso",
    "Aumente produtividade",
    "Colabore com sua equipe",
    "Acompanhe métricas",
    "Personalize sua experiência",
  ]

  return (
    <section className="mx-auto text-center max-w-6xl px-6 py-20">
      <h2 className="mb-10 text-3xl font-bold">
        Recursos
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl border p-6 shadow-sm"
          >
            <p>{feature}</p>
          </div>
        ))}
      </div>
    </section>
  )
}