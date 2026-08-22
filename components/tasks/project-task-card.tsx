import Link from "next/link";

import { MoveTaskControls } from "@/components/tasks/move-task-controls";

interface ProjectTaskCardProps {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: Date | null;
}

const priorityStyles = {
  low: {
    label: "Baixa",
    className: "bg-emerald-50 text-emerald-700",
  },
  medium: {
    label: "Média",
    className: "bg-amber-50 text-amber-800",
  },
  high: {
    label: "Alta",
    className: "bg-red-50 text-red-700",
  },
} as const;

type TaskPriority = keyof typeof priorityStyles;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function getPriorityStyle(priority: string) {
  if (priority in priorityStyles) {
    return priorityStyles[priority as TaskPriority];
  }

  return priorityStyles.medium;
}

export function ProjectTaskCard({
  id,
  projectId,
  title,
  description,
  priority,
  status,
  dueDate,
}: ProjectTaskCardProps) {
  const priorityStyle = getPriorityStyle(priority);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold wrap-break-word text-slate-950">
          {title}
        </h4>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle.className}`}
        >
          {priorityStyle.label}
        </span>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-6 wrap-break-word text-slate-600">
          {description}
        </p>
      )}

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {dueDate
          ? `Prazo: ${dateFormatter.format(dueDate)}`
          : "Sem prazo definido"}
      </p>

      <MoveTaskControls
        projectId={projectId}
        taskId={id}
        currentStatus={status}
      />

      <Link
        href={`/projects/${projectId}/tasks/${id}/edit`}
        aria-label={`Editar a tarefa ${title}`}
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
      >
        Editar tarefa
      </Link>
    </article>
  );
}
