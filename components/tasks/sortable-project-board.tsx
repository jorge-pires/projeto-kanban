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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useDeferredValue, useMemo, useState, useTransition } from "react";

import { saveTaskOrder } from "@/app/(dashboard)/projects/[projectId]/reorder-task-actions";
import { SortableTaskColumn } from "@/components/tasks/sortable-task-column";
import { TaskBoardToolbar } from "@/components/tasks/task-board-toolbar";
import {
  createBoardView,
  createOrderUpdates,
  getColumnTasks,
  moveBoardTask,
  type BoardTask,
  type PriorityFilter,
  type TaskSortOption,
} from "@/lib/tasks/board";
import { taskStatuses, type TaskStatus } from "@/lib/validations/task";

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
    return createBoardView(tasks, {
      search: deferredSearch,
      priority,
      sort,
    });
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

    const previousTasks = tasks;
    const nextTasks = moveBoardTask(tasks, activeId, overId);

    if (!nextTasks) {
      setMessage("A tarefa já está nessa posição ou o destino é inválido.");
      return;
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
