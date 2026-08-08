import { TaskWorkspace } from "@/components/kanban/task-workspace";

import { tasks } from "@/data/tasks";

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm font-medium text-blue-600">Organização</p>

        <TaskWorkspace initialTasks={tasks} />
      </section>
    </div>
  );
}
