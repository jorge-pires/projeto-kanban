import { StatCard } from "@/components/dashboard/stat-card"

const dashboardStats = [
  {
    label: "Total de tarefas",
    value: 12,
    description: "Todas as tarefas cadastradas.",
  },
  {
    label: "Em andamento",
    value: 4,
    description: "Tarefas sendo executadas agora.",
  },
  {
    label: "Concluídas",
    value: 6,
    description: "Tarefas finalizadas com sucesso.",
  },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm font-medium text-blue-600">
          Visão geral
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
          Acompanhe sua produtividade
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Visualize o andamento das suas tarefas e identifique
          rapidamente o que precisa da sua atenção.
        </p>
      </section>

      <section
        aria-label="Resumo das tarefas"
        className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-950">
          Atividade recente
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          As atualizações das suas tarefas aparecerão aqui.
        </p>

        <div className="mt-6 rounded-xl border border-dashed bg-gray-50 px-6 py-12 text-center">
          <p className="font-medium text-gray-700">
            Nenhuma atividade registrada
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Crie ou mova uma tarefa para começar a preencher
            este histórico.
          </p>
        </div>
      </section>
    </div>
  )
}