"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";

type ProfileField = "name" | "email";

export interface UpdateProfileState {
  success: boolean;
  message: string;
  errors?: Partial<Record<ProfileField, string[]>>;
}

export async function updateProfile(
  _previousState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  void _previousState;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sua sessão expirou. Entre novamente para atualizar o perfil.",
    };
  }

  const validation = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const userWithSameEmail = await prisma.user.findFirst({
      where: {
        email: validation.data.email,
        id: {
          not: session.user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (userWithSameEmail) {
      return {
        success: false,
        message: "Não foi possível atualizar o perfil.",
        errors: {
          email: ["Este e-mail já está sendo utilizado por outra conta."],
        },
      };
    }

    const result = await prisma.user.updateMany({
      where: {
        id: session.user.id,
      },
      data: validation.data,
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "Sua conta não foi encontrada. Entre novamente.",
      };
    }
  } catch (error) {
    console.error("Failed to update profile:", error);

    return {
      success: false,
      message: "Não foi possível atualizar o perfil agora. Tente novamente.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/tasks");

  return {
    success: true,
    message: "Perfil atualizado com sucesso.",
  };
}
