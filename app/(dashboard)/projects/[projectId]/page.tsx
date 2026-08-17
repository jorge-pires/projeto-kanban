import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { ProjectTaskColumn } from "@/components/tasks/project-task-column";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Detalhes do projeto",
  description: "Acompanhe as tarefas e o progresso do projeto no TaskFlow.",
};

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const projectColorStyles = {
  blue: "bg-blue-600",
  emerald: "bg-emerald-600",
  violet: "bg-violet-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
} as const;

type ProjectColor = keyof typeof projectColorStyles;

function getProjectColor(color: string) {
  if (color in projectColorStyles) {
    return projectColorStyles[color as ProjectColor];
  }

  return projectColorStyles.blue;
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
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const todoTasks = project.tasks.filter((task) => task.status === "todo");

  const inProgressTasks = project.tasks.filter(
    (task) => task.status === "in-progress",
  );

  const doneTasks = project.tasks.filter((task) => task.status === "done");

  const colorClass = getProjectColor(project.color);

  return (
    <div className="mx-auto max-w-7xl">
      <nav aria-label="Navegação estrutural">
        <Link
          href="/projects"
          className="inline-flex rounded-md text-sm font-medium text-blue-700 transition hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          ← Voltar para projetos
        </Link>
      </nav>

      <header className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`size-4 shrink-0 rounded-full ${colorClass}`}
              />

              <p className="text-sm font-medium text-blue-700">Projeto</p>
            </div>

            <h1 className="mt-3 wrap-break-word text-3xl font-bold tracking-tight text-slate-950">
              {project.name}
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {project.description ??
                "Este projeto ainda não possui uma descrição."}
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href={`/projects/${project.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Editar projeto
            </Link>

            <a
              href="#new-task"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Nova tarefa
            </a>
          </div>
        </div>
      </header>

      <CreateTaskForm projectId={project.id} />

      <section aria-labelledby="project-board-title" className="mt-8">
        <p className="text-sm font-medium text-blue-700">Organização</p>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2
              id="project-board-title"
              className="text-2xl font-semibold text-slate-950"
            >
              Quadro do projeto
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Acompanhe as tarefas de acordo com seu estágio.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            {project.tasks.length}{" "}
            {project.tasks.length === 1 ? "tarefa" : "tarefas"}
          </p>
        </div>

        <div className="mt-5 grid items-start gap-4 lg:grid-cols-3">
          <ProjectTaskColumn
            title="A fazer"
            tasks={todoTasks}
            emptyMessage="Nenhuma tarefa a fazer."
          />

          <ProjectTaskColumn
            title="Em andamento"
            tasks={inProgressTasks}
            emptyMessage="Nenhuma tarefa em andamento."
          />

          <ProjectTaskColumn
            title="Concluído"
            tasks={doneTasks}
            emptyMessage="Nenhuma tarefa concluída."
          />
        </div>
      </section>
    </div>
  );
}
