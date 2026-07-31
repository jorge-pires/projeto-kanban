import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

type ButtonLinkVariant =
  | "primary"
  | "secondary"

type ButtonLinkSize =
  | "sm"
  | "md"
  | "lg"

interface ButtonLinkProps
  extends ComponentProps<typeof Link> {
  children: ReactNode
  variant?: ButtonLinkVariant
  size?: ButtonLinkSize
}

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "border border-blue-600 text-blue-600 hover:bg-blue-50",
}

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-8 py-4 text-lg",
}

export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
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
        font-medium
        transition
        ${variants[variant]}
        ${sizes[size]}
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </Link>
  )
}