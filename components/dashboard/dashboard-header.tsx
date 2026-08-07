interface DashboardHeaderProps {
    onOpenMenu: () => void
  }
  
  export function DashboardHeader({
    onOpenMenu,
  }: DashboardHeaderProps) {
    return (
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menu de navegação"
            className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 lg:hidden"
          >
            Menu
          </button>
  
          <div>
            <p className="text-xs text-gray-500">
              Área de trabalho
            </p>
  
            <p className="font-semibold text-gray-900">
              Dashboard
            </p>
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900">
              Jorge
            </p>
  
            <p className="text-xs text-gray-500">
              Desenvolvedor
            </p>
          </div>
  
          <div
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
          >
            JP
          </div>
        </div>
      </header>
    )
  }