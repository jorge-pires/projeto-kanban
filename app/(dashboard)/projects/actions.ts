"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/project";

type ProjectField = "name" | "description" | "color";

export interface CreateProjectState {
  success: boolean;
  message: string;
  errors?: Partial<Record<ProjectField, string[]>>;
}

export async function createProject(
  _previousState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
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
