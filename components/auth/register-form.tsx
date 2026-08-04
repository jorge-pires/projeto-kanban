"use client"

import { useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/Button"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] =
    useState("")

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setSuccessMessage("")

    const normalizedName = name.trim()
    const normalizedEmail = email.trim()

    if (
      !normalizedName ||
      !normalizedEmail ||
      !password ||
      !passwordConfirmation
    ) {
      setError("Preencha todos os campos.")
      return
    }

    if (password.length < 6) {
      setError(
        "A senha deve ter pelo menos 6 caracteres."
      )
      return
    }

    if (password !== passwordConfirmation) {
      setError("As senhas não coincidem.")
      return
    }

    setSuccessMessage(
      "Cadastro validado. A criação da conta será conectada em uma próxima etapa."
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-8 flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-sm font-medium"
        >
          Nome
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          autoComplete="name"
          placeholder="Digite seu nome"
          aria-describedby={
            error ? "register-error" : undefined
          }
          required
          className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="register-email"
          className="text-sm font-medium"
        >
          E-mail
        </label>

        <input
          id="register-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoComplete="email"
          placeholder="voce@exemplo.com"
          aria-describedby={
            error ? "register-error" : undefined
          }
          required
          className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="register-password"
          className="text-sm font-medium"
        >
          Senha
        </label>

        <input
          id="register-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          autoComplete="new-password"
          placeholder="Crie uma senha"
          aria-describedby={
            error ? "register-error" : undefined
          }
          required
          minLength={6}
          className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password-confirmation"
          className="text-sm font-medium"
        >
          Confirme a senha
        </label>

        <input
          id="password-confirmation"
          name="passwordConfirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(event) =>
            setPasswordConfirmation(
              event.target.value
            )
          }
          autoComplete="new-password"
          placeholder="Digite a senha novamente"
          aria-describedby={
            error ? "register-error" : undefined
          }
          required
          minLength={6}
          className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <p
          id="register-error"
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
        Criar conta
      </Button>
    </form>
  )
}