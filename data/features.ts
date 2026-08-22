export interface Feature {
  id: number;
  title: string;
  description: string;
  highlighted?: boolean;
  badgeText?: string;
}

export const features: Feature[] = [
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
