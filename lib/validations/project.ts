import { z } from "zod";

export const projectColors = [
  "blue",
  "emerald",
  "violet",
  "amber",
  "rose",
] as const;

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(60, "O nome deve ter no máximo 60 caracteres."),

  description: z
    .string()
    .trim()
    .max(240, "A descrição deve ter no máximo 240 caracteres.")
    .transform((value) => (value.length > 0 ? value : null)),

  color: z.enum(projectColors, {
    message: "Selecione uma cor válida.",
  }),
});

export type ProjectInput = z.infer<typeof projectSchema>;
