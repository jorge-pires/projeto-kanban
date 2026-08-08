"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";

import type { Task, TaskPriority } from "@/types/task";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Task) => void;
}

export function CreateTaskDialog({
  isOpen,
  onClose,
  onCreateTask,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!normalizedTitle || !normalizedDescription || !dueDate) {
      setError("Preencha todos os campos.");
      return;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: normalizedTitle,
      description: normalizedDescription,
      status: "todo",
      priority,
      dueDate,
    };

    onCreateTask(newTask);
    resetForm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar formulário de nova tarefa"
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/60"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-task-title"
              className="text-xl font-semibold text-gray-950"
            >
              Nova tarefa
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Adicione uma atividade ao seu quadro Kanban.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Fechar
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-title"
              className="text-sm font-medium text-gray-700"
            >
              Título
            </label>

            <input
              id="task-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Criar tela de configurações"
              autoFocus
              required
              className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-description"
              className="text-sm font-medium text-gray-700"
            >
              Descrição
            </label>

            <textarea
              id="task-description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descreva o que precisa ser feito."
              rows={4}
              required
              className="resize-none rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-priority"
                className="text-sm font-medium text-gray-700"
              >
                Prioridade
              </label>

              <select
                id="task-priority"
                name="priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="rounded-lg border bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="low">Baixa</option>

                <option value="medium">Média</option>

                <option value="high">Alta</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="task-due-date"
                className="text-sm font-medium text-gray-700"
              >
                Prazo
              </label>

              <input
                id="task-due-date"
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
                className="rounded-lg border px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleClose}
            >
              Cancelar
            </Button>

            <Button type="submit" variant="primary" size="md">
              Criar tarefa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
