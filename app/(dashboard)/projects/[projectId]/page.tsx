import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
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
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

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

            <h1 className="mt-3 wrap-break-words text-3xl font-bold tracking-tight text-slate-950">
              {project.name}
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {project.description ??
                "Este projeto ainda não possui uma descrição."}
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-slate-100 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-slate-950">
              {project._count.tasks}
            </p>

            <p className="text-xs text-slate-600">
              {project._count.tasks === 1 ? "tarefa" : "tarefas"}
            </p>
          </div>
        </div>
      </header>

      <section aria-labelledby="project-board-title" className="mt-8">
        <div>
          <p className="text-sm font-medium text-blue-700">Organização</p>

          <h2
            id="project-board-title"
            className="mt-2 text-2xl font-semibold text-slate-950"
          >
            Quadro do projeto
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            As tarefas deste projeto serão organizadas por status neste quadro
            Kanban.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">A fazer</h3>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                0
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <p className="text-sm text-slate-500">Nenhuma tarefa</p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">Em andamento</h3>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                0
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <p className="text-sm text-slate-500">Nenhuma tarefa</p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">Concluído</h3>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                0
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <p className="text-sm text-slate-500">Nenhuma tarefa</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
