"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import type { MonthlyData } from "@/types/reports"

interface MonthlyOverviewChartProps {
  data: MonthlyData[]
}

const chartConfig = {
  avgAttendance: {
    label: "Avg Attendance (%)",
    color: "hsl(var(--chart-2))",
  },
  avgLateArrivals: {
    label: "Avg Late Arrivals (%)",
    color: "hsl(var(--chart-4))",
  },
  avgWorkingHours: {
    label: "Avg Working Hours",
    color: "hsl(var(--chart-1))",
  },
}

export function MonthlyOverviewChart({ data }: MonthlyOverviewChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance & Late Arrivals</CardTitle>
          <CardDescription>Trends in attendance rates and late arrivals over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}%`,
                        name === "avgAttendance" ? "Attendance" : "Late Arrivals",
                      ]}
                    />
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgAttendance"
                  stroke={chartConfig.avgAttendance.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.avgAttendance.color }}
                />
                <Line
                  type="monotone"
                  dataKey="avgLateArrivals"
                  stroke={chartConfig.avgLateArrivals.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.avgLateArrivals.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Working Hours</CardTitle>
          <CardDescription>Monthly trend of average working hours per employee</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis domain={[6, 10]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${Number(value).toFixed(1)} hours`, "Avg Working Hours"]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="avgWorkingHours"
                  stroke={chartConfig.avgWorkingHours.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.avgWorkingHours.color }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
