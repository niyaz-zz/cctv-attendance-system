"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import type { DepartmentData } from "@/types/reports"

interface DepartmentBreakdownChartProps {
  data: DepartmentData[]
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
  attendanceRate: {
    label: "Attendance Rate",
    color: "hsl(var(--chart-1))",
  },
}

export function DepartmentBreakdownChart({ data }: DepartmentBreakdownChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Attendance Breakdown</CardTitle>
          <CardDescription>Employee attendance status by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="present" stackId="a" fill={chartConfig.present.color} />
                <Bar dataKey="late" stackId="a" fill={chartConfig.late.color} />
                <Bar dataKey="absent" stackId="a" fill={chartConfig.absent.color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Attendance Rates</CardTitle>
          <CardDescription>Attendance percentage by department</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent formatter={(value) => [`${Number(value).toFixed(1)}%`, "Attendance Rate"]} />
                  }
                />
                <Bar dataKey="attendanceRate" fill={chartConfig.attendanceRate.color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
