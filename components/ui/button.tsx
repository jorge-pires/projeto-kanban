interface ButtonProps {
  text: string
  variant: "primary" | "secondary"
}

export function Button({ text, variant }: ButtonProps) {
  const buttonStyles =
  variant === "primary"
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-gray-600 hover:bg-gray-700"

  return (
    <button className={`rounded-xl px-8 py-4 text-white transition ${buttonStyles}`}>
        {text}
    </button>
  )
}