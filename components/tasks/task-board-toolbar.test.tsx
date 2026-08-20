import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TaskBoardToolbar } from "@/components/tasks/task-board-toolbar";

function createDefaultProperties() {
  return {
    search: "",
    priority: "all" as const,
    sort: "manual" as const,
    resultCount: 8,
    totalCount: 12,
    onSearchChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onSortChange: vi.fn(),
    onClear: vi.fn(),
  };
}

describe("TaskBoardToolbar", () => {
  it("renders accessible filter controls and result count", () => {
    const { container } = render(
      <TaskBoardToolbar {...createDefaultProperties()} />,
    );

    expect(
      screen.getByRole("searchbox", {
        name: "Buscar tarefa",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: "Prioridade",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: "Ordenar por",
      }),
    ).toBeInTheDocument();

    const resultStatus = container.querySelector('[aria-live="polite"]');

    expect(resultStatus).toBeInTheDocument();

    expect(resultStatus).toHaveTextContent("Exibindo 8 de 12 tarefas.");
  });

  it("reports changes to the search field", async () => {
    const user = userEvent.setup();
    const properties = createDefaultProperties();

    render(<TaskBoardToolbar {...properties} />);

    const searchField = screen.getByRole("searchbox", {
      name: "Buscar tarefa",
    });

    await user.type(searchField, "T");

    expect(properties.onSearchChange).toHaveBeenCalledWith("T");
  });

  it("reports priority changes", async () => {
    const user = userEvent.setup();
    const properties = createDefaultProperties();

    render(<TaskBoardToolbar {...properties} />);

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Prioridade",
      }),
      "high",
    );

    expect(properties.onPriorityChange).toHaveBeenCalledWith("high");
  });

  it("reports sorting changes", async () => {
    const user = userEvent.setup();
    const properties = createDefaultProperties();

    render(<TaskBoardToolbar {...properties} />);

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Ordenar por",
      }),
      "due-date",
    );

    expect(properties.onSortChange).toHaveBeenCalledWith("due-date");
  });

  it("disables clearing when no filters are active", () => {
    render(<TaskBoardToolbar {...createDefaultProperties()} />);

    expect(
      screen.getByRole("button", {
        name: "Limpar filtros",
      }),
    ).toBeDisabled();
  });

  it("allows the user to clear active filters", async () => {
    const user = userEvent.setup();

    const properties = {
      ...createDefaultProperties(),
      search: "login",
    };

    render(<TaskBoardToolbar {...properties} />);

    const clearButton = screen.getByRole("button", {
      name: "Limpar filtros",
    });

    expect(clearButton).toBeEnabled();

    await user.click(clearButton);

    expect(properties.onClear).toHaveBeenCalledOnce();
  });
});
