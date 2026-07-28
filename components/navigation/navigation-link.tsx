import type {
  AnchorHTMLAttributes,
  ReactNode,
} from "react"

interface NavigationLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
}

export function NavigationLink({
  children,
  className,
  ...props
}: NavigationLinkProps) {
  return (
    <a
      className={`
        transition
        hover:text-blue-600
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </a>
  )
}