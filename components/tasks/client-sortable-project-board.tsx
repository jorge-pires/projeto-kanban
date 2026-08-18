"use client";

import dynamic from "next/dynamic";

import type { BoardTask } from "@/components/tasks/sortable-project-board";

interface ClientSortableProjectBoardProps {
  projectId: string;
  initialTasks: BoardTask[];
}

const SortableProjectBoard = dynamic(
  () =>
    import("@/components/tasks/sortable-project-board").then(
      (importedComponent) => importedComponent.SortableProjectBoard,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
      >
        Carregando quadro Kanban...
      </div>
    ),
  },
);

export function ClientSortableProjectBoard({
  projectId,
  initialTasks,
}: ClientSortableProjectBoardProps) {
  return (
    <SortableProjectBoard projectId={projectId} initialTasks={initialTasks} />
  );
}
