interface ButtonProps {
  text: string
}

export function Button({ text }: ButtonProps) {
  return (
    <button className="rounded-xl bg-blue-600 px-8 py-4 text-white transition hover:bg-blue-700">
        {text}
    </button>
  )
}