"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Filter } from "lucide-react"
import { AttendanceTable } from "./attendance-table"
import { AttendanceStats } from "./attendance-stats"
import type { AttendanceRecord, AttendanceFilters, AttendanceSortField, SortDirection } from "@/types/attendance"

export function AttendanceSystem() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [filters, setFilters] = useState<AttendanceFilters>({
    dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Last 7 days
    dateTo: new Date().toISOString().split("T")[0],
    employee: "All Employees",
    department: "All Departments",
    status: "All Status",
  })
  const [sortField, setSortField] = useState<AttendanceSortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Mock data - replace with real API calls
  useEffect(() => {
    const generateMockData = (): AttendanceRecord[] => {
      const employees = [
        { id: "EMP001", name: "Sarah Johnson", department: "Engineering" },
        { id: "EMP002", name: "Michael Chen", department: "Design" },
        { id: "EMP003", name: "Emily Rodriguez", department: "Marketing" },
        { id: "EMP004", name: "David Kim", department: "Engineering" },
        { id: "EMP005", name: "Lisa Thompson", department: "HR" },
        { id: "EMP006", name: "James Wilson", department: "Sales" },
        { id: "EMP007", name: "Anna Martinez", department: "Finance" },
        { id: "EMP008", name: "Robert Taylor", department: "Engineering" },
      ]

      const records: AttendanceRecord[] = []
      const today = new Date()

      // Generate records for the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split("T")[0]

        employees.forEach((employee) => {
          // 85% chance of attendance
          if (Math.random() > 0.15) {
            const checkInHour = 8 + Math.random() * 2 // 8-10 AM
            const checkInMinute = Math.floor(Math.random() * 60)
            const checkIn = `${Math.floor(checkInHour).toString().padStart(2, "0")}:${checkInMinute
              .toString()
              .padStart(2, "0")}`

            const workHours = 8 + Math.random() * 2 // 8-10 hours
            const checkOutTime = new Date(`${dateString}T${checkIn}:00`)
            checkOutTime.setHours(checkOutTime.getHours() + Math.floor(workHours))
            checkOutTime.setMinutes(checkOutTime.getMinutes() + Math.floor((workHours % 1) * 60))

            const checkOut = `${checkOutTime.getHours().toString().padStart(2, "0")}:${checkOutTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`

            const duration = Math.floor(workHours * 60)
            const isLate = checkInHour > 9
            const isPartial = duration < 480 // Less than 8 hours

            records.push({
              id: `${employee.id}-${dateString}`,
              employeeId: employee.id,
              employeeName: employee.name,
              employeeAvatar: `/placeholder.svg?height=32&width=32&query=${employee.name}`,
              department: employee.department,
              date: dateString,
              checkIn,
              checkOut,
              duration,
              status: isLate ? "late" : isPartial ? "partial" : "present",
              checkInConfidence: 90 + Math.random() * 10,
              checkOutConfidence: 90 + Math.random() * 10,
              checkInLocation: ["Main Entrance", "Side Exit", "Parking Entrance"][Math.floor(Math.random() * 3)],
              checkOutLocation: ["Main Entrance", "Side Exit", "Parking Entrance"][Math.floor(Math.random() * 3)],
            })
          } else {
            // Absent record
            records.push({
              id: `${employee.id}-${dateString}`,
              employeeId: employee.id,
              employeeName: employee.name,
              employeeAvatar: `/placeholder.svg?height=32&width=32&query=${employee.name}`,
              department: employee.department,
              date: dateString,
              status: "absent",
            })
          }
        })
      }

      return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    setAttendanceRecords(generateMockData())
  }, [])

  // Filter and sort records
  const { filteredAndSortedRecords, departments, employees } = useMemo(() => {
    // Get unique departments and employees for filter options
    const uniqueDepartments = Array.from(new Set(attendanceRecords.map((record) => record.department)))
    const uniqueEmployees = Array.from(
      new Set(attendanceRecords.map((record) => ({ id: record.employeeId, name: record.employeeName }))),
    )

    // Filter records
    const filtered = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date)
      const fromDate = new Date(filters.dateFrom)
      const toDate = new Date(filters.dateTo)

      const matchesDateRange = recordDate >= fromDate && recordDate <= toDate
      const matchesEmployee = filters.employee === "All Employees" || record.employeeId === filters.employee
      const matchesDepartment = filters.department === "All Departments" || record.department === filters.department
      const matchesStatus = filters.status === "All Status" || record.status === filters.status

      return matchesDateRange && matchesEmployee && matchesDepartment && matchesStatus
    })

    // Sort records
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (sortField) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "checkIn":
          aValue = a.checkIn || "99:99"
          bValue = b.checkIn || "99:99"
          break
        case "checkOut":
          aValue = a.checkOut || "99:99"
          bValue = b.checkOut || "99:99"
          break
        case "duration":
          aValue = a.duration || 0
          bValue = b.duration || 0
          break
        case "employeeName":
          aValue = a.employeeName.toLowerCase()
          bValue = b.employeeName.toLowerCase()
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          aValue = a.employeeName.toLowerCase()
          bValue = b.employeeName.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return {
      filteredAndSortedRecords: sorted,
      departments: uniqueDepartments,
      employees: uniqueEmployees,
    }
  }, [attendanceRecords, filters, sortField, sortDirection])

  useEffect(() => {
    setFilteredRecords(filteredAndSortedRecords)
  }, [filteredAndSortedRecords])

  const handleExportCSV = () => {
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Date",
      "Check In",
      "Check Out",
      "Duration (Hours)",
      "Status",
      "Check In Confidence",
      "Check Out Confidence",
      "Check In Location",
      "Check Out Location",
    ]

    const csvData = filteredRecords.map((record) => [
      record.employeeId,
      record.employeeName,
      record.department,
      record.date,
      record.checkIn || "N/A",
      record.checkOut || "N/A",
      record.duration ? (record.duration / 60).toFixed(2) : "N/A",
      record.status,
      record.checkInConfidence?.toFixed(1) || "N/A",
      record.checkOutConfidence?.toFixed(1) || "N/A",
      record.checkInLocation || "N/A",
      record.checkOutLocation || "N/A",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `attendance-report-${filters.dateFrom}-to-${filters.dateTo}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Attendance Logs</h1>
          <p className="text-muted-foreground">View and manage employee attendance records</p>
        </div>
        <Button onClick={handleExportCSV} className="bg-secondary hover:bg-secondary/90">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Attendance Stats */}
      <AttendanceStats records={filteredRecords} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter attendance records by date range, employee, department, and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <Label>Employee</Label>
              <Select
                value={filters.employee}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, employee: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employees">All Employees</SelectItem>
                  {employees
                    .filter(
                      (emp, index, self) =>
                        index === self.findIndex((e) => e.id === emp.id)
                    )
                    .map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <AttendanceTable
        records={filteredRecords}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={(field, direction) => {
          setSortField(field)
          setSortDirection(direction)
        }}
      />
    </div>
  )
}
