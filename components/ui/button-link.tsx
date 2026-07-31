import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import {
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button-styles"

import type {
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/button-styles"

interface ButtonLinkProps
  extends ComponentProps<typeof Link> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
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
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </Link>
  )
}