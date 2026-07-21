import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { Counter } from "@/components/ui/Counter"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Counter />
      <Footer />
    </>
  )
}