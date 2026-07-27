import { Button } from "@/components/ui/Button"

export function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="max-w-4xl text-5xl font-bold md:text-7xl">
        Organize suas tarefas sem complicação
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-500 mb-8">
        Um Kanban moderno para acompanhar seu trabalho e aumentar sua produtividade.
      </p>

      <Button text="Começar Agora" variant="secondary" size="lg" />
    </section>
  )
}
