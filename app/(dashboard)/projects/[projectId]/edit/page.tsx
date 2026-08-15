import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { EditProjectForm } from "@/components/projects/edit-project-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Editar projeto",
  description: "Atualize ou exclua um projeto do TaskFlow.",
};

interface EditProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
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
    select: {
      id: true,
      name: true,
      description: true,
      color: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Navegação estrutural">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex rounded-md text-sm font-medium text-blue-700 transition hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          ← Voltar para o projeto
        </Link>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-blue-700">Configurações</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Editar projeto
        </h1>

        <p className="mt-3 text-slate-600">
          Atualize as informações ou exclua permanentemente este projeto.
        </p>
      </header>

      <section
        aria-labelledby="edit-project-title"
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <h2
          id="edit-project-title"
          className="text-xl font-semibold text-slate-950"
        >
          Informações do projeto
        </h2>

        <div className="mt-6">
          <EditProjectForm project={project} />
        </div>
      </section>

      <section
        aria-labelledby="danger-zone-title"
        className="mt-8 rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <h2
          id="danger-zone-title"
          className="text-xl font-semibold text-red-800"
        >
          Zona de perigo
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          A exclusão remove permanentemente o projeto e todas as tarefas
          relacionadas.
        </p>

        <div className="mt-6">
          <DeleteProjectButton
            projectId={project.id}
            projectName={project.name}
          />
        </div>
      </section>
    </div>
  );
}
