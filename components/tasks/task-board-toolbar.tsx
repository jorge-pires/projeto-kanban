"use client";

import type {
  PriorityFilter,
  TaskSortOption,
} from "@/lib/tasks/board";

export type { PriorityFilter, TaskSortOption } from "@/lib/tasks/board";

interface TaskBoardToolbarProps {
  search: string;
  priority: PriorityFilter;
  sort: TaskSortOption;
  resultCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onSortChange: (value: TaskSortOption) => void;
  onClear: () => void;
}

export function TaskBoardToolbar({
  search,
  priority,
  sort,
  resultCount,
  totalCount,
  onSearchChange,
  onPriorityChange,
  onSortChange,
  onClear,
}: TaskBoardToolbarProps) {
  const hasActiveFilters =
    search.trim() !== "" || priority !== "all" || sort !== "manual";

  return (
    <section
      aria-labelledby="task-tools-title"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-5">
        <h3
          id="task-tools-title"
          className="text-lg font-semibold text-slate-950 dark:text-white"
        >
          Buscar e organizar tarefas
        </h3>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Encontre tarefas por texto, prioridade ou ordem de exibição.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-2">
          <label
            htmlFor="task-search"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Buscar tarefa
          </label>

          <input
            id="task-search"
            type="search"
            value={search}
            onChange={(event) => {
              onSearchChange(event.target.value);
            }}
            placeholder="Digite o título ou a descrição"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="priority-filter"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Prioridade
          </label>

          <select
            id="priority-filter"
            value={priority}
            onChange={(event) => {
              onPriorityChange(event.target.value as PriorityFilter);
            }}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="all">Todas as prioridades</option>

            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="task-sort"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Ordenar por
          </label>

          <select
            id="task-sort"
            value={sort}
            onChange={(event) => {
              onSortChange(event.target.value as TaskSortOption);
            }}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="manual">Ordem manual</option>

            <option value="due-date">Prazo mais próximo</option>

            <option value="priority">Maior prioridade</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm text-slate-600 dark:text-slate-400"
          aria-live="polite"
        >
          Exibindo{" "}
          <strong className="text-slate-950 dark:text-white">
            {resultCount}
          </strong>{" "}
          de{" "}
          <strong className="text-slate-950 dark:text-white">
            {totalCount}
          </strong>{" "}
          tarefas.
        </p>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:text-blue-300"
        >
          Limpar filtros
        </button>
      </div>
    </section>
  );
}
