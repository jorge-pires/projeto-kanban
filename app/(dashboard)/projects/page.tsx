export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <section>
        <p className="text-sm font-medium text-blue-600">Planejamento</p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Projetos
            </h1>

            <p className="mt-3 max-w-2xl text-gray-600">
              Agrupe tarefas relacionadas e acompanhe diferentes frentes de
              trabalho em um único lugar.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Novo projeto
          </button>
        </div>
      </section>

      <section
        aria-labelledby="projects-empty-title"
        className="mt-8 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div className="flex min-h-80 flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700"
          >
            P
          </div>

          <h2
            id="projects-empty-title"
            className="mt-5 text-xl font-semibold text-gray-950"
          >
            Nenhum projeto criado
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            Crie um projeto para reunir tarefas relacionadas e acompanhar seu
            progresso com mais organização.
          </p>
        </div>
      </section>
    </div>
  );
}
