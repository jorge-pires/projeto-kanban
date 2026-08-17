"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateTask,
  type UpdateTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import { Button } from "@/components/ui/Button";

interface EditableTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date | null;
}

interface EditTaskFormProps {
  projectId: string;
  task: EditableTask;
}

const initialState: UpdateTaskState = {
  success: false,
  message: "",
};

function UpdateTaskSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Salvando alterações..." : "Salvar alterações"}
    </Button>
  );
}

function formatDateInput(date: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function EditTaskForm({ projectId, task }: EditTaskFormProps) {
  const updateTaskWithIds = updateTask.bind(null, projectId, task.id);

  const [state, formAction] = useActionState(updateTaskWithIds, initialState);

  const titleError = state.errors?.title?.[0];
  const descriptionError = state.errors?.description?.[0];
  const priorityError = state.errors?.priority?.[0];
  const dueDateError = state.errors?.dueDate?.[0];
  const statusError = state.errors?.status?.[0];

  return (
    <form action={formAction} noValidate className="grid gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="edit-task-title"
          className="text-sm font-medium text-slate-800"
        >
          Título
        </label>

        <input
          id="edit-task-title"
          name="title"
          type="text"
          defaultValue={task.title}
          required
          minLength={2}
          maxLength={100}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? "edit-task-title-error" : undefined}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {titleError && (
          <p id="edit-task-title-error" className="text-sm text-red-700">
            {titleError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="edit-task-description"
          className="text-sm font-medium text-slate-800"
        >
          Descrição{" "}
          <span className="font-normal text-slate-500">(opcional)</span>
        </label>

        <textarea
          id="edit-task-description"
          name="description"
          rows={5}
          defaultValue={task.description}
          maxLength={500}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={
            descriptionError
              ? "edit-task-description-error"
              : "edit-task-description-help"
          }
          className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {descriptionError ? (
          <p id="edit-task-description-error" className="text-sm text-red-700">
            {descriptionError}
          </p>
        ) : (
          <p id="edit-task-description-help" className="text-sm text-slate-500">
            Máximo de 500 caracteres.
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-task-priority"
            className="text-sm font-medium text-slate-800"
          >
            Prioridade
          </label>

          <select
            id="edit-task-priority"
            name="priority"
            defaultValue={task.priority}
            aria-invalid={Boolean(priorityError)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>

          {priorityError && (
            <p className="text-sm text-red-700">{priorityError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-task-status"
            className="text-sm font-medium text-slate-800"
          >
            Status
          </label>

          <select
            id="edit-task-status"
            name="status"
            defaultValue={task.status}
            aria-invalid={Boolean(statusError)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="todo">A fazer</option>
            <option value="in-progress">Em andamento</option>
            <option value="done">Concluído</option>
          </select>

          {statusError && <p className="text-sm text-red-700">{statusError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="edit-task-due-date"
            className="text-sm font-medium text-slate-800"
          >
            Prazo
          </label>

          <input
            id="edit-task-due-date"
            name="dueDate"
            type="date"
            defaultValue={formatDateInput(task.dueDate)}
            aria-invalid={Boolean(dueDateError)}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          {dueDateError && (
            <p className="text-sm text-red-700">{dueDateError}</p>
          )}
        </div>
      </div>

      {state.message && (
        <p
          role={state.success ? "status" : "alert"}
          aria-live="polite"
          className={
            state.success
              ? "rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800"
              : "rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          }
        >
          {state.message}
        </p>
      )}

      <div>
        <UpdateTaskSubmitButton />
      </div>
    </form>
  );
}
