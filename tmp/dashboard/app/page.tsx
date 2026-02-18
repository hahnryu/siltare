import { DashboardHeader } from "@/components/dashboard/header"
import { MetricCards } from "@/components/dashboard/metric-cards"
import { DailyInterviewsChart, RevenueChart } from "@/components/dashboard/charts"
import { InterviewTable } from "@/components/dashboard/interview-table"
import { GenerationDistribution, TopicFrequency } from "@/components/dashboard/insights"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <DashboardHeader />

          <section aria-label={"\uD575\uC2EC \uC9C0\uD45C"}>
            <MetricCards />
          </section>

          <section aria-label={"\uCC28\uD2B8"} className="flex flex-col gap-4 lg:flex-row">
            <DailyInterviewsChart />
            <RevenueChart />
          </section>

          <section aria-label={"\uCD5C\uADFC \uC778\uD130\uBDF0"}>
            <InterviewTable />
          </section>

          <section aria-label={"\uB370\uC774\uD130 \uC778\uC0AC\uC774\uD2B8"}>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">{"\uB370\uC774\uD130 \uC778\uC0AC\uC774\uD2B8"}</h2>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              <GenerationDistribution />
              <TopicFrequency />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
