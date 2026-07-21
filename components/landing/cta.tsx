import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="px-6 py-20 text-center">
      <h2 className="text-4xl font-bold mb-6 ">
        Comece gratuitamente
      </h2>

      <Button text="Criar Conta" variant="primary" size="md" />
    </section>
  )
}