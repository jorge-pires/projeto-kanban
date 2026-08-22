import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Informe um e-mail válido.");

const loginPasswordSchema = z
  .string()
  .min(1, "Informe sua senha.")
  .max(72, "A senha deve ter no máximo 72 caracteres.");

const registrationPasswordSchema = z
  .string()
  .min(10, "A senha deve ter pelo menos 10 caracteres.")
  .max(72, "A senha deve ter no máximo 72 caracteres.");

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(80, "O nome deve ter no máximo 80 caracteres."),
    email: emailSchema,
    password: registrationPasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
  });

export type LoginInput = z.infer<typeof loginSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
