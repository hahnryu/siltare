"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  changeLabel?: string
  subtitle?: string
  positive?: boolean
}

function MetricCard({ title, value, change, changeLabel, subtitle, positive = true }: MetricCardProps) {
  return (
    <Card className="gap-3 py-5">
      <CardContent className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {change && (
            <span className={`flex items-center text-xs font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}>
              <ArrowUpRight className="size-3" />
              {change}
            </span>
          )}
        </div>
        {(changeLabel || subtitle) && (
          <p className="text-xs text-muted-foreground">{changeLabel || subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}

const metrics: MetricCardProps[] = [
  {
    title: "\uCD1D \uC778\uD130\uBDF0",
    value: "127\uAC74",
    change: "+23%",
    changeLabel: "\uC9C0\uB09C\uC8FC \uB300\uBE44",
    positive: true,
  },
  {
    title: "\uCD1D \uB179\uC74C \uC2DC\uAC04",
    value: "63.5\uC2DC\uAC04",
    subtitle: "\uD3C9\uADE0 30\uBD84",
  },
  {
    title: "\uC804\uD658\uC728",
    value: "34.2%",
    subtitle: "\uC778\uD130\uBDF0 \uC644\uB8CC \u2192 \uCC45 \uC8FC\uBB38",
  },
  {
    title: "\uB9E4\uCD9C",
    value: "\u20A94,920,000",
    change: "+18%",
    changeLabel: "\uC9C0\uB09C\uB2EC \uB300\uBE44",
    positive: true,
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}
