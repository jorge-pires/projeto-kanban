"use client";

import {
  type DragEndEvent,
  type DragStartEvent,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDeferredValue, useMemo, useState, useTransition } from "react";

import {
  saveTaskOrder,
  type TaskOrderUpdate,
} from "@/app/(dashboard)/projects/[projectId]/reorder-task-actions";
import { SortableTaskColumn } from "@/components/tasks/sortable-task-column";
import {
  TaskBoardToolbar,
  type PriorityFilter,
  type TaskSortOption,
} from "@/components/tasks/task-board-toolbar";
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

interface SortableProjectBoardProps {
  projectId: string;
  initialTasks: BoardTask[];
}

const columnInformation: Record<
  TaskStatus,
  {
    title: string;
    emptyMessage: string;
  }
> = {
  todo: {
    title: "A fazer",
    emptyMessage: "Nenhuma tarefa aguardando.",
  },
  "in-progress": {
    title: "Em andamento",
    emptyMessage: "Nenhuma tarefa em andamento.",
  },
  done: {
    title: "Concluídas",
    emptyMessage: "Nenhuma tarefa concluída.",
  },
};

const priorityWeight: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.some((status) => status === value);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function getColumnTasks(tasks: BoardTask[], status: TaskStatus) {
  return tasks.filter((task) => task.status === status);
}

function joinColumns(columns: Record<TaskStatus, BoardTask[]>) {
  return taskStatuses.flatMap((status) => {
    return columns[status];
  });
}

function createOrderUpdates(tasks: BoardTask[]): TaskOrderUpdate[] {
  return taskStatuses.flatMap((status) => {
    return getColumnTasks(tasks, status).map((task, position) => ({
      id: task.id,
      status,
      position,
    }));
  });
}

function sortTasks(tasks: BoardTask[], sort: TaskSortOption) {
  if (sort === "manual") {
    return tasks;
  }

  return [...tasks].sort((firstTask, secondTask) => {
    if (sort === "priority") {
      const firstWeight = priorityWeight[firstTask.priority] ?? 0;

      const secondWeight = priorityWeight[secondTask.priority] ?? 0;

      return secondWeight - firstWeight;
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

export function SortableProjectBoard({
  projectId,
  initialTasks,
}: SortableProjectBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [sort, setSort] = useState<TaskSortOption>("manual");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, startSaving] = useTransition();

  const deferredSearch = useDeferredValue(search);

  const hasCustomView =
    deferredSearch.trim() !== "" || priority !== "all" || sort !== "manual";

  const visibleTasks = useMemo(() => {
    const normalizedSearch = normalizeText(deferredSearch);

    const filteredTasks = tasks.filter((task) => {
      const matchesPriority = priority === "all" || task.priority === priority;

      if (!matchesPriority) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableContent = normalizeText(
        `${task.title} ${task.description ?? ""}`,
      );

      return searchableContent.includes(normalizedSearch);
    });

    return sortTasks(filteredTasks, sort);
  }, [deferredSearch, priority, sort, tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeTask = activeTaskId
    ? tasks.find((task) => task.id === activeTaskId)
    : null;

  function clearFilters() {
    setSearch("");
    setPriority("all");
    setSort("manual");
    setMessage("Filtros removidos.");
  }

  function handleDragStart(event: DragStartEvent) {
    if (hasCustomView || isSaving) {
      return;
    }

    setMessage("");
    setActiveTaskId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveTaskId(null);
    setMessage("Movimentação cancelada.");
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

    if (hasCustomView || isSaving) {
      setMessage(
        "Limpe os filtros e use a ordem manual para arrastar tarefas.",
      );
      return;
    }

    const { active, over } = event;

    if (!over) {
      setMessage("Movimentação cancelada.");
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const draggedTask = tasks.find((task) => task.id === activeId);

    if (!draggedTask) {
      setMessage("Não foi possível localizar a tarefa.");
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);

    const targetStatus = isTaskStatus(overId) ? overId : overTask?.status;

    if (!targetStatus) {
      setMessage("Não foi possível localizar a coluna.");
      return;
    }

    const previousTasks = tasks;

    const columns: Record<TaskStatus, BoardTask[]> = {
      todo: getColumnTasks(tasks, "todo"),
      "in-progress": getColumnTasks(tasks, "in-progress"),
      done: getColumnTasks(tasks, "done"),
    };

    let nextTasks: BoardTask[];

    if (draggedTask.status === targetStatus) {
      const columnTasks = columns[targetStatus];

      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);

      const newIndex = overTask
        ? columnTasks.findIndex((task) => task.id === overTask.id)
        : columnTasks.length - 1;

      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        return;
      }

      columns[targetStatus] = arrayMove(columnTasks, oldIndex, newIndex);

      nextTasks = joinColumns(columns);
    } else {
      columns[draggedTask.status] = columns[draggedTask.status].filter(
        (task) => task.id !== activeId,
      );

      const movedTask: BoardTask = {
        ...draggedTask,
        status: targetStatus,
      };

      const targetTasks = [...columns[targetStatus]];

      const targetIndex = overTask
        ? targetTasks.findIndex((task) => task.id === overTask.id)
        : targetTasks.length;

      const insertionIndex =
        targetIndex >= 0 ? targetIndex : targetTasks.length;

      targetTasks.splice(insertionIndex, 0, movedTask);
      columns[targetStatus] = targetTasks;

      nextTasks = joinColumns(columns);
    }

    setTasks(nextTasks);
    setMessage("Salvando nova ordem...");

    const updates = createOrderUpdates(nextTasks);

    startSaving(async () => {
      const result = await saveTaskOrder(projectId, updates);

      if (!result.success) {
        setTasks(previousTasks);
      }

      setMessage(result.message);
    });
  }

  return (
    <div>
      <TaskBoardToolbar
        search={search}
        priority={priority}
        sort={sort}
        resultCount={visibleTasks.length}
        totalCount={tasks.length}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
        onSortChange={setSort}
        onClear={clearFilters}
      />

      {hasCustomView ? (
        <div
          role="status"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          O arraste está desativado durante buscas, filtros ou ordenações
          temporárias. Selecione “Ordem manual” e limpe os filtros para
          reorganizar as tarefas.
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {taskStatuses.map((status) => (
            <SortableTaskColumn
              key={status}
              title={columnInformation[status].title}
              status={status}
              tasks={getColumnTasks(visibleTasks, status)}
              emptyMessage={
                hasCustomView
                  ? "Nenhuma tarefa encontrada com estes filtros."
                  : columnInformation[status].emptyMessage
              }
              disabled={isSaving || hasCustomView}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-72 rounded-xl border border-blue-300 bg-white p-4 shadow-2xl dark:border-blue-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Movendo tarefa
              </p>

              <p className="mt-2 font-semibold text-slate-950 dark:text-white">
                {activeTask.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <p
        className="mt-4 min-h-6 text-sm text-slate-600 dark:text-slate-400"
        aria-live="polite"
        aria-atomic="true"
      >
        {isSaving ? "Salvando nova ordem..." : message}
      </p>
    </div>
  );
}
