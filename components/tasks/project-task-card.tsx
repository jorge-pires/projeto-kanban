interface ProjectTaskCardProps {
  title: string;
  description: string;
  priority: string;
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
  title,
  description,
  priority,
  dueDate,
}: ProjectTaskCardProps) {
  const priorityStyle = getPriorityStyle(priority);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h4 className="wrap-break-word font-semibold text-slate-950">
          {title}
        </h4>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle.className}`}
        >
          {priorityStyle.label}
        </span>
      </div>

      {description && (
        <p className="mt-3 wrap-break-word text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {dueDate
          ? `Prazo: ${dateFormatter.format(dueDate)}`
          : "Sem prazo definido"}
      </p>
    </article>
  );
}
