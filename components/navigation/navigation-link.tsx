import type { AnchorHTMLAttributes, ReactNode } from "react";

interface NavigationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  external?: boolean;
}

export function NavigationLink({
  children,
  className,
  external = false,
  ...props
}: NavigationLinkProps) {
  return (
    <a
      {...props}
      target={external ? "_blank" : props.target}
      rel={external ? "noopener noreferrer" : props.rel}
      className={`transition hover:text-blue-600 ${className ?? ""} `}
    >
      {children}
    </a>
  );
}
