"use client"

import { useState } from "react"

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
        <button
          onClick={decrement}
          className="rounded-xl bg-gray-600 px-6 py-3 text-white transition hover:bg-gray-700"
        >
          -
        </button>

        <button
          onClick={reset}
          className="rounded-xl bg-gray-600 px-6 py-3 text-white transition hover:bg-gray-700"
        >
          Reset
        </button>

        <button
          onClick={increment}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          +
        </button>
      </div>
    </div>
  )
}