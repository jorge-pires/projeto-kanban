"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

export function Counter() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount((prevCount) => prevCount + 1);
  }

  function decrement() {
    setCount((prevCount) => prevCount - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-5xl font-bold">{count}</h2>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={decrement}
          aria-label="Diminuir contador"
        >
          -
        </Button>

        <Button variant="secondary" size="md" onClick={reset}>
          Reset
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={increment}
          aria-label="Aumentar contador"
        >
          +
        </Button>
      </div>
    </div>
  );
}
