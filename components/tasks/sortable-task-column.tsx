"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableTaskCard } from "@/components/tasks/sortable-task-card";
import type { BoardTask } from "@/components/tasks/sortable-project-board";
import type { TaskStatus } from "@/lib/validations/task";

interface SortableTaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: BoardTask[];
  emptyMessage: string;
  disabled: boolean;
}

export function SortableTaskColumn({
  title,
  status,
  tasks,
  emptyMessage,
  disabled,
}: SortableTaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    disabled,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`column-${status}`}
      className={`min-h-72 rounded-2xl border p-4 transition-colors ${
        isOver
          ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40"
          : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          id={`column-${status}`}
          className="font-semibold text-slate-950 dark:text-white"
        >
          {title}
        </h2>

        <span
          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300"
          aria-label={`${tasks.length} tarefas`}
        >
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} disabled={disabled} />
            ))
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {emptyMessage}
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
