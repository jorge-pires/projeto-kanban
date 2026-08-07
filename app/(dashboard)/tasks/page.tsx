import { KanbanBoard } from "@/components/kanban/kanban-board"
import { tasks } from "@/data/tasks"

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Organização
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Tarefas
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Organize suas atividades em um fluxo Kanban e
              acompanhe o progresso de cada tarefa.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Nova tarefa
          </button>
        </div>
      </section>

      <section
        aria-label="Quadro Kanban de tarefas"
        className="mt-8"
      >
        <KanbanBoard tasks={tasks} />
      </section>
    </div>
  )
}