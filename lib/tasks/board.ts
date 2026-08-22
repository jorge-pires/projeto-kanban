import { taskStatuses, type TaskStatus } from "@/lib/validations/task";

export interface BoardTask {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  priority: string;
  status: TaskStatus;
  dueDate: string | null;
}

export interface TaskOrderUpdate {
  id: string;
  status: TaskStatus;
  position: number;
}

export type PriorityFilter = "all" | "low" | "medium" | "high";
export type TaskSortOption = "manual" | "due-date" | "priority";

interface TaskViewOptions {
  search: string;
  priority: PriorityFilter;
  sort: TaskSortOption;
}

const priorityWeight: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function getColumnTasks(tasks: BoardTask[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status);
}

export function createTaskOrderUpdates(tasks: BoardTask[]): TaskOrderUpdate[] {
  return taskStatuses.flatMap((status) =>
    getColumnTasks(tasks, status).map((task, position) => ({
      id: task.id,
      status,
      position,
    })),
  );
}

export function hasSequentialTaskPositions(updates: TaskOrderUpdate[]) {
  return taskStatuses.every((status) => {
    const positions = updates
      .filter((task) => task.status === status)
      .map((task) => task.position)
      .sort((firstPosition, secondPosition) => firstPosition - secondPosition);

    return positions.every((position, index) => position === index);
  });
}

export function getVisibleTasks(
  tasks: BoardTask[],
  { search, priority, sort }: TaskViewOptions,
) {
  const normalizedSearch = normalizeText(search);

  const filteredTasks = tasks.filter((task) => {
    if (priority !== "all" && task.priority !== priority) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return normalizeText(`${task.title} ${task.description ?? ""}`).includes(
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

    if (!firstTask.dueDate && !secondTask.dueDate) {
      return 0;
    }

    if (!firstTask.dueDate) {
      return 1;
    }

    if (!secondTask.dueDate) {
      return -1;
    }

    return (
      new Date(firstTask.dueDate).getTime() -
      new Date(secondTask.dueDate).getTime()
    );
  });
}

export function moveBoardTask(
  tasks: BoardTask[],
  activeTaskId: string,
  overId: string,
): BoardTask[] | null {
  const draggedTask = tasks.find((task) => task.id === activeTaskId);

  if (!draggedTask) {
    return null;
  }

  const overTask = tasks.find((task) => task.id === overId);
  const targetStatus = isTaskStatus(overId) ? overId : overTask?.status;

  if (!targetStatus) {
    return null;
  }

  const columns = Object.fromEntries(
    taskStatuses.map((status) => [status, getColumnTasks(tasks, status)]),
  ) as Record<TaskStatus, BoardTask[]>;

  if (draggedTask.status === targetStatus) {
    const columnTasks = columns[targetStatus];
    const oldIndex = columnTasks.findIndex((task) => task.id === activeTaskId);
    const newIndex = overTask
      ? columnTasks.findIndex((task) => task.id === overTask.id)
      : columnTasks.length - 1;

    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
      return null;
    }

    columns[targetStatus] = moveArrayItem(columnTasks, oldIndex, newIndex);
  } else {
    columns[draggedTask.status] = columns[draggedTask.status].filter(
      (task) => task.id !== activeTaskId,
    );

    const targetTasks = [...columns[targetStatus]];
    const targetIndex = overTask
      ? targetTasks.findIndex((task) => task.id === overTask.id)
      : targetTasks.length;

    targetTasks.splice(Math.max(0, targetIndex), 0, {
      ...draggedTask,
      status: targetStatus,
    });
    columns[targetStatus] = targetTasks;
  }

  return taskStatuses.flatMap((status) => columns[status]);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.some((status) => status === value);
}

function moveArrayItem<T>(items: T[], oldIndex: number, newIndex: number) {
  const result = [...items];
  const [item] = result.splice(oldIndex, 1);

  if (item === undefined) {
    return items;
  }

  result.splice(newIndex, 0, item);
  return result;
}
