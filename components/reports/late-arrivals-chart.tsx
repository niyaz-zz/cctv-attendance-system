"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
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
                    formatter={(value, name, props) => {
                      const percentage = props?.payload?.percentage
                      return [`${value} employees (${percentage?.toFixed(1)}%)`, chartConfig.count.label]
                    }}
                  />
                }
              />
              <Legend />
              <Bar dataKey="count" name={chartConfig.count.label} fill={chartConfig.count.color} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
