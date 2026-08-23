import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { EditTaskForm } from "@/components/tasks/edit-task-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Editar tarefa",
  description: "Atualize ou exclua uma tarefa do TaskFlow.",
};

interface EditTaskPageProps {
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { projectId, taskId } = await params;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      project: {
        ownerId: session.user.id,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <nav aria-label="Navegação estrutural">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex rounded-md text-sm font-medium text-blue-700 hover:text-blue-900 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
        >
          ← Voltar para o projeto
        </Link>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-blue-700">Tarefa</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Editar tarefa
        </h1>

        <p className="mt-3 text-slate-600">
          Atualize os dados ou mova a tarefa para outra coluna.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <EditTaskForm projectId={projectId} task={task} />
      </section>

      <section className="mt-8 rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-red-800">Zona de perigo</h2>

        <p className="mt-2 text-sm text-slate-600">
          Exclua permanentemente esta tarefa.
        </p>

        <div className="mt-6">
          <DeleteTaskButton
            projectId={projectId}
            taskId={task.id}
            taskTitle={task.title}
          />
        </div>
      </section>
    </div>
  );
}
