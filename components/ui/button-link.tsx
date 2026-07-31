import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

interface ButtonLinkProps
  extends ComponentProps<typeof Link> {
  children: ReactNode
}

export function ButtonLink({
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        bg-blue-600
        px-5
        py-3
        text-white
        transition
        hover:bg-blue-700
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </Link>
  )
}