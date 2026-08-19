export default function CalendarLoading() {
  return (
    <main
      className="mx-auto max-w-6xl space-y-8"
      aria-busy="true"
      aria-label="Carregando calendário"
    >
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>

      <span className="sr-only">Carregando feriados nacionais...</span>
    </main>
  );
}
