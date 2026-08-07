import type {
  Task,
  TaskPriority,
} from "@/types/task"

interface TaskCardProps {
  task: Task
}

const priorityLabels: Record<
  TaskPriority,
  string
> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
}

const priorityStyles: Record<
  TaskPriority,
  string
> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
}

export function TaskCard({
  task,
}: TaskCardProps) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-950">
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {task.description}
      </p>

      <div className="mt-4 border-t pt-3">
        <p className="text-xs text-gray-500">
          Prazo
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {task.dueDate}
        </p>
      </div>
    </article>
  )
}