"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react"
import type { AttendanceRecord } from "@/types/attendance"

interface AttendanceStatsProps {
  records: AttendanceRecord[]
}

export function AttendanceStats({ records }: AttendanceStatsProps) {
  const stats = {
    totalRecords: records.length,
    presentCount: records.filter((r) => r.status === "present").length,
    lateCount: records.filter((r) => r.status === "late").length,
    absentCount: records.filter((r) => r.status === "absent").length,
    averageDuration:
      records.filter((r) => r.duration).reduce((acc, r) => acc + (r.duration || 0), 0) /
        records.filter((r) => r.duration).length || 0,
  }

  const attendanceRate =
    stats.totalRecords > 0 ? ((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100 : 0

  const statCards = [
    {
      title: "Total Records",
      value: stats.totalRecords.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Present",
      value: stats.presentCount.toLocaleString(),
      icon: UserCheck,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      subtitle: `${((stats.presentCount / stats.totalRecords) * 100 || 0).toFixed(1)}% of records`,
    },
    {
      title: "Average Hours",
      value: (stats.averageDuration / 60).toFixed(1),
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
      subtitle: "Per working day",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      subtitle: "Present + Late",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{card.value}</div>
            {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
