export type ButtonVariant =
  | "primary"
  | "secondary"

export type ButtonSize =
  | "sm"
  | "md"
  | "lg"

export const buttonVariants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700",
  secondary:
    "border border-blue-600 text-blue-600 hover:bg-blue-50",
}

export const buttonSizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-8 py-4 text-lg",
}