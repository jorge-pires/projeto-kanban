import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react"

import {
  buttonSizes,
  buttonVariants,
} from "@/components/ui/button-styles"

import type {
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/button-styles"

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </button>
  )
}