"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createTask,
  type CreateTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import { Button } from "@/components/ui/Button";

interface CreateTaskFormProps {
  projectId: string;
}

const initialState: CreateTaskState = {
  success: false,
  message: "",
};

function CreateTaskSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Criando tarefa..." : "Criar tarefa"}
    </Button>
  );
}

export function CreateTaskForm({ projectId }: CreateTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const createTaskWithProject = createTask.bind(null, projectId);

  const [state, formAction] = useActionState(
    createTaskWithProject,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const titleError = state.errors?.title?.[0];
  const descriptionError = state.errors?.description?.[0];
  const priorityError = state.errors?.priority?.[0];
  const dueDateError = state.errors?.dueDate?.[0];

  return (
    <section
      id="new-task"
      aria-labelledby="new-task-title"
      className="mt-8 scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-sm font-medium text-blue-700">Nova tarefa</p>

        <h2
          id="new-task-title"
          className="mt-2 text-xl font-semibold text-slate-950"
        >
          Adicione uma atividade
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Toda tarefa nova começa na coluna “A fazer”.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        noValidate
        className="mt-6 grid gap-5 lg:grid-cols-2"
      >
        <div className="flex flex-col gap-2 lg:col-span-2">
          <label
            htmlFor="task-title"
            className="text-sm font-medium text-slate-800"
          >
            Título
          </label>

          <input
            id="task-title"
            name="title"
            type="text"
            placeholder="Ex.: Criar seção de projetos"
            required
            minLength={2}
            maxLength={100}
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? "task-title-error" : undefined}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          {titleError && (
            <p id="task-title-error" className="text-sm text-red-700">
              {titleError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 lg:col-span-2">
          <label
            htmlFor="task-description"
            className="text-sm font-medium text-slate-800"
          >
            Descrição{" "}
            <span className="font-normal text-slate-500">(opcional)</span>
          </label>

          <textarea
            id="task-description"
            name="description"
            rows={4}
            maxLength={500}
            placeholder="Descreva o resultado esperado."
            aria-invalid={Boolean(descriptionError)}
            aria-describedby={
              descriptionError
                ? "task-description-error"
                : "task-description-help"
            }
            className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          {descriptionError ? (
            <p id="task-description-error" className="text-sm text-red-700">
              {descriptionError}
            </p>
          ) : (
            <p id="task-description-help" className="text-sm text-slate-500">
              Máximo de 500 caracteres.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-priority"
            className="text-sm font-medium text-slate-800"
          >
            Prioridade
          </label>

          <select
            id="task-priority"
            name="priority"
            defaultValue="medium"
            aria-invalid={Boolean(priorityError)}
            aria-describedby={priorityError ? "task-priority-error" : undefined}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          >
            <option value="low">Baixa</option>

            <option value="medium">Média</option>

            <option value="high">Alta</option>
          </select>

          {priorityError && (
            <p id="task-priority-error" className="text-sm text-red-700">
              {priorityError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-due-date"
            className="text-sm font-medium text-slate-800"
          >
            Prazo <span className="font-normal text-slate-500">(opcional)</span>
          </label>

          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            aria-invalid={Boolean(dueDateError)}
            aria-describedby={dueDateError ? "task-due-date-error" : undefined}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          {dueDateError && (
            <p id="task-due-date-error" className="text-sm text-red-700">
              {dueDateError}
            </p>
          )}
        </div>

        {state.message && (
          <p
            role={state.success ? "status" : "alert"}
            aria-live="polite"
            className={
              state.success
                ? "rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 lg:col-span-2"
                : "rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2"
            }
          >
            {state.message}
          </p>
        )}

        <div className="lg:col-span-2">
          <CreateTaskSubmitButton />
        </div>
      </form>
    </section>
  );
}
