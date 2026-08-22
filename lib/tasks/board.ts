import { taskStatuses, type TaskStatus } from "@/lib/validations/task";

export type PriorityFilter = "all" | "low" | "medium" | "high";
export type TaskSortOption = "manual" | "due-date" | "priority";

export interface BoardTask {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  priority: string;
  status: TaskStatus;
  dueDate: string | null;
}

export interface BoardTaskOrderUpdate {
  id: string;
  status: TaskStatus;
  position: number;
}

interface BoardViewOptions {
  search: string;
  priority: PriorityFilter;
  sort: TaskSortOption;
}

const priorityWeight: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function normalizeTaskText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function getColumnTasks(tasks: BoardTask[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status);
}

export function createOrderUpdates(
  tasks: BoardTask[],
): BoardTaskOrderUpdate[] {
  return taskStatuses.flatMap((status) =>
    getColumnTasks(tasks, status).map((task, position) => ({
      id: task.id,
      status,
      position,
    })),
  );
}

export function createBoardView(
  tasks: BoardTask[],
  { search, priority, sort }: BoardViewOptions,
) {
  const normalizedSearch = normalizeTaskText(search);
  const filteredTasks = tasks.filter((task) => {
    if (priority !== "all" && task.priority !== priority) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return normalizeTaskText(`${task.title} ${task.description ?? ""}`).includes(
      normalizedSearch,
    );
  });

  if (sort === "manual") {
    return filteredTasks;
  }

  return [...filteredTasks].sort((firstTask, secondTask) => {
    if (sort === "priority") {
      return (
        (priorityWeight[secondTask.priority] ?? 0) -
        (priorityWeight[firstTask.priority] ?? 0)
      );
    }

    if (!firstTask.dueDate && !secondTask.dueDate) return 0;
    if (!firstTask.dueDate) return 1;
    if (!secondTask.dueDate) return -1;

    return Date.parse(firstTask.dueDate) - Date.parse(secondTask.dueDate);
  });
}

export function moveBoardTask(
  tasks: BoardTask[],
  activeId: string,
  overId: string,
) {
  const draggedTask = tasks.find((task) => task.id === activeId);
  const overTask = tasks.find((task) => task.id === overId);
  const targetStatus = taskStatuses.includes(overId as TaskStatus)
    ? (overId as TaskStatus)
    : overTask?.status;

  if (!draggedTask || !targetStatus) {
    return null;
  }

  const columns = Object.fromEntries(
    taskStatuses.map((status) => [status, getColumnTasks(tasks, status)]),
  ) as Record<TaskStatus, BoardTask[]>;

  if (draggedTask.status === targetStatus) {
    const columnTasks = columns[targetStatus];
    const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
    const newIndex = overTask
      ? columnTasks.findIndex((task) => task.id === overTask.id)
      : columnTasks.length - 1;

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return null;
    }

    const reorderedTasks = [...columnTasks];
    const [removedTask] = reorderedTasks.splice(oldIndex, 1);

    if (!removedTask) return null;

    reorderedTasks.splice(newIndex, 0, removedTask);
    columns[targetStatus] = reorderedTasks;
  } else {
    columns[draggedTask.status] = columns[draggedTask.status].filter(
      (task) => task.id !== activeId,
    );

    const movedTask = { ...draggedTask, status: targetStatus };
    const targetTasks = [...columns[targetStatus]];
    const targetIndex = overTask
      ? targetTasks.findIndex((task) => task.id === overTask.id)
      : targetTasks.length;

    targetTasks.splice(targetIndex >= 0 ? targetIndex : targetTasks.length, 0, movedTask);
    columns[targetStatus] = targetTasks;
  }

  return taskStatuses.flatMap((status) => columns[status]);
}
