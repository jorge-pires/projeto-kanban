export function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="max-w-4xl text-5xl font-bold md:text-7xl">
        Organize suas tarefas sem complicação
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-500">
        Um Kanban moderno para acompanhar seu trabalho e aumentar sua produtividade.
      </p>

      <button className="mt-8 rounded-xl bg-blue-600 px-8 py-4 text-lg text-white hover:bg-blue-700">
        Começar Agora
      </button>
    </section>
  )
}
