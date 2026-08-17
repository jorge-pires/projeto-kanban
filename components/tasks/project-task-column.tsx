import { ProjectTaskCard } from "@/components/tasks/project-task-card";

interface ColumnTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: Date | null;
}

interface ProjectTaskColumnProps {
  title: string;
  tasks: ColumnTask[];
  emptyMessage: string;
}

export function ProjectTaskColumn({
  title,
  tasks,
  emptyMessage,
}: ProjectTaskColumnProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{title}</h3>

        <span
          aria-label={`${tasks.length} tarefas`}
          className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
        >
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {tasks.map((task) => (
            <ProjectTaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              dueDate={task.dueDate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
