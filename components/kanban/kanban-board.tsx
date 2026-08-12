import { KanbanColumn } from "@/components/kanban/kanban-column";

import type { Task, TaskStatus } from "@/types/task";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

interface KanbanColumnDefinition {
  title: string;
  status: TaskStatus;
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
];

export function KanbanBoard({
  tasks,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status,
        );

        return (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={columnTasks}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        );
      })}
    </div>
  );
}
