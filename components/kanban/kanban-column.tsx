import { TaskCard } from "@/components/kanban/task-card"

import type {
  Task,
  TaskStatus,
} from "@/types/task"

interface KanbanColumnProps {
  title: string
  status: TaskStatus
  tasks: Task[]
}

export function KanbanColumn({
  title,
  status,
  tasks,
}: KanbanColumnProps) {
  return (
    <section
      aria-labelledby={`column-${status}`}
      className="rounded-2xl bg-gray-100 p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id={`column-${status}`}
          className="font-semibold text-gray-950"
        >
          {title}
        </h2>

        <span
          aria-label={`${tasks.length} tarefas`}
          className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-600"
        >
          {tasks.length}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
            <p className="text-sm text-gray-500">
              Nenhuma tarefa nesta etapa.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}