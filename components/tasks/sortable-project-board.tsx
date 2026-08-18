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
import { useState, useTransition } from "react";

import {
  saveTaskOrder,
  type TaskOrderUpdate,
} from "@/app/(dashboard)/projects/[projectId]/reorder-task-actions";
import { SortableTaskColumn } from "@/components/tasks/sortable-task-column";
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

function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.some((status) => status === value);
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

export function SortableProjectBoard({
  projectId,
  initialTasks,
}: SortableProjectBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, startSaving] = useTransition();

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

  function handleDragStart(event: DragStartEvent) {
    setMessage("");
    setActiveTaskId(String(event.active.id));
  }

  function handleDragCancel() {
    setActiveTaskId(null);
    setMessage("Movimentação cancelada.");
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);

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
              tasks={getColumnTasks(tasks, status)}
              emptyMessage={columnInformation[status].emptyMessage}
              disabled={isSaving}
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
