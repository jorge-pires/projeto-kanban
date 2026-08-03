"use client"

import { useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/Button"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] =
    useState("")
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false)

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setSuccessMessage("")

    if (!email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    if (password.length < 6) {
      setError(
        "A senha deve ter pelo menos 6 caracteres."
      )
      return
    }

    setSuccessMessage(
      "Formulário validado. A autenticação será conectada em uma próxima etapa."
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col gap-5"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="voce@exemplo.com"
          autoComplete="email"
          aria-describedby={
            error ? "login-error" : undefined
          }
          required
          className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Senha
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Digite sua senha"
            autoComplete="current-password"
            aria-describedby={
              error ? "login-error" : undefined
            }
            required
            minLength={6}
            className="w-full rounded-lg border px-4 py-3 pr-20 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={() =>
              setIsPasswordVisible((visible) => !visible)
            }
            aria-label={
              isPasswordVisible
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-blue-600 transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-100"
          >
            {isPasswordVisible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>

      {error && (
        <p
          id="login-error"
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full"
      > 
        Entrar
      </Button>
    </form>
  )
}