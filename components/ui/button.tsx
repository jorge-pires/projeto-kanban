interface ButtonProps {
  text: string
  variant: "primary" | "secondary"
  size: "sm" | "md" | "lg"
}

export function Button({ text, variant, size }: ButtonProps) {
  const variants = {
  primary: "bg-blue-600 hover:bg-blue-700",
  secondary: "bg-gray-600 hover:bg-gray-700",
  }

  const sizes = {
  sm: "text-sm py-2 px-4",
  md: "text-base py-4 px-8",
  lg: "text-lg py-6 px-12",
  }

  return (
    <button className={`rounded-xl ${sizes[size]} text-white transition ${variants[variant]}`}>
        {text}
    </button>
  )
}