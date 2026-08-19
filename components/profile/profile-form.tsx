"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  updateProfile,
  type UpdateProfileState,
} from "@/app/(dashboard)/profile/actions";

interface ProfileFormProps {
  name: string;
  email: string;
}

const initialState: UpdateProfileState = {
  success: false,
  message: "",
};

function ProfileSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar alterações"}
    </button>
  );
}

export function ProfileForm({ name, email }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];

  return (
    <form action={formAction} noValidate className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="profile-name"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Nome
        </label>

        <input
          id="profile-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          defaultValue={name}
          aria-invalid={Boolean(nameError)}
          aria-describedby={
            nameError ? "profile-name-error" : "profile-name-description"
          }
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 aria-invalid:border-red-600 aria-invalid:ring-red-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        {nameError ? (
          <p
            id="profile-name-error"
            className="mt-2 text-sm text-red-700 dark:text-red-400"
          >
            {nameError}
          </p>
        ) : (
          <p
            id="profile-name-description"
            className="mt-2 text-sm text-slate-500 dark:text-slate-400"
          >
            Este nome será exibido no cabeçalho da sua conta.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          E-mail
        </label>

        <input
          id="profile-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={120}
          defaultValue={email}
          aria-invalid={Boolean(emailError)}
          aria-describedby={
            emailError ? "profile-email-error" : "profile-email-description"
          }
          className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 aria-invalid:border-red-600 aria-invalid:ring-red-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        {emailError ? (
          <p
            id="profile-email-error"
            className="mt-2 text-sm text-red-700 dark:text-red-400"
          >
            {emailError}
          </p>
        ) : (
          <p
            id="profile-email-description"
            className="mt-2 text-sm text-slate-500 dark:text-slate-400"
          >
            Depois da alteração, use o novo e-mail no próximo login.
          </p>
        )}
      </div>

      {state.message ? (
        <p
          role={state.success ? "status" : "alert"}
          aria-live="polite"
          className={`rounded-lg px-4 py-3 text-sm ${
            state.success
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="flex justify-end border-t border-slate-200 pt-5 dark:border-slate-800">
        <ProfileSubmitButton />
      </div>
    </form>
  );
}
