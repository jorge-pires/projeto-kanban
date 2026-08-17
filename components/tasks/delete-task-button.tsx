"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  deleteTask,
  type DeleteTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";

interface DeleteTaskButtonProps {
  projectId: string;
  taskId: string;
  taskTitle: string;
}

const initialState: DeleteTaskState = {
  message: "",
};

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Excluindo..." : "Confirmar exclusão"}
    </button>
  );
}

export function DeleteTaskButton({
  projectId,
  taskId,
  taskTitle,
}: DeleteTaskButtonProps) {
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const deleteTaskWithIds = deleteTask.bind(null, projectId, taskId);

  const [state, formAction] = useActionState(deleteTaskWithIds, initialState);

  if (!isConfirmationVisible) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirmationVisible(true)}
        className="rounded-xl border border-red-300 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
      >
        Excluir tarefa
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="font-medium text-red-950">Excluir “{taskTitle}”?</p>

      <p className="mt-2 text-sm text-red-800">
        Essa ação não poderá ser desfeita.
      </p>

      {state.message && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <form
        action={formAction}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <ConfirmDeleteButton />

        <button
          type="button"
          onClick={() => setIsConfirmationVisible(false)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
