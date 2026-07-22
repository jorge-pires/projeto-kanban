"use client"

import { useState } from "react"

import { Button } from "@/components/ui/Button"

export function Counter() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount((prevCount) => prevCount + 1)
  }

  function decrement() {
    setCount((prevCount) => prevCount - 1)
  }

  function reset() {
    setCount(0)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-5xl font-bold">
        {count}
      </h2>

      <div className="flex items-center gap-3">
        <Button
          text="-"
          variant="secondary"
          size="md"
          onClick={decrement}
          aria-label="Diminuir contador"
        />

        <Button
          text="Reset"
          variant="secondary"
          size="md"
          onClick={reset}
        />

        <Button
          text="+"
          variant="primary"
          size="md"
          onClick={increment}
          aria-label="Aumentar contador"
        />
      </div>
    </div>
  )
}