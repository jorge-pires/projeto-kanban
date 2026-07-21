import { Button } from "@/components/ui/Button"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">TaskFlow</h1>
          <h2 className="text-xs text-blue-500">Gerencie suas tarefas</h2>
        </div>

        <Button text="Entrar" variant="primary" size="sm" />
      </div>
    </header>
  );
}
