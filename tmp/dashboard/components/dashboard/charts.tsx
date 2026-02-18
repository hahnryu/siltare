"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const dailyInterviews = [
  { date: "2/5", count: 3 },
  { date: "2/6", count: 5 },
  { date: "2/7", count: 4 },
  { date: "2/8", count: 7 },
  { date: "2/9", count: 2 },
  { date: "2/10", count: 6 },
  { date: "2/11", count: 8 },
  { date: "2/12", count: 5 },
  { date: "2/13", count: 9 },
  { date: "2/14", count: 11 },
  { date: "2/15", count: 7 },
  { date: "2/16", count: 10 },
  { date: "2/17", count: 12 },
  { date: "2/18", count: 8 },
]

const revenueData = [
  { date: "1/20", revenue: 120 },
  { date: "1/23", revenue: 200 },
  { date: "1/26", revenue: 180 },
  { date: "1/29", revenue: 350 },
  { date: "2/1", revenue: 280 },
  { date: "2/4", revenue: 420 },
  { date: "2/7", revenue: 390 },
  { date: "2/10", revenue: 510 },
  { date: "2/13", revenue: 480 },
  { date: "2/16", revenue: 620 },
  { date: "2/18", revenue: 700 },
]

function CustomTooltip({ active, payload, label, unit }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; unit?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-card-foreground">
          {unit === "\u20A9" ? `\u20A9${payload[0].value.toLocaleString()}\uB9CC` : `${payload[0].value}\uAC74`}
        </p>
      </div>
    )
  }
  return null
}

export function DailyInterviewsChart() {
  return (
    <Card className="min-w-0 flex-1">
      <CardHeader>
        <CardTitle className="text-base">{"\uC77C\uBCC4 \uC778\uD130\uBDF0 \uC218"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height={240} minWidth={0}>
            <BarChart data={dailyInterviews} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.5 }} />
              <Bar dataKey="count" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function RevenueChart() {
  return (
    <Card className="min-w-0 flex-1">
      <CardHeader>
        <CardTitle className="text-base">{"\uB9E4\uCD9C \uCD94\uC774"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height={240} minWidth={0}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip unit={"\u20A9"} />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-chart-1)", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "var(--color-chart-1)", r: 5, strokeWidth: 2, stroke: "var(--color-card)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
