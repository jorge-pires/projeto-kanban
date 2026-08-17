import { z } from "zod";

export const taskPriorities = ["low", "medium", "high"] as const;

export const taskStatuses = ["todo", "in-progress", "done"] as const;

const dueDateSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === "") {
        return true;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
      }

      return !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
    },
    {
      message: "Informe uma data válida.",
    },
  )
  .transform((value) => (value ? new Date(`${value}T00:00:00.000Z`) : null));

const taskFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "O título deve ter pelo menos 2 caracteres.")
    .max(100, "O título deve ter no máximo 100 caracteres."),

  description: z
    .string()
    .trim()
    .max(500, "A descrição deve ter no máximo 500 caracteres."),

  priority: z.enum(taskPriorities, {
    message: "Selecione uma prioridade válida.",
  }),

  dueDate: dueDateSchema,
});

export const createTaskSchema = taskFieldsSchema;

export const updateTaskSchema = taskFieldsSchema.extend({
  status: z.enum(taskStatuses, {
    message: "Selecione um status válido.",
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
