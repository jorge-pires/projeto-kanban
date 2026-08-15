import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { ProjectCard } from "@/components/projects/project-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Crie e organize seus projetos no TaskFlow.",
};

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
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                description={project.description}
                color={project.color}
                taskCount={project._count.tasks}
                updatedAt={project.updatedAt}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
