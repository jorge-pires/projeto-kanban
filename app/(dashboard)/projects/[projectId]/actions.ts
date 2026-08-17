"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";

type CreateTaskField = "title" | "description" | "priority" | "dueDate";

type UpdateTaskField = CreateTaskField | "status";

export interface CreateTaskState {
  success: boolean;
  message: string;
  errors?: Partial<Record<CreateTaskField, string[]>>;
}

export interface UpdateTaskState {
  success: boolean;
  message: string;
  errors?: Partial<Record<UpdateTaskField, string[]>>;
}

export interface DeleteTaskState {
  message: string;
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

  revalidateProjectPages(projectId);

  return {
    success: true,
    message: "Tarefa criada com sucesso.",
  };
}

export async function updateTask(
  projectId: string,
  taskId: string,
  _previousState: UpdateTaskState,
  formData: FormData,
): Promise<UpdateTaskState> {
  void _previousState;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para editar a tarefa.",
    };
  }

  const validation = updateTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    dueDate: formData.get("dueDate"),
    status: formData.get("status"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
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
      position: true,
    },
  });

  if (!task) {
    return {
      success: false,
      message:
        "A tarefa não foi encontrada ou você não tem permissão para editá-la.",
    };
  }

  try {
    let position = task.position;

    if (task.status !== validation.data.status) {
      const highestPosition = await prisma.task.aggregate({
        where: {
          projectId,
          status: validation.data.status,
        },
        _max: {
          position: true,
        },
      });

      position = (highestPosition._max.position ?? -1) + 1;
    }

    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        ...validation.data,
        position,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("Failed to update task:", error);

    return {
      success: false,
      message: "Não foi possível atualizar a tarefa agora. Tente novamente.",
    };
  }

  revalidateProjectPages(projectId);

  return {
    success: true,
    message: "Tarefa atualizada com sucesso.",
  };
}

export async function deleteTask(
  projectId: string,
  taskId: string,
  _previousState: DeleteTaskState,
  _formData: FormData,
): Promise<DeleteTaskState> {
  void _previousState;
  void _formData;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Sua sessão expirou. Entre novamente para excluir a tarefa.",
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
    },
  });

  if (!task) {
    return {
      message:
        "A tarefa não foi encontrada ou você não tem permissão para excluí-la.",
    };
  }

  try {
    await prisma.task.delete({
      where: {
        id: task.id,
      },
    });
  } catch (error) {
    console.error("Failed to delete task:", error);

    return {
      message: "Não foi possível excluir a tarefa agora. Tente novamente.",
    };
  }

  revalidateProjectPages(projectId);
  redirect(`/projects/${projectId}`);
}

function revalidateProjectPages(projectId: string) {
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
