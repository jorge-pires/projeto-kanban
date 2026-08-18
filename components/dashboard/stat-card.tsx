interface StatCardProps {
  label: string;
  value: number;
  description: string;
  accent?: "blue" | "amber" | "emerald" | "red";
}

const accentStyles = {
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
};

export function StatCard({
  label,
  value,
  description,
  accent = "blue",
}: StatCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${accentStyles[accent]}`}
        aria-hidden="true"
      />

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </article>
  );
}
