import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatCard } from "@/components/dashboard/stat-card";

describe("StatCard", () => {
  it("renders the provided productivity information", () => {
    render(
      <StatCard
        label="Tarefas concluídas"
        value={12}
        description="Tarefas finalizadas com sucesso."
        accent="emerald"
      />,
    );

    expect(screen.getByRole("article")).toBeInTheDocument();

    expect(screen.getByText("Tarefas concluídas")).toBeInTheDocument();

    expect(screen.getByText("12")).toBeInTheDocument();

    expect(
      screen.getByText("Tarefas finalizadas com sucesso."),
    ).toBeInTheDocument();
  });

  it("hides the decorative accent from assistive technologies", () => {
    const { container } = render(
      <StatCard
        label="Tarefas atrasadas"
        value={3}
        description="Tarefas com prazo vencido."
        accent="red"
      />,
    );

    const decorativeAccent = container.querySelector('[aria-hidden="true"]');

    expect(decorativeAccent).toBeInTheDocument();
    expect(decorativeAccent).toHaveClass("bg-red-500");
  });
});
