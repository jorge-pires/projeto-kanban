"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations/task";

type TaskField = "title" | "description" | "priority" | "dueDate";

export interface CreateTaskState {
  success: boolean;
  message: string;
  errors?: Partial<Record<TaskField, string[]>>;
}

export async function createTask(
  projectId: string,
  _previousState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  void _previousState;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para criar a tarefa.",
    };
  }

  const validation = createTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!project) {
    return {
      success: false,
      message:
        "O projeto não foi encontrado ou você não tem permissão para adicionar tarefas.",
    };
  }

  try {
    const highestPosition = await prisma.task.aggregate({
      where: {
        projectId: project.id,
        status: "todo",
      },
      _max: {
        position: true,
      },
    });

    const nextPosition = (highestPosition._max.position ?? -1) + 1;

    await prisma.task.create({
      data: {
        ...validation.data,
        status: "todo",
        position: nextPosition,
        projectId: project.id,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("Failed to create task:", error);

    return {
      success: false,
      message: "Não foi possível criar a tarefa agora. Tente novamente.",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Tarefa criada com sucesso.",
  };
}
