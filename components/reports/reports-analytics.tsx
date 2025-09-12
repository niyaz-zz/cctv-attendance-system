"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, BarChart3, TrendingUp, Users, Clock } from "lucide-react"

import { AttendanceTrendChart } from "./attendance-trend-chart"
import { DepartmentBreakdownChart } from "./department-breakdown-chart"
import { LateArrivalsChart } from "./late-arrivals-chart"
import { MonthlyOverviewChart } from "./monthly-overview-chart"

import type {
  ReportFilters,
  AttendanceTrendData,
  DepartmentData,
  LateArrivalData,
  MonthlyData,
} from "@/types/reports"

export function ReportsAnalytics() {
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    department: "All Departments",
  })

  const [attendanceTrendData, setAttendanceTrendData] = useState<AttendanceTrendData[]>([])
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([])
  const [lateArrivalData, setLateArrivalData] = useState<LateArrivalData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])

  // Replace with API call later
  useEffect(() => {
    const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"]
    const fromDate = new Date(filters.dateFrom)
    const toDate = new Date(filters.dateTo)
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))

    // Attendance trend mock
    const trendData: AttendanceTrendData[] = Array.from({ length: daysDiff + 1 }, (_, i) => {
      const date = new Date(fromDate)
      date.setDate(date.getDate() + i)
      const total = 50 + Math.floor(Math.random() * 20)
      const present = Math.floor(total * (0.8 + Math.random() * 0.15))
      const late = Math.floor(present * (0.1 + Math.random() * 0.1))
      return {
        date: date.toISOString().split("T")[0],
        present: present - late,
        absent: total - present,
        late,
        total,
        attendanceRate: (present / total) * 100,
      }
    })

    // Department breakdown mock
    const deptData: DepartmentData[] = departments.map((dept) => {
      const total = 8 + Math.floor(Math.random() * 12)
      const present = Math.floor(total * (0.75 + Math.random() * 0.2))
      const late = Math.floor(present * (0.05 + Math.random() * 0.15))
      return {
        department: dept,
        present: present - late,
        absent: total - present,
        late,
        total,
        attendanceRate: (present / total) * 100,
      }
    })

    // Late arrivals mock
    const hours = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00"]
    const hourCounts = hours.map(() => Math.floor(Math.random() * 15) + 1)
    const totalLate = hourCounts.reduce((a, b) => a + b, 0)
    const lateData: LateArrivalData[] = hours.map((hour, i) => ({
      hour,
      count: hourCounts[i],
      percentage: (hourCounts[i] / totalLate) * 100,
    }))

    // Monthly overview mock
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()
    const monthlyOverview: MonthlyData[] = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - 5 + i + 12) % 12
      return {
        month: months[monthIndex],
        avgAttendance: 75 + Math.random() * 20,
        avgLateArrivals: 5 + Math.random() * 10,
        avgWorkingHours: 7.5 + Math.random() * 1.5,
      }
    })

    setAttendanceTrendData(trendData)
    setDepartmentData(
      filters.department === "All Departments"
        ? deptData
        : deptData.filter((d) => d.department === filters.department),
    )
    setLateArrivalData(lateData)
    setMonthlyData(monthlyOverview)
  }, [filters])

  // Stats summary
  const summaryStats = useMemo(() => {
    const totalRecords = attendanceTrendData.reduce((sum, d) => sum + d.total, 0)
    const totalPresent = attendanceTrendData.reduce((sum, d) => sum + d.present + d.late, 0)
    const totalLate = attendanceTrendData.reduce((sum, d) => sum + d.late, 0)
    const avgAttendanceRate =
      attendanceTrendData.reduce((sum, d) => sum + d.attendanceRate, 0) / attendanceTrendData.length || 0

    return {
      totalRecords,
      totalPresent,
      totalLate,
      avgAttendanceRate,
      lateRate: totalPresent ? (totalLate / totalPresent) * 100 : 0,
    }
  }, [attendanceTrendData])

  const handleExportReport = () => {
    const reportData = {
      summary: summaryStats,
      attendanceTrend: attendanceTrendData,
      departmentBreakdown: departmentData,
      lateArrivals: lateArrivalData,
      monthlyOverview: monthlyData,
      generatedAt: new Date().toISOString(),
      filters,
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `attendance-report-${filters.dateFrom}-to-${filters.dateTo}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive attendance insights and trends</p>
        </div>
        <Button onClick={handleExportReport} className="bg-primary">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateFrom">From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
              />
            </div>
            <div>
              <Label>Department</Label>
              <Select
                value={filters.department}
                onValueChange={(v) => setFilters((f) => ({ ...f, department: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Avg Attendance Rate" value={`${summaryStats.avgAttendanceRate.toFixed(1)}%`} icon={<TrendingUp />} />
        <StatCard title="Total Present" value={summaryStats.totalPresent.toLocaleString()} icon={<Users />} />
        <StatCard
          title="Late Arrivals"
          value={summaryStats.totalLate.toLocaleString()}
          extra={`${summaryStats.lateRate.toFixed(1)}% of present`}
          icon={<Clock />}
        />
        <StatCard title="Total Records" value={summaryStats.totalRecords.toLocaleString()} icon={<BarChart3 />} />
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="late">Late</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="trends"><AttendanceTrendChart data={attendanceTrendData} /></TabsContent>
        <TabsContent value="departments"><DepartmentBreakdownChart data={departmentData} /></TabsContent>
        <TabsContent value="late"><LateArrivalsChart data={lateArrivalData} /></TabsContent>
        <TabsContent value="monthly"><MonthlyOverviewChart data={monthlyData} /></TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, extra, icon }: { title: string; value: string; extra?: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-heading">{value}</div>
        {extra && <p className="text-xs text-muted-foreground mt-1">{extra}</p>}
      </CardContent>
    </Card>
  )
}
