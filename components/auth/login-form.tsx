"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { authenticateUser, type LoginActionState } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";

const initialState: LoginActionState = {
  message: "",
};

function LoginSubmitButton() {
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
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(authenticateUser, initialState);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((previousState) => !previousState);
  }

  const emailError = state.errors?.email?.[0];
  const passwordError = state.errors?.password?.[0];

  return (
    <form action={formAction} noValidate className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-800">
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          required
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
        />

        {emailError && (
          <p id="login-email-error" className="text-sm text-red-700">
            {emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-800"
        >
          Senha
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            required
            minLength={8}
            maxLength={72}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError ? "login-password-error" : undefined
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-24 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 aria-invalid:border-red-600 aria-invalid:ring-red-100"
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={isPasswordVisible}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            {isPasswordVisible ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {passwordError && (
          <p id="login-password-error" className="text-sm text-red-700">
            {passwordError}
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

      <LoginSubmitButton />
    </form>
  );
}
