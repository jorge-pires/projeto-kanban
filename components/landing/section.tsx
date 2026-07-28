import type {
  HTMLAttributes,
  ReactNode,
} from "react"

interface SectionProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

export function Section({
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={`
        mx-auto
        max-w-6xl
        px-6
        py-20
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </section>
  )
}