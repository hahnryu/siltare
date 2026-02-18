"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const generationData = [
  { name: "70\uB300", value: 42, color: "#C4956A" },
  { name: "60\uB300", value: 38, color: "#D4A97A" },
  { name: "80\uB300+", value: 15, color: "#8B6544" },
  { name: "50\uB300", value: 5, color: "#E0C09A" },
]

const topicData = [
  { topic: "\uC5B4\uB9B0 \uC2DC\uC808", percent: 89 },
  { topic: "\uC790\uB140\uC5D0\uAC8C \uD558\uACE0 \uC2F6\uC740 \uB9D0", percent: 76 },
  { topic: "\uACB0\uD63C \uC774\uC57C\uAE30", percent: 71 },
  { topic: "\uAC00\uC7A5 \uD798\uB4E4\uC5C8\uB358 \uC2DC\uAE30", percent: 65 },
  { topic: "\uC778\uC0DD\uC758 \uC804\uD658\uC810", percent: 52 },
]

function TopicTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { topic: string; percent: number } }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-card-foreground">{payload[0].payload.topic}</p>
        <p className="text-sm font-bold text-primary">{payload[0].payload.percent}%</p>
      </div>
    )
  }
  return null
}

export function GenerationDistribution() {
  return (
    <Card className="min-w-0 flex-1">
      <CardHeader>
        <CardTitle className="text-base">{"\uC138\uB300\uBCC4 \uBD84\uD3EC"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={generationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {generationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {generationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="size-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-card-foreground">{item.name}</span>
                <span className="text-sm font-semibold text-card-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TopicFrequency() {
  return (
    <Card className="min-w-0 flex-1">
      <CardHeader>
        <CardTitle className="text-base">{"\uC8FC\uC694 \uC8FC\uC81C \uBE48\uB3C4"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height={200} minWidth={0}>
            <BarChart
              data={topicData}
              layout="vertical"
              margin={{ left: 0, right: 16 }}
              barSize={16}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="topic"
                width={130}
                tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<TopicTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
              <Bar dataKey="percent" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
