import type { Task } from "@/types/task";

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Criar autenticação",
    description:
      "Conectar o formulário de login ao fluxo real de autenticação.",
    status: "todo",
    priority: "high",
    dueDate: "2026-08-12",
  },
  {
    id: "task-2",
    title: "Finalizar página de perfil",
    description: "Adicionar edição das informações do usuário autenticado.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-08-15",
  },
  {
    id: "task-3",
    title: "Construir Dashboard",
    description: "Finalizar os indicadores e a atividade recente.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-08-10",
  },
  {
    id: "task-4",
    title: "Aprimorar menu mobile",
    description: "Revisar acessibilidade e comportamento da navegação móvel.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-08-11",
  },
  {
    id: "task-5",
    title: "Configurar Git e GitHub",
    description: "Organizar commits e publicar o histórico do projeto.",
    status: "done",
    priority: "low",
    dueDate: "2026-08-02",
  },
  {
    id: "task-6",
    title: "Criar landing page",
    description: "Construir a apresentação inicial do TaskFlow.",
    status: "done",
    priority: "medium",
    dueDate: "2026-08-05",
  },
];
