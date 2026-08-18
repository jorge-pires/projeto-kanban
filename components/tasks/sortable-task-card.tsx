"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ProjectTaskCard } from "@/components/tasks/project-task-card";
import type { BoardTask } from "@/components/tasks/sortable-project-board";

interface SortableTaskCardProps {
  task: BoardTask;
  disabled: boolean;
}

export function SortableTaskCard({ task, disabled }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled,
    data: {
      type: "task",
      status: task.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-10 opacity-40" : "relative"}
    >
      <button
        type="button"
        disabled={disabled}
        className="mb-2 flex min-h-11 w-full cursor-grab items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
        aria-label={`Arrastar tarefa: ${task.title}`}
        {...attributes}
        {...listeners}
      >
        <span aria-hidden="true">⠿</span>

        <span className="ml-2">Arrastar tarefa</span>
      </button>

      <ProjectTaskCard
        id={task.id}
        projectId={task.projectId}
        title={task.title}
        description={task.description ?? "Tarefa sem descrição."}
        priority={task.priority}
        status={task.status}
        dueDate={task.dueDate ? new Date(task.dueDate) : null}
      />
    </div>
  );
}
