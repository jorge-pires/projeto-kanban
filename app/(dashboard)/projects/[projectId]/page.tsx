import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ClientSortableProjectBoard } from "@/components/tasks/client-sortable-project-board";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import type { BoardTask } from "@/lib/tasks/board";
import { prisma } from "@/lib/prisma";
import { taskStatusSchema } from "@/lib/validations/task";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    include: {
      tasks: {
        orderBy: [
          {
            status: "asc",
          },
          {
            position: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  });

  if (!project) {
    notFound();
  }

  const tasks: BoardTask[] = project.tasks.flatMap((task) => {
    const statusResult = taskStatusSchema.safeParse(task.status);

    if (!statusResult.success) {
      return [];
    }

    return [
      {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: statusResult.data,
        dueDate: task.dueDate?.toISOString() ?? null,
      },
    ];
  });

  const boardVersion = project.tasks
    .map((task) => {
      return [
        task.id,
        task.status,
        task.position,
        task.title,
        task.updatedAt.toISOString(),
      ].join(":");
    })
    .join("|");

  return (
    <main className="space-y-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center text-sm font-medium text-blue-600 transition hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Voltar para projetos
          </Link>

          <p className="mt-4 text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            Quadro Kanban
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {project.name}
          </h1>

          {project.description ? (
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              {project.description}
            </p>
          ) : (
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Este projeto ainda não possui uma descrição.
            </p>
          )}
        </div>

        <Link
          href={`/projects/${project.id}/edit`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-700 dark:text-slate-200 dark:hover:border-blue-600 dark:hover:text-blue-300"
        >
          Editar projeto
        </Link>
      </header>

      <section
        aria-labelledby="new-task-title"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mb-5">
          <h2
            id="new-task-title"
            className="text-xl font-semibold text-slate-950 dark:text-white"
          >
            Nova tarefa
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Adicione uma atividade ao quadro Kanban.
          </p>
        </div>

        <CreateTaskForm projectId={project.id} />
      </section>

      <section aria-labelledby="project-board-title">
        <div className="mb-5">
          <h2
            id="project-board-title"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Tarefas do projeto
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Use a alça de cada tarefa para mudar sua ordem ou coluna. Também é
            possível usar o teclado.
          </p>
        </div>

        <ClientSortableProjectBoard
          key={boardVersion}
          projectId={project.id}
          initialTasks={tasks}
        />
      </section>
    </main>
  );
}
