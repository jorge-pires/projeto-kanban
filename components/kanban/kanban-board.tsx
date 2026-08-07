import { KanbanColumn } from "@/components/kanban/kanban-column"

import type {
  Task,
  TaskStatus,
} from "@/types/task"

interface KanbanBoardProps {
  tasks: Task[]
}

interface KanbanColumnDefinition {
  title: string
  status: TaskStatus
}

const columns: KanbanColumnDefinition[] = [
  {
    title: "A Fazer",
    status: "todo",
  },
  {
    title: "Em Andamento",
    status: "in-progress",
  },
  {
    title: "Concluído",
    status: "done",
  },
]

export function KanbanBoard({
  tasks,
}: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) =>
            task.status === column.status
        )

        return (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={columnTasks}
          />
        )
      })}
    </div>
  )
}