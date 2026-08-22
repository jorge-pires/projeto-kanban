"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  hasSequentialTaskPositions,
  type TaskOrderUpdate,
} from "@/lib/tasks/board";
import { taskStatusSchema } from "@/lib/validations/task";

export type { TaskOrderUpdate } from "@/lib/tasks/board";

export interface SaveTaskOrderResult {
  success: boolean;
  message: string;
}

export async function saveTaskOrder(
  projectId: string,
  updates: TaskOrderUpdate[],
): Promise<SaveTaskOrderResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente.",
    };
  }

  if (!projectId || !Array.isArray(updates)) {
    return {
      success: false,
      message: "Não foi possível identificar as tarefas.",
    };
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: {
      id: true,
      tasks: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!project) {
    return {
      success: false,
      message: "Projeto não encontrado.",
    };
  }

  const projectTaskIds = new Set(project.tasks.map((task) => task.id));

  const receivedTaskIds = new Set(updates.map((task) => task.id));

  const containsEveryTask =
    projectTaskIds.size === receivedTaskIds.size &&
    [...projectTaskIds].every((taskId) => {
      return receivedTaskIds.has(taskId);
    });

  if (!containsEveryTask) {
    return {
      success: false,
      message: "A lista de tarefas está desatualizada. Recarregue a página.",
    };
  }

  const hasValidUpdates = updates.every((task) => {
    const validStatus = taskStatusSchema.safeParse(task.status);

    return (
      typeof task.id === "string" &&
      projectTaskIds.has(task.id) &&
      validStatus.success &&
      Number.isInteger(task.position) &&
      task.position >= 0
    );
  });

  if (!hasValidUpdates || !hasSequentialTaskPositions(updates)) {
    return {
      success: false,
      message: "A nova ordem das tarefas é inválida.",
    };
  }

  try {
    await prisma.$transaction(
      updates.map((task) => {
        return prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            status: task.status,
            position: task.position,
          },
        });
      }),
    );

    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/projects");
    revalidatePath("/tasks");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Ordem das tarefas salva.",
    };
  } catch (error) {
    console.error("Erro ao ordenar tarefas:", error);

    return {
      success: false,
      message: "Não foi possível salvar a nova ordem. Tente novamente.",
    };
  }
}
