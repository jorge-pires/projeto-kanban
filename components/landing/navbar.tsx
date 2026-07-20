export function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">TaskFlow</h1>
          <h2 className="text-xs text-blue-500">Gerencie suas tarefas</h2>
        </div>

        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Entrar
        </button>
      </div>
    </header>
  );
}
