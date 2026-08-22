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

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  function openCreateTaskDialog() {
    setEditingTask(null);
    setIsTaskDialogOpen(true);
  }

  function openEditTaskDialog(task: Task) {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  }

  function closeTaskDialog() {
    setIsTaskDialogOpen(false);
    setEditingTask(null);
  }

  function saveTask(task: Task) {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? task : currentTask,
        ),
      );

      return;
    }

    setTasks((currentTasks) => [...currentTasks, task]);
  }

  function deleteTask(taskId: string) {
    const shouldDelete = window.confirm(
      "Deseja realmente excluir esta tarefa?",
    );

    if (!shouldDelete) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
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
        <KanbanBoard
          tasks={tasks}
          onEditTask={openEditTaskDialog}
          onDeleteTask={deleteTask}
        />
      </section>

      {isTaskDialogOpen && (
        <CreateTaskDialog
          task={editingTask}
          onClose={closeTaskDialog}
          onSubmitTask={saveTask}
        />
      )}
    </>
  );
}
