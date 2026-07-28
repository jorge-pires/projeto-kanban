import { FeatureCard } from "@/components/landing/feature-card";

interface Feature {
  id: number;
  title: string;
  description: string;
  highlighted?: boolean;
  badgeText?: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Organize tarefas",
    description:
      "Centralize suas atividades em um quadro visual simples e organizado.",
    highlighted: true,
    badgeText: "Mais popular",
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
  {
    id: 4,
    title: "Acesse em qualquer dispositivo",
    description:
      "Use o TaskFlow no computador, tablet ou celular com uma interface responsiva.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">Recursos</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            highlighted={feature.highlighted}
            badgeText={feature.badgeText}
          />
        ))}
      </div>
    </section>
  );
}
