import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProjectTaskCard } from "@/components/tasks/project-task-card";
import { prisma } from "@/lib/prisma";
import {
  taskPriorities,
  taskStatusSchema,
  type TaskStatus,
} from "@/lib/validations/task";

interface TasksPageProps {
  searchParams: Promise<{
    search?: string | string[];
    status?: string | string[];
    priority?: string | string[];
    sort?: string | string[];
  }>;
}

type SortOption = "recent" | "due-date" | "priority" | "title";

const statusLabels: Record<TaskStatus, string> = {
  todo: "A fazer",
  "in-progress": "Em andamento",
  done: "Concluídas",
};

const priorityWeight: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function getStringParameter(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function isValidPriority(value: string) {
  return taskPriorities.some((priority) => priority === value);
}

function isValidSort(value: string): value is SortOption {
  return ["recent", "due-date", "priority", "title"].includes(value);
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parameters = await searchParams;

  const search = getStringParameter(parameters.search).trim();

  const receivedStatus = getStringParameter(parameters.status);

  const receivedPriority = getStringParameter(parameters.priority);

  const receivedSort = getStringParameter(parameters.sort);

  const statusResult = taskStatusSchema.safeParse(receivedStatus);

  const status = statusResult.success ? statusResult.data : "";

  const priority = isValidPriority(receivedPriority) ? receivedPriority : "";

  const sort: SortOption = isValidSort(receivedSort) ? receivedSort : "recent";

  const databaseTasks = await prisma.task.findMany({
    where: {
      project: {
        ownerId: session.user.id,
      },
      ...(status
        ? {
            status,
          }
        : {}),
      ...(priority
        ? {
            priority,
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                },
              },
              {
                description: {
                  contains: search,
                },
              },
              {
                project: {
                  name: {
                    contains: search,
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const tasks = [...databaseTasks].sort((firstTask, secondTask) => {
    if (sort === "title") {
      return firstTask.title.localeCompare(secondTask.title, "pt-BR");
    }

    if (sort === "priority") {
      const firstWeight = priorityWeight[firstTask.priority] ?? 0;

      const secondWeight = priorityWeight[secondTask.priority] ?? 0;

      return secondWeight - firstWeight;
    }

    if (sort === "due-date") {
      if (!firstTask.dueDate && !secondTask.dueDate) {
        return 0;
      }

      if (!firstTask.dueDate) {
        return 1;
      }

      if (!secondTask.dueDate) {
        return -1;
      }

      return firstTask.dueDate.getTime() - secondTask.dueDate.getTime();
    }

    return secondTask.updatedAt.getTime() - firstTask.updatedAt.getTime();
  });

  const hasActiveFilters =
    search !== "" || status !== "" || priority !== "" || sort !== "recent";

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
          Organização
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Todas as tarefas
        </h1>

        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Consulte e organize as tarefas de todos os seus projetos em um único
          lugar.
        </p>
      </header>

      <section
        aria-labelledby="task-filters-title"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-5">
          <h2
            id="task-filters-title"
            className="text-xl font-semibold text-slate-950 dark:text-white"
          >
            Buscar e filtrar
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Os filtros ficam registrados na URL da página.
          </p>
        </div>

        <form
          action="/tasks"
          method="get"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <div className="md:col-span-2 xl:col-span-1">
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Buscar
            </label>

            <input
              id="search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Tarefa, descrição ou projeto"
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={status}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="todo">A fazer</option>

              <option value="in-progress">Em andamento</option>

              <option value="done">Concluídas</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Prioridade
            </label>

            <select
              id="priority"
              name="priority"
              defaultValue={priority}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Todas as prioridades</option>

              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sort"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Ordenar por
            </label>

            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-950 transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="recent">Atualização recente</option>

              <option value="due-date">Prazo mais próximo</option>

              <option value="priority">Maior prioridade</option>

              <option value="title">Título de A a Z</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row xl:col-span-4 xl:justify-end">
            {hasActiveFilters ? (
              <Link
                href="/tasks"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:text-blue-300"
              >
                Limpar filtros
              </Link>
            ) : null}

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Aplicar filtros
            </button>
          </div>
        </form>
      </section>

      <section aria-labelledby="task-results-title">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="task-results-title"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              Resultado
            </h2>

            <p
              className="mt-1 text-sm text-slate-600 dark:text-slate-400"
              aria-live="polite"
            >
              {tasks.length === 1
                ? "1 tarefa encontrada."
                : `${tasks.length} tarefas encontradas.`}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ver projetos →
          </Link>
        </div>

        {tasks.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => {
              const taskStatus = taskStatusSchema.safeParse(task.status);

              if (!taskStatus.success) {
                return null;
              }

              return (
                <article key={task.id} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                        Projeto
                      </p>

                      <Link
                        href={`/projects/${task.project.id}`}
                        className="mt-1 block truncate font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {task.project.name}
                      </Link>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {statusLabels[taskStatus.data]}
                    </span>
                  </div>

                  <ProjectTaskCard
                    id={task.id}
                    projectId={task.project.id}
                    title={task.title}
                    description={task.description ?? "Tarefa sem descrição."}
                    priority={task.priority}
                    status={taskStatus.data}
                    dueDate={task.dueDate}
                  />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Nenhuma tarefa encontrada
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
              {hasActiveFilters
                ? "Nenhuma tarefa corresponde aos filtros selecionados."
                : "Crie um projeto e adicione sua primeira tarefa para começar."}
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {hasActiveFilters ? (
                <Link
                  href="/tasks"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:text-blue-300"
                >
                  Limpar filtros
                </Link>
              ) : null}

              <Link
                href="/projects"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Ir para projetos
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
