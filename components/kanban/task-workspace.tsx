"use client";

import { useState } from "react";

import { CreateTaskDialog } from "@/components/kanban/create-task-dialog";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { Button } from "@/components/ui/Button";

import type { Task } from "@/types/task";

interface TaskWorkspaceProps {
  initialTasks: Task[];
}

export function TaskWorkspace({ initialTasks }: TaskWorkspaceProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);

  function openCreateTaskDialog() {
    setIsCreateTaskDialogOpen(true);
  }

  function closeCreateTaskDialog() {
    setIsCreateTaskDialogOpen(false);
  }

  function createTask(task: Task) {
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  return (
    <>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            Tarefas
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Organize suas atividades em um fluxo Kanban e acompanhe o progresso
            de cada tarefa.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={openCreateTaskDialog}
        >
          Nova tarefa
        </Button>
      </div>

      <section aria-label="Quadro Kanban de tarefas" className="mt-8">
        <KanbanBoard tasks={tasks} />
      </section>

      <CreateTaskDialog
        isOpen={isCreateTaskDialogOpen}
        onClose={closeCreateTaskDialog}
        onCreateTask={createTask}
      />
    </>
  );
}
