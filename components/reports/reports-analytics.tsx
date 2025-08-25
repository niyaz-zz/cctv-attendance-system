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
import type { ReportFilters, AttendanceTrendData, DepartmentData, LateArrivalData, MonthlyData } from "@/types/reports"

export function ReportsAnalytics() {
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Last 30 days
    dateTo: new Date().toISOString().split("T")[0],
    department: "All Departments",
  })

  const [attendanceTrendData, setAttendanceTrendData] = useState<AttendanceTrendData[]>([])
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([])
  const [lateArrivalData, setLateArrivalData] = useState<LateArrivalData[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])

  // Mock data generation - replace with real API calls
  useEffect(() => {
    const generateMockData = () => {
      const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"]
      const fromDate = new Date(filters.dateFrom)
      const toDate = new Date(filters.dateTo)
      const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))

      // Generate attendance trend data
      const trendData: AttendanceTrendData[] = []
      for (let i = 0; i <= daysDiff; i++) {
        const date = new Date(fromDate)
        date.setDate(date.getDate() + i)
        const dateString = date.toISOString().split("T")[0]

        const total = 50 + Math.floor(Math.random() * 20) // 50-70 employees
        const present = Math.floor(total * (0.8 + Math.random() * 0.15)) // 80-95% attendance
        const late = Math.floor(present * (0.1 + Math.random() * 0.1)) // 10-20% of present are late
        const absent = total - present

        trendData.push({
          date: dateString,
          present: present - late,
          absent,
          late,
          total,
          attendanceRate: (present / total) * 100,
        })
      }

      // Generate department breakdown data
      const deptData: DepartmentData[] = departments.map((dept) => {
        const total = 8 + Math.floor(Math.random() * 12) // 8-20 employees per department
        const present = Math.floor(total * (0.75 + Math.random() * 0.2)) // 75-95% attendance
        const late = Math.floor(present * (0.05 + Math.random() * 0.15)) // 5-20% of present are late
        const absent = total - present

        return {
          department: dept,
          present: present - late,
          absent,
          late,
          total,
          attendanceRate: (present / total) * 100,
        }
      })

      // Generate late arrivals data by hour
      const lateData: LateArrivalData[] = []
      const hours = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00"]
      let totalLate = 0
      const hourCounts = hours.map(() => Math.floor(Math.random() * 15) + 1)
      totalLate = hourCounts.reduce((sum, count) => sum + count, 0)

      hours.forEach((hour, index) => {
        lateData.push({
          hour,
          count: hourCounts[index],
          percentage: (hourCounts[index] / totalLate) * 100,
        })
      })

      // Generate monthly overview data
      const monthlyOverview: MonthlyData[] = []
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const currentMonth = new Date().getMonth()

      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - 5 + i + 12) % 12
        monthlyOverview.push({
          month: months[monthIndex],
          avgAttendance: 75 + Math.random() * 20, // 75-95%
          avgLateArrivals: 5 + Math.random() * 10, // 5-15%
          avgWorkingHours: 7.5 + Math.random() * 1.5, // 7.5-9 hours
        })
      }

      setAttendanceTrendData(trendData)
      setDepartmentData(
        filters.department === "All Departments"
          ? deptData
          : deptData.filter((d) => d.department === filters.department),
      )
      setLateArrivalData(lateData)
      setMonthlyData(monthlyOverview)
    }

    generateMockData()
  }, [filters])

  const summaryStats = useMemo(() => {
    const totalRecords = attendanceTrendData.reduce((sum, day) => sum + day.total, 0)
    const totalPresent = attendanceTrendData.reduce((sum, day) => sum + day.present + day.late, 0)
    const totalLate = attendanceTrendData.reduce((sum, day) => sum + day.late, 0)
    const avgAttendanceRate =
      attendanceTrendData.reduce((sum, day) => sum + day.attendanceRate, 0) / attendanceTrendData.length || 0

    return {
      totalRecords,
      totalPresent,
      totalLate,
      avgAttendanceRate,
      lateRate: totalRecords > 0 ? (totalLate / totalPresent) * 100 : 0,
    }
  }, [attendanceTrendData])

  const handleExportReport = () => {
    // Generate comprehensive report data
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
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance-analytics-report-${filters.dateFrom}-to-${filters.dateTo}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive attendance insights and trends</p>
        </div>
        <Button onClick={handleExportReport} className="bg-secondary hover:bg-secondary/90">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize the date range and department for your analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, department: value }))}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{summaryStats.avgAttendanceRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Present</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{summaryStats.totalPresent.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{summaryStats.totalLate.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{summaryStats.lateRate.toFixed(1)}% of present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
            <BarChart3 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{summaryStats.totalRecords.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
          <TabsTrigger value="departments">Department Breakdown</TabsTrigger>
          <TabsTrigger value="late">Late Arrivals</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <AttendanceTrendChart data={attendanceTrendData} />
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <DepartmentBreakdownChart data={departmentData} />
        </TabsContent>

        <TabsContent value="late" className="space-y-4">
          <LateArrivalsChart data={lateArrivalData} />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <MonthlyOverviewChart data={monthlyData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
