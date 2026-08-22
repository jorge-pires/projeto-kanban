"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  createProject,
  type CreateProjectState,
} from "@/app/(dashboard)/projects/actions";
import { Button } from "@/components/ui/Button";

const initialState: CreateProjectState = {
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

function CreateProjectSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Criando projeto..." : "Criar projeto"}
    </Button>
  );
}

export function CreateProjectForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(createProject, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const nameError = state.errors?.name?.[0];
  const descriptionError = state.errors?.description?.[0];
  const colorError = state.errors?.color?.[0];

  return (
    <section
      id="new-project"
      aria-labelledby="new-project-title"
      className="mt-8 scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-sm font-medium text-blue-700">Novo projeto</p>

        <h2
          id="new-project-title"
          className="mt-2 text-xl font-semibold text-slate-950"
        >
          Crie uma área de trabalho
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Dê um nome ao projeto, descreva seu objetivo e escolha uma cor para
          identificá-lo.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        noValidate
        className="mt-6 grid gap-5"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="project-name"
            className="text-sm font-medium text-slate-800"
          >
            Nome do projeto
          </label>

          <input
            id="project-name"
            name="name"
            type="text"
            autoComplete="off"
            placeholder="Ex.: Portfólio profissional"
            required
            minLength={2}
            maxLength={60}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "project-name-error" : undefined}
            className="rounded-lg border border-slate-300 px-4 py-3 transition outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          {nameError && (
            <p id="project-name-error" className="text-sm text-red-700">
              {nameError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="project-description"
            className="text-sm font-medium text-slate-800"
          >
            Descrição{" "}
            <span className="font-normal text-slate-500">(opcional)</span>
          </label>

          <textarea
            id="project-description"
            name="description"
            rows={4}
            maxLength={240}
            placeholder="Descreva o objetivo principal deste projeto."
            aria-invalid={Boolean(descriptionError)}
            aria-describedby={
              descriptionError
                ? "project-description-error"
                : "project-description-help"
            }
            className="resize-y rounded-lg border border-slate-300 px-4 py-3 transition outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          {descriptionError ? (
            <p id="project-description-error" className="text-sm text-red-700">
              {descriptionError}
            </p>
          ) : (
            <p id="project-description-help" className="text-sm text-slate-500">
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
                  defaultChecked={option.value === "blue"}
                  className="peer sr-only"
                />

                <span className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-100 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none hover:bg-slate-50">
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
          <CreateProjectSubmitButton />
        </div>
      </form>
    </section>
  );
}
