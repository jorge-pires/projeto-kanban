import { describe, expect, it } from "vitest";

import {
  createBoardView,
  createOrderUpdates,
  moveBoardTask,
  type BoardTask,
} from "@/lib/tasks/board";

const tasks: BoardTask[] = [
  {
    id: "first",
    projectId: "project",
    title: "Revisão acessível",
    description: "Testar teclado",
    priority: "medium",
    status: "todo",
    dueDate: "2026-09-12T00:00:00.000Z",
  },
  {
    id: "second",
    projectId: "project",
    title: "Publicar projeto",
    description: null,
    priority: "high",
    status: "todo",
    dueDate: "2026-09-05T00:00:00.000Z",
  },
  {
    id: "third",
    projectId: "project",
    title: "Documentar API",
    description: "Adicionar exemplos",
    priority: "low",
    status: "done",
    dueDate: null,
  },
];

describe("board domain", () => {
  it("searches without depending on accents or letter case", () => {
    const result = createBoardView(tasks, {
      search: "REVISAO",
      priority: "all",
      sort: "manual",
    });

    expect(result.map((task) => task.id)).toEqual(["first"]);
  });

  it("filters by priority and sorts by due date", () => {
    const result = createBoardView(tasks, {
      search: "",
      priority: "all",
      sort: "due-date",
    });

    expect(result.map((task) => task.id)).toEqual(["second", "first", "third"]);
  });

  it("moves a task inside the same column", () => {
    const result = moveBoardTask(tasks, "first", "second");

    expect(result?.map((task) => task.id)).toEqual(["second", "first", "third"]);
  });

  it("moves a task to another column", () => {
    const result = moveBoardTask(tasks, "second", "done");

    expect(result?.find((task) => task.id === "second")?.status).toBe("done");
    expect(result?.map((task) => task.id)).toEqual(["first", "third", "second"]);
  });

  it("creates contiguous positions for every column", () => {
    const movedTasks = moveBoardTask(tasks, "second", "done");

    expect(createOrderUpdates(movedTasks ?? [])).toEqual([
      { id: "first", status: "todo", position: 0 },
      { id: "third", status: "done", position: 0 },
      { id: "second", status: "done", position: 1 },
    ]);
  });

  it("does not mutate the original task array", () => {
    moveBoardTask(tasks, "second", "done");

    expect(tasks.map((task) => [task.id, task.status])).toEqual([
      ["first", "todo"],
      ["second", "todo"],
      ["third", "done"],
    ]);
  });
});
