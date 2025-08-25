"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import type { AttendanceTrendData } from "@/types/reports"

interface AttendanceTrendChartProps {
  data: AttendanceTrendData[]
}

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-2))",
  },
  late: {
    label: "Late",
    color: "hsl(var(--chart-4))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-5))",
  },
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends Over Time</CardTitle>
        <CardDescription>Daily attendance patterns showing present, late, and absent employees</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="present"
                stackId="1"
                stroke={chartConfig.present.color}
                fill={chartConfig.present.color}
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="late"
                stackId="1"
                stroke={chartConfig.late.color}
                fill={chartConfig.late.color}
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="absent"
                stackId="1"
                stroke={chartConfig.absent.color}
                fill={chartConfig.absent.color}
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
