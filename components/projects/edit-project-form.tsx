"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateProject,
  type UpdateProjectState,
} from "@/app/(dashboard)/projects/actions";
import { Button } from "@/components/ui/Button";

interface EditableProject {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

interface EditProjectFormProps {
  project: EditableProject;
}

const initialState: UpdateProjectState = {
  success: false,
  message: "",
};

const colorOptions = [
  {
    value: "blue",
    label: "Azul",
    className: "bg-blue-600",
  },
  {
    value: "emerald",
    label: "Verde",
    className: "bg-emerald-600",
  },
  {
    value: "violet",
    label: "Violeta",
    className: "bg-violet-600",
  },
  {
    value: "amber",
    label: "Âmbar",
    className: "bg-amber-500",
  },
  {
    value: "rose",
    label: "Rosa",
    className: "bg-rose-600",
  },
] as const;

function UpdateProjectSubmitButton() {
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

export function EditProjectForm({ project }: EditProjectFormProps) {
  const updateProjectWithId = updateProject.bind(null, project.id);

  const [state, formAction] = useActionState(updateProjectWithId, initialState);

  const nameError = state.errors?.name?.[0];
  const descriptionError = state.errors?.description?.[0];
  const colorError = state.errors?.color?.[0];

  return (
    <form action={formAction} noValidate className="grid gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="edit-project-name"
          className="text-sm font-medium text-slate-800"
        >
          Nome do projeto
        </label>

        <input
          id="edit-project-name"
          name="name"
          type="text"
          defaultValue={project.name}
          required
          minLength={2}
          maxLength={60}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "edit-project-name-error" : undefined}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {nameError && (
          <p id="edit-project-name-error" className="text-sm text-red-700">
            {nameError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="edit-project-description"
          className="text-sm font-medium text-slate-800"
        >
          Descrição{" "}
          <span className="font-normal text-slate-500">(opcional)</span>
        </label>

        <textarea
          id="edit-project-description"
          name="description"
          rows={5}
          defaultValue={project.description ?? ""}
          maxLength={240}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={
            descriptionError
              ? "edit-project-description-error"
              : "edit-project-description-help"
          }
          className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {descriptionError ? (
          <p
            id="edit-project-description-error"
            className="text-sm text-red-700"
          >
            {descriptionError}
          </p>
        ) : (
          <p
            id="edit-project-description-help"
            className="text-sm text-slate-500"
          >
            Máximo de 240 caracteres.
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-800">
          Cor do projeto
        </legend>

        <div className="mt-3 flex flex-wrap gap-3">
          {colorOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="color"
                value={option.value}
                defaultChecked={project.color === option.value}
                className="peer sr-only"
              />

              <span className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-100 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2">
                <span
                  aria-hidden="true"
                  className={`size-4 rounded-full ${option.className}`}
                />

                {option.label}
              </span>
            </label>
          ))}
        </div>

        {colorError && (
          <p className="mt-2 text-sm text-red-700">{colorError}</p>
        )}
      </fieldset>

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
        <UpdateProjectSubmitButton />
      </div>
    </form>
  );
}
