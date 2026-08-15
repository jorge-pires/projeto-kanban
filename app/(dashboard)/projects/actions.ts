"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";

type ProjectField = "name" | "description" | "color";

interface ProjectErrors {
  errors?: Partial<Record<ProjectField, string[]>>;
}

export interface CreateProjectState extends ProjectErrors {
  success: boolean;
  message: string;
}

export interface UpdateProjectState extends ProjectErrors {
  success: boolean;
  message: string;
}

export interface DeleteProjectState {
  message: string;
}

export async function createProject(
  _previousState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  void _previousState;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para criar o projeto.",
    };
  }

  const validation = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.project.create({
      data: {
        ...validation.data,
        ownerId: session.user.id,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("Failed to create project:", error);

    return {
      success: false,
      message: "Não foi possível criar o projeto agora. Tente novamente.",
    };
  }

  revalidatePath("/projects");

  return {
    success: true,
    message: "Projeto criado com sucesso.",
  };
}

export async function updateProject(
  projectId: string,
  _previousState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  void _previousState;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para editar o projeto.",
    };
  }

  const validation = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await prisma.project.updateMany({
      where: {
        id: projectId,
        ownerId: session.user.id,
      },
      data: validation.data,
    });

    if (result.count === 0) {
      return {
        success: false,
        message:
          "O projeto não foi encontrado ou você não tem permissão para editá-lo.",
      };
    }
  } catch (error) {
    console.error("Failed to update project:", error);

    return {
      success: false,
      message: "Não foi possível atualizar o projeto agora. Tente novamente.",
    };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/edit`);

  return {
    success: true,
    message: "Projeto atualizado com sucesso.",
  };
}

export async function deleteProject(
  projectId: string,
  _previousState: DeleteProjectState,
  _formData: FormData,
): Promise<DeleteProjectState> {
  void _previousState;
  void _formData;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "Sua sessão expirou. Entre novamente para excluir o projeto.",
    };
  }

  try {
    const result = await prisma.project.deleteMany({
      where: {
        id: projectId,
        ownerId: session.user.id,
      },
    });

    if (result.count === 0) {
      return {
        message:
          "O projeto não foi encontrado ou você não tem permissão para excluí-lo.",
      };
    }
  } catch (error) {
    console.error("Failed to delete project:", error);

    return {
      message: "Não foi possível excluir o projeto agora. Tente novamente.",
    };
  }

  revalidatePath("/projects");
  redirect("/projects");
}
