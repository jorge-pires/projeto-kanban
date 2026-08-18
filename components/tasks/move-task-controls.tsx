"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  moveTask,
  type MoveTaskState,
} from "@/app/(dashboard)/projects/[projectId]/move-task-actions";
import type { TaskStatus } from "@/lib/validations/task";

interface MoveTaskControlsProps {
  projectId: string;
  taskId: string;
  currentStatus: string;
}

interface MoveOption {
  label: string;
  pendingLabel: string;
  targetStatus: TaskStatus;
  variant: "primary" | "secondary";
}

const initialState: MoveTaskState = {
  success: false,
  message: "",
};

const moveOptions: Record<TaskStatus, MoveOption[]> = {
  todo: [
    {
      label: "Iniciar",
      pendingLabel: "Iniciando...",
      targetStatus: "in-progress",
      variant: "primary",
    },
  ],

  "in-progress": [
    {
      label: "Voltar",
      pendingLabel: "Movendo...",
      targetStatus: "todo",
      variant: "secondary",
    },
    {
      label: "Concluir",
      pendingLabel: "Concluindo...",
      targetStatus: "done",
      variant: "primary",
    },
  ],

  done: [
    {
      label: "Reabrir",
      pendingLabel: "Reabrindo...",
      targetStatus: "in-progress",
      variant: "secondary",
    },
  ],
};

function isTaskStatus(status: string): status is TaskStatus {
  return status === "todo" || status === "in-progress" || status === "done";
}

interface MoveTaskButtonProps {
  projectId: string;
  taskId: string;
  option: MoveOption;
}

function MoveSubmitButton({ option }: { option: MoveOption }) {
  const { pending } = useFormStatus();

  const variantClass =
    option.variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClass}`}
    >
      {pending ? option.pendingLabel : option.label}
    </button>
  );
}

function MoveTaskButton({ projectId, taskId, option }: MoveTaskButtonProps) {
  const moveTaskWithData = moveTask.bind(
    null,
    projectId,
    taskId,
    option.targetStatus,
  );

  const [state, formAction] = useActionState(moveTaskWithData, initialState);

  return (
    <div className="flex-1">
      <form action={formAction} className="flex">
        <MoveSubmitButton option={option} />
      </form>

      {!state.success && state.message && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {state.message}
        </p>
      )}
    </div>
  );
}

export function MoveTaskControls({
  projectId,
  taskId,
  currentStatus,
}: MoveTaskControlsProps) {
  const normalizedStatus: TaskStatus = isTaskStatus(currentStatus)
    ? currentStatus
    : "todo";

  const options = moveOptions[normalizedStatus];

  return (
    <div aria-label="Mover tarefa" className="mt-4 flex gap-2">
      {options.map((option) => (
        <MoveTaskButton
          key={option.targetStatus}
          projectId={projectId}
          taskId={taskId}
          option={option}
        />
      ))}
    </div>
  );
}
