interface FeatureCardProps {
  title: string
  description: string
}

export function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="rounded-xl border p-6 shadow-sm">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {description}
      </p>
    </article>
  )
}