"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { taskStatusSchema, type TaskStatus } from "@/lib/validations/task";

export interface MoveTaskState {
  success: boolean;
  message: string;
}

export async function moveTask(
  projectId: string,
  taskId: string,
  targetStatus: TaskStatus,
  _previousState: MoveTaskState,
  _formData: FormData,
): Promise<MoveTaskState> {
  void _previousState;
  void _formData;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para mover a tarefa.",
    };
  }

  const statusValidation = taskStatusSchema.safeParse(targetStatus);

  if (!statusValidation.success) {
    return {
      success: false,
      message: "O status selecionado é inválido.",
    };
  }

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
      status: true,
    },
  });

  if (!task) {
    return {
      success: false,
      message:
        "A tarefa não foi encontrada ou você não tem permissão para movê-la.",
    };
  }

  if (task.status === statusValidation.data) {
    return {
      success: true,
      message: "A tarefa já está nessa coluna.",
    };
  }

  try {
    const highestPosition = await prisma.task.aggregate({
      where: {
        projectId,
        status: statusValidation.data,
      },
      _max: {
        position: true,
      },
    });

    const nextPosition = (highestPosition._max.position ?? -1) + 1;

    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: statusValidation.data,
        position: nextPosition,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("Failed to move task:", error);

    return {
      success: false,
      message: "Não foi possível mover a tarefa agora. Tente novamente.",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Tarefa movida com sucesso.",
  };
}
