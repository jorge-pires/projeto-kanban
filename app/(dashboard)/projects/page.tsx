import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Crie e organize seus projetos no TaskFlow.",
};

const projectColorStyles = {
  blue: {
    indicator: "bg-blue-600",
    badge: "bg-blue-50 text-blue-700",
  },
  emerald: {
    indicator: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },
  violet: {
    indicator: "bg-violet-600",
    badge: "bg-violet-50 text-violet-700",
  },
  amber: {
    indicator: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800",
  },
  rose: {
    indicator: "bg-rose-600",
    badge: "bg-rose-50 text-rose-700",
  },
} as const;

type ProjectColor = keyof typeof projectColorStyles;

function getProjectColorStyle(color: string) {
  if (color in projectColorStyles) {
    return projectColorStyles[color as ProjectColor];
  }

  return projectColorStyles.blue;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm font-medium text-blue-700">Planejamento</p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Projetos
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Agrupe tarefas relacionadas e acompanhe diferentes frentes de
              trabalho em um único lugar.
            </p>
          </div>

          <a
            href="#new-project"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Novo projeto
          </a>
        </div>
      </section>

      <CreateProjectForm />

      <section aria-labelledby="projects-list-title" className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="projects-list-title"
            className="text-xl font-semibold text-slate-950"
          >
            Seus projetos
          </h2>

          <p className="text-sm text-slate-500">
            {projects.length} {projects.length === 1 ? "projeto" : "projetos"}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700"
              >
                P
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-950">
                Nenhum projeto criado
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Preencha o formulário acima para criar seu primeiro projeto e
                começar a organizar tarefas.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const colorStyle = getProjectColorStyle(project.color);

              return (
                <article
                  key={project.id}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 ${colorStyle.indicator}`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {project.name}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${colorStyle.badge}`}
                    >
                      {project._count.tasks}{" "}
                      {project._count.tasks === 1 ? "tarefa" : "tarefas"}
                    </span>
                  </div>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                    {project.description ?? "Projeto sem descrição."}
                  </p>

                  <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    Atualizado em {dateFormatter.format(project.updatedAt)}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
