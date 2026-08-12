import type { Task, TaskPriority } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

function formatDueDate(dueDate: string) {
  const date = new Date(`${dueDate}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-950">{task.title}</h3>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-500">{task.description}</p>

      <div className="mt-4 border-t pt-3">
        <p className="text-xs text-gray-500">Prazo</p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {formatDueDate(task.dueDate)}
        </p>
      </div>

      <div className="mt-4 flex gap-2 border-t pt-4">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg border px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}
