"use client"

import { useState } from "react"

import { Button } from "@/components/ui/Button"

export function LoginForm() {
  return (
    <form className="mt-8 flex flex-col gap-5">
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
          placeholder="voce@exemplo.com"
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

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Digite sua senha"
          className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </div>

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