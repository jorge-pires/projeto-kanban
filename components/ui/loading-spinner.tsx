interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({
  label = "Carregando conteúdo",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-4"
    >
      <span
        aria-hidden="true"
        className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
      />

      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}
