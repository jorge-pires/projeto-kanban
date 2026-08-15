"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";

type LoginField = "email" | "password";

export interface LoginActionState {
  message: string;
  errors?: Partial<Record<LoginField, string[]>>;
}

export async function authenticateUser(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const validation = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.success) {
    return {
      message: "Revise os campos destacados e tente novamente.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "E-mail ou senha incorretos.",
          };

        default:
          return {
            message: "Não foi possível entrar agora. Tente novamente.",
          };
      }
    }

    throw error;
  }

  return {
    message: "",
  };
}
