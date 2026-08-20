import { describe, expect, it } from "vitest";

import { projectSchema } from "@/lib/validations/project";

describe("projectSchema", () => {
  it("accepts valid project information", () => {
    const result = projectSchema.safeParse({
      name: "TaskFlow",
      description: "Gerenciador de projetos e tarefas.",
      color: "blue",
    });

    expect(result.success).toBe(true);
  });

  it("normalizes project information", () => {
    const result = projectSchema.safeParse({
      name: "  TaskFlow  ",
      description: "  Projeto Kanban  ",
      color: "emerald",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data).toEqual({
      name: "TaskFlow",
      description: "Projeto Kanban",
      color: "emerald",
    });
  });

  it("converts an empty description to null", () => {
    const result = projectSchema.safeParse({
      name: "TaskFlow",
      description: "   ",
      color: "violet",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.description).toBeNull();
  });

  it("rejects a project name shorter than two characters", () => {
    const result = projectSchema.safeParse({
      name: "T",
      description: "",
      color: "blue",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.name).toContain(
      "O nome deve ter pelo menos 2 caracteres.",
    );
  });

  it("rejects an unsupported project color", () => {
    const result = projectSchema.safeParse({
      name: "TaskFlow",
      description: "",
      color: "black",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.color).toContain(
      "Selecione uma cor válida.",
    );
  });
});
