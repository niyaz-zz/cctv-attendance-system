"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { LateArrivalData } from "@/types/reports"

interface LateArrivalsChartProps {
  data: LateArrivalData[]
}

const chartConfig = {
  count: {
    label: "Late Arrivals",
    color: "hsl(var(--chart-4))",
  },
}

export function LateArrivalsChart({ data }: LateArrivalsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Late Arrivals by Time</CardTitle>
        <CardDescription>Distribution of late arrivals throughout the morning hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="hour" />
              <YAxis />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value} employees (${data.find((d) => d.count === value)?.percentage.toFixed(1)}%)`,
                      "Late Arrivals",
                    ]}
                  />
                }
              />
              <Bar dataKey="count" fill={chartConfig.count.color} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
