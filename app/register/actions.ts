"use server";

import { hash } from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  getClientAddress,
} from "@/lib/security/rate-limit";
import { registerSchema } from "@/lib/validations/auth";

type RegisterField = "name" | "email" | "password" | "passwordConfirmation";

export interface RegisterActionState {
  message: string;
  errors?: Partial<Record<RegisterField, string[]>>;
}

export async function registerUser(
  _previousState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const requestHeaders = await headers();
  const rateLimit = await consumeRateLimit({
    scope: "registration-address",
    identifier: getClientAddress(requestHeaders),
    limit: 5,
    windowMs: 60 * 60 * 1_000,
  });

  if (!rateLimit.allowed) {
    return {
      message: "Muitas tentativas foram realizadas. Aguarde e tente novamente.",
    };
  }

  const validation = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validation.success) {
    return {
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    return {
      message:
        "Não foi possível concluir o cadastro com os dados informados.",
    };
  }

  const passwordHash = await hash(password, 12);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        message:
          "Não foi possível concluir o cadastro com os dados informados.",
      };
    }

    console.error("Failed to register user:", error);

    return {
      message: "Não foi possível criar sua conta agora. Tente novamente.",
    };
  }

  redirect("/login?registered=true");
}
