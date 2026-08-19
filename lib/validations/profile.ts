import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),

  email: z
    .string()
    .trim()
    .email("Digite um endereço de e-mail válido.")
    .max(120, "O e-mail deve ter no máximo 120 caracteres.")
    .transform((value) => value.toLowerCase()),
});

export type ProfileInput = z.infer<typeof profileSchema>;
