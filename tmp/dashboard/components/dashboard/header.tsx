"use client"

import { useState } from "react"

const RANGE_7D = "\uCD5C\uADFC 7\uC77C"
const RANGE_30D = "\uCD5C\uADFC 30\uC77C"
const RANGE_ALL = "\uC804\uCCB4"

const ranges = [RANGE_7D, RANGE_30D, RANGE_ALL] as const
type Range = (typeof ranges)[number]

export function DashboardHeader() {
  const [selected, setSelected] = useState<Range>(RANGE_7D)

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {"\uC2E4\uD0C0\uB798 \uAD00\uB9AC\uC790"}
      </h1>
      <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
        {ranges.map((range) => (
          <button
            key={range}
            onClick={() => setSelected(range)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selected === range
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </header>
  )
}
