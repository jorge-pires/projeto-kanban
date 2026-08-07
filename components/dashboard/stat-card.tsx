interface StatCardProps {
    label: string
    value: number
    description: string
  }
  
  export function StatCard({
    label,
    value,
    description,
  }: StatCardProps) {
    return (
      <article className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          {label}
        </p>
  
        <p className="mt-3 text-3xl font-bold text-gray-950">
          {value}
        </p>
  
        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      </article>
    )
  }