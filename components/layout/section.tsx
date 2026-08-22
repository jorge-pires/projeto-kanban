import type { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
}

export function Section({
  children,
  title,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={`mx-auto max-w-6xl px-6 py-20 ${className ?? ""} `}
      {...props}
    >
      {title && (
        <h2 className="mb-10 text-center text-3xl font-bold">{title}</h2>
      )}

      {children}
    </section>
  );
}
