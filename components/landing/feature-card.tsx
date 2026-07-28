interface FeatureCardProps {
  title: string
  description: string
  highlighted?: boolean
  badgeText?: string
}

export function FeatureCard({
  title,
  description,
  highlighted = false,
  badgeText,
}: FeatureCardProps) {
  const highlightedStyles = highlighted
    ? "border-blue-600 bg-blue-50"
    : "border-gray-200 bg-white"

  return (
    <article
      className={`
        rounded-xl
        border
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-lg
        ${highlightedStyles}
      `}
    >
      {highlighted && badgeText && (
        <span className="mb-4 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {badgeText}
        </span>
      )}

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {description}
      </p>
    </article>
  )
}