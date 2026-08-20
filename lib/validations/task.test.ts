import { describe, expect, it } from "vitest";

import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";

describe("createTaskSchema", () => {
  it("accepts valid task information", () => {
    const result = createTaskSchema.safeParse({
      title: "Configurar testes",
      description: "Adicionar Vitest ao projeto.",
      priority: "high",
      dueDate: "2026-08-30",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data).toEqual({
      title: "Configurar testes",
      description: "Adicionar Vitest ao projeto.",
      priority: "high",
      dueDate: new Date("2026-08-30T00:00:00.000Z"),
    });
  });

  it("normalizes task text", () => {
    const result = createTaskSchema.safeParse({
      title: "  Configurar testes  ",
      description: "  Testar o formulário  ",
      priority: "medium",
      dueDate: "",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.title).toBe("Configurar testes");

    expect(result.data.description).toBe("Testar o formulário");
  });

  it("converts an empty due date to null", () => {
    const result = createTaskSchema.safeParse({
      title: "Revisar projeto",
      description: "",
      priority: "medium",
      dueDate: "",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.dueDate).toBeNull();
  });

  it("rejects an impossible calendar date", () => {
    const result = createTaskSchema.safeParse({
      title: "Publicar projeto",
      description: "",
      priority: "high",
      dueDate: "2026-02-30",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.dueDate).toContain(
      "Informe uma data válida.",
    );
  });

  it("accepts a valid leap year date", () => {
    const result = createTaskSchema.safeParse({
      title: "Revisar calendário",
      description: "",
      priority: "low",
      dueDate: "2028-02-29",
    });

    expect(result.success).toBe(true);
  });

  it("rejects February 29 outside a leap year", () => {
    const result = createTaskSchema.safeParse({
      title: "Revisar calendário",
      description: "",
      priority: "low",
      dueDate: "2027-02-29",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid priority", () => {
    const result = createTaskSchema.safeParse({
      title: "Publicar projeto",
      description: "",
      priority: "urgent",
      dueDate: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.priority).toContain(
      "Selecione uma prioridade válida.",
    );
  });
});

describe("updateTaskSchema", () => {
  it("accepts a valid task status", () => {
    const result = updateTaskSchema.safeParse({
      title: "Configurar testes",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "in-progress",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid task status", () => {
    const result = updateTaskSchema.safeParse({
      title: "Configurar testes",
      description: "",
      priority: "medium",
      dueDate: "",
      status: "archived",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.flatten().fieldErrors.status).toContain(
      "Selecione um status válido.",
    );
  });
});
