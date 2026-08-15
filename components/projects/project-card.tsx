import Link from "next/link";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
  color: string;
  taskCount: number;
  updatedAt: Date;
}

const projectColorStyles = {
  blue: {
    indicator: "bg-blue-600",
    badge: "bg-blue-50 text-blue-700",
  },
  emerald: {
    indicator: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-700",
  },
  violet: {
    indicator: "bg-violet-600",
    badge: "bg-violet-50 text-violet-700",
  },
  amber: {
    indicator: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800",
  },
  rose: {
    indicator: "bg-rose-600",
    badge: "bg-rose-50 text-rose-700",
  },
} as const;

type ProjectColor = keyof typeof projectColorStyles;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function getProjectColorStyle(color: string) {
  if (color in projectColorStyles) {
    return projectColorStyles[color as ProjectColor];
  }

  return projectColorStyles.blue;
}

export function ProjectCard({
  id,
  name,
  description,
  color,
  taskCount,
  updatedAt,
}: ProjectCardProps) {
  const colorStyle = getProjectColorStyle(color);

  return (
    <article className="relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${colorStyle.indicator}`}
      />

      <div className="flex w-full flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-950">{name}</h3>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${colorStyle.badge}`}
          >
            {taskCount} {taskCount === 1 ? "tarefa" : "tarefas"}
          </span>
        </div>

        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
          {description ?? "Projeto sem descrição."}
        </p>

        <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Atualizado em {dateFormatter.format(updatedAt)}
        </p>

        <Link
          href={`/projects/${id}`}
          aria-label={`Abrir o projeto ${name}`}
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Abrir projeto
        </Link>
      </div>
    </article>
  );
}
