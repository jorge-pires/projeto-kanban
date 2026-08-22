"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { registerUser, type RegisterActionState } from "@/app/register/actions";
import { Button } from "@/components/ui/Button";

const initialState: RegisterActionState = {
  message: "",
};

function RegisterSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      className="w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Criando conta..." : "Criar conta"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, initialState);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((previousState) => !previousState);
  }

  const nameError = state.errors?.name?.[0];
  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];
  const passwordConfirmationError = state.errors?.passwordConfirmation?.[0];

  return (
    <form action={formAction} noValidate className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-800">
          Nome
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Digite seu nome"
          required
          minLength={2}
          maxLength={80}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "name-error" : undefined}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {nameError && (
          <p id="name-error" className="text-sm text-red-700">
            {nameError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="register-email"
          className="text-sm font-medium text-slate-800"
        >
          E-mail
        </label>

        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          required
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "register-email-error" : undefined}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {emailError && (
          <p id="register-email-error" className="text-sm text-red-700">
            {emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="register-password"
          className="text-sm font-medium text-slate-800"
        >
          Senha
        </label>

        <div className="relative">
          <input
            id="register-password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Crie uma senha"
            required
            minLength={10}
            maxLength={72}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError
                ? "register-password-error"
                : "password-requirements"
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-24 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Ocultar senhas" : "Mostrar senhas"}
            aria-pressed={isPasswordVisible}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {isPasswordVisible ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {passwordError ? (
          <p id="register-password-error" className="text-sm text-red-700">
            {passwordError}
          </p>
        ) : (
          <p id="password-requirements" className="text-sm text-slate-500">
            Use entre 10 e 72 caracteres.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password-confirmation"
          className="text-sm font-medium text-slate-800"
        >
          Confirmar senha
        </label>

        <input
          id="password-confirmation"
          name="passwordConfirmation"
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Digite a senha novamente"
          required
          minLength={10}
          maxLength={72}
          aria-invalid={Boolean(passwordConfirmationError)}
          aria-describedby={
            passwordConfirmationError
              ? "password-confirmation-error"
              : undefined
          }
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {passwordConfirmationError && (
          <p id="password-confirmation-error" className="text-sm text-red-700">
            {passwordConfirmationError}
          </p>
        )}
      </div>

      {state.message && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      )}

      <RegisterSubmitButton />
    </form>
  );
}
