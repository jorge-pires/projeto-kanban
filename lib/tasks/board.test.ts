import { describe, expect, it } from "vitest";

import {
  createTaskOrderUpdates,
  getVisibleTasks,
  hasSequentialTaskPositions,
  moveBoardTask,
  type BoardTask,
} from "@/lib/tasks/board";

const tasks: BoardTask[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Revisar autenticação",
    description: "Validar o fluxo de login",
    priority: "high",
    status: "todo",
    dueDate: "2026-09-10T00:00:00.000Z",
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Criar documentação",
    description: null,
    priority: "low",
    status: "todo",
    dueDate: null,
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Publicar projeto",
    description: "Preparar a produção",
    priority: "medium",
    status: "in-progress",
    dueDate: "2026-09-05T00:00:00.000Z",
  },
];

describe("getVisibleTasks", () => {
  it("matches accent-insensitive text in titles and descriptions", () => {
    const result = getVisibleTasks(tasks, {
      search: "autenticacao",
      priority: "all",
      sort: "manual",
    });

    expect(result.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("combines priority filtering and priority sorting", () => {
    const result = getVisibleTasks(tasks, {
      search: "",
      priority: "high",
      sort: "priority",
    });

    expect(result.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("places tasks without a due date last", () => {
    const result = getVisibleTasks(tasks, {
      search: "",
      priority: "all",
      sort: "due-date",
    });

    expect(result.map((task) => task.id)).toEqual([
      "task-3",
      "task-1",
      "task-2",
    ]);
  });

  it("preserves manual order when tasks have no due date", () => {
    const withoutDates = tasks.map((task) => ({ ...task, dueDate: null }));
    const result = getVisibleTasks(withoutDates, {
      search: "",
      priority: "all",
      sort: "due-date",
    });

    expect(result.map((task) => task.id)).toEqual([
      "task-1",
      "task-2",
      "task-3",
    ]);
  });
});

describe("moveBoardTask", () => {
  it("reorders tasks inside the same column without mutating the input", () => {
    const result = moveBoardTask(tasks, "task-2", "task-1");

    expect(result?.map((task) => task.id)).toEqual([
      "task-2",
      "task-1",
      "task-3",
    ]);
    expect(tasks.map((task) => task.id)).toEqual([
      "task-1",
      "task-2",
      "task-3",
    ]);
  });

  it("moves a task into another column", () => {
    const result = moveBoardTask(tasks, "task-1", "task-3");

    expect(result?.find((task) => task.id === "task-1")?.status).toBe(
      "in-progress",
    );
  });

  it("moves a task into an empty column", () => {
    const result = moveBoardTask(tasks, "task-1", "done");

    expect(result?.at(-1)).toMatchObject({
      id: "task-1",
      status: "done",
    });
  });

  it("returns null for an unknown task or destination", () => {
    expect(moveBoardTask(tasks, "missing", "task-1")).toBeNull();
    expect(moveBoardTask(tasks, "task-1", "missing")).toBeNull();
  });
});

describe("task order persistence", () => {
  it("creates a zero-based position sequence for every column", () => {
    expect(createTaskOrderUpdates(tasks)).toEqual([
      { id: "task-1", status: "todo", position: 0 },
      { id: "task-2", status: "todo", position: 1 },
      { id: "task-3", status: "in-progress", position: 0 },
    ]);
  });

  it("rejects gaps and duplicate positions", () => {
    expect(
      hasSequentialTaskPositions([
        { id: "task-1", status: "todo", position: 0 },
        { id: "task-2", status: "todo", position: 2 },
      ]),
    ).toBe(false);

    expect(
      hasSequentialTaskPositions([
        { id: "task-1", status: "todo", position: 0 },
        { id: "task-2", status: "todo", position: 1 },
      ]),
    ).toBe(true);
  });
});
