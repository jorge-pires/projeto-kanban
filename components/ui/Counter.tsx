"use client"

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-5xl font-bold">
        {count}
      </h2>

      <button onClick={() => setCount(count + 1)} className="rounded-xl bg-blue-600 px-6 py-3 text-white">
        +
      </button>
    </div>
  )
}