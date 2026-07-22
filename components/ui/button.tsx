import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700",
  secondary: "bg-gray-600 hover:bg-gray-700",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  text,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-xl
        text-white
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className ?? ""}
      `}
      {...props}
    >
      {text}
    </button>
  );
}
