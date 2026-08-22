import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { StatCard } from "@/components/dashboard/stat-card";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  todo: "A fazer",
  "in-progress": "Em andamento",
  done: "Concluída",
};

const statusStyles: Record<string, string> = {
  todo: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  "in-progress":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    projectCount,
    taskCount,
    inProgressCount,
    completedCount,
    overdueCount,
    recentTasks,
    upcomingTasks,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count({
      where: {
        ownerId: session.user.id,
      },
    }),

    prisma.task.count({
      where: {
        project: {
          ownerId: session.user.id,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "in-progress",
        project: {
          ownerId: session.user.id,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: "done",
        project: {
          ownerId: session.user.id,
        },
      },
    }),

    prisma.task.count({
      where: {
        status: {
          not: "done",
        },
        dueDate: {
          lt: today,
        },
        project: {
          ownerId: session.user.id,
        },
      },
    }),

    prisma.task.findMany({
      where: {
        project: {
          ownerId: session.user.id,
        },
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
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        status: {
          not: "done",
        },
        dueDate: {
          gte: today,
        },
        project: {
          ownerId: session.user.id,
        },
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
        dueDate: "asc",
      },
      take: 5,
    }),

    prisma.project.findMany({
      where: {
        ownerId: session.user.id,
      },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 4,
    }),
  ]);

  const firstName = session.user.name?.split(" ")[0] ?? "Usuário";

  const completionRate =
    taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  const dashboardStats = [
    {
      label: "Projetos",
      value: projectCount,
      description: "Projetos cadastrados na sua conta.",
      accent: "blue" as const,
    },
    {
      label: "Total de tarefas",
      value: taskCount,
      description: "Todas as tarefas dos seus projetos.",
      accent: "blue" as const,
    },
    {
      label: "Em andamento",
      value: inProgressCount,
      description: "Tarefas sendo executadas agora.",
      accent: "amber" as const,
    },
    {
      label: "Concluídas",
      value: completedCount,
      description: `${completionRate}% das tarefas finalizadas.`,
      accent: "emerald" as const,
    },
    {
      label: "Atrasadas",
      value: overdueCount,
      description: "Tarefas pendentes com prazo vencido.",
      accent: "red" as const,
    },
  ];

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            Visão geral
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Olá, {firstName}
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Acompanhe seus projetos, prazos e tarefas em um único lugar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tasks"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:text-blue-300"
          >
            Ver tarefas
          </Link>

          <Link
            href="/projects#new-project"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Novo projeto
          </Link>
        </div>
      </header>

      <section
        aria-label="Resumo da conta"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            accent={stat.accent}
          />
        ))}
      </section>

      <section
        aria-labelledby="general-progress-title"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="general-progress-title"
              className="text-xl font-semibold text-slate-950 dark:text-white"
            >
              Progresso geral
            </h2>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Percentual de tarefas concluídas em todos os projetos.
            </p>
          </div>

          <strong className="text-2xl text-blue-600 dark:text-blue-400">
            {completionRate}%
          </strong>
        </div>

        <div
          className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-label="Progresso geral das tarefas"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionRate}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-[width]"
            style={{
              width: `${completionRate}%`,
            }}
          />
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section
          aria-labelledby="recent-activity-title"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="recent-activity-title"
                className="text-xl font-semibold text-slate-950 dark:text-white"
              >
                Atividade recente
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Últimas tarefas atualizadas.
              </p>
            </div>

            <Link
              href="/tasks"
              className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver todas
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <ul className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
              {recentTasks.map((task) => (
                <li key={task.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/projects/${task.project.id}/tasks/${task.id}/edit`}
                        className="block truncate font-semibold text-slate-950 transition hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:hover:text-blue-300"
                      >
                        {task.title}
                      </Link>

                      <Link
                        href={`/projects/${task.project.id}`}
                        className="mt-1 block truncate text-sm text-slate-500 transition hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
                      >
                        {task.project.name}
                      </Link>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[task.status] ?? statusStyles.todo
                      }`}
                    >
                      {statusLabels[task.status] ?? "Status desconhecido"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
              <p className="font-medium text-slate-700 dark:text-slate-200">
                Nenhuma atividade registrada
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Crie uma tarefa para iniciar seu histórico.
              </p>
            </div>
          )}
        </section>

        <section
          aria-labelledby="upcoming-deadlines-title"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="upcoming-deadlines-title"
                className="text-xl font-semibold text-slate-950 dark:text-white"
              >
                Próximos prazos
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Tarefas pendentes com data definida.
              </p>
            </div>

            <Link
              href="/tasks?sort=due-date"
              className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver agenda
            </Link>
          </div>

          {upcomingTasks.length > 0 ? (
            <ul className="mt-5 divide-y divide-slate-200 dark:divide-slate-800">
              {upcomingTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/projects/${task.project.id}/tasks/${task.id}/edit`}
                      className="block truncate font-semibold text-slate-950 transition hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:hover:text-blue-300"
                    >
                      {task.title}
                    </Link>

                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                      {task.project.name}
                    </p>
                  </div>

                  {task.dueDate ? (
                    <time
                      dateTime={task.dueDate.toISOString()}
                      className="shrink-0 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    >
                      {formatDate(task.dueDate)}
                    </time>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
              <p className="font-medium text-slate-700 dark:text-slate-200">
                Nenhum prazo próximo
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                As tarefas com prazo aparecerão aqui.
              </p>
            </div>
          )}
        </section>
      </div>

      <section aria-labelledby="project-progress-title">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2
              id="project-progress-title"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              Progresso dos projetos
            </h2>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Acompanhe os projetos atualizados recentemente.
            </p>
          </div>

          <Link
            href="/projects"
            className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300"
          >
            Ver projetos
          </Link>
        </div>

        {recentProjects.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {recentProjects.map((project) => {
              const completedTasks = project.tasks.filter(
                (task) => task.status === "done",
              ).length;

              const projectProgress =
                project.tasks.length > 0
                  ? Math.round((completedTasks / project.tasks.length) * 100)
                  : 0;

              return (
                <article
                  key={project.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/projects/${project.id}`}
                        className="block truncate text-lg font-semibold text-slate-950 transition hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:hover:text-blue-300"
                      >
                        {project.name}
                      </Link>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {completedTasks} de {project.tasks.length} tarefas
                        concluídas
                      </p>
                    </div>

                    <strong className="shrink-0 text-blue-600 dark:text-blue-400">
                      {projectProgress}%
                    </strong>
                  </div>

                  <div
                    className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
                    role="progressbar"
                    aria-label={`Progresso do projeto ${project.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={projectProgress}
                  >
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${projectProgress}%`,
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Nenhum projeto cadastrado
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Crie seu primeiro projeto para acompanhar o progresso.
            </p>

            <Link
              href="/projects#new-project"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Criar projeto
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
