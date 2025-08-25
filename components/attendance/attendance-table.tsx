"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUpDown, ArrowUp, ArrowDown, MapPin } from "lucide-react"
import type { AttendanceRecord, AttendanceSortField, SortDirection } from "@/types/attendance"

interface AttendanceTableProps {
  records: AttendanceRecord[]
  sortField: AttendanceSortField
  sortDirection: SortDirection
  onSort: (field: AttendanceSortField, direction: SortDirection) => void
}

export function AttendanceTable({ records, sortField, sortDirection, onSort }: AttendanceTableProps) {
  const handleSort = (field: AttendanceSortField) => {
    if (sortField === field) {
      onSort(field, sortDirection === "asc" ? "desc" : "asc")
    } else {
      onSort(field, "asc")
    }
  }

  const getSortIcon = (field: AttendanceSortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-secondary/10 text-secondary">Present</Badge>
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Late</Badge>
      case "partial":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Partial</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("employeeName")} className="h-auto p-0 font-medium">
                Employee
                {getSortIcon("employeeName")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("date")} className="h-auto p-0 font-medium">
                Date
                {getSortIcon("date")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("checkIn")} className="h-auto p-0 font-medium">
                Check In
                {getSortIcon("checkIn")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("checkOut")} className="h-auto p-0 font-medium">
                Check Out
                {getSortIcon("checkOut")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("duration")} className="h-auto p-0 font-medium">
                Duration
                {getSortIcon("duration")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")} className="h-auto p-0 font-medium">
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead>Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={record.employeeAvatar || "/placeholder.svg"} alt={record.employeeName} />
                    <AvatarFallback>
                      {record.employeeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{record.employeeName}</div>
                    <div className="text-sm text-muted-foreground">{record.department}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(record.date)}</TableCell>
              <TableCell>
                {record.checkIn ? (
                  <div>
                    <div className="font-medium">{record.checkIn}</div>
                    {record.checkInLocation && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {record.checkInLocation}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {record.checkOut ? (
                  <div>
                    <div className="font-medium">{record.checkOut}</div>
                    {record.checkOutLocation && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {record.checkOutLocation}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <span className="font-medium">{formatDuration(record.duration)}</span>
              </TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {record.checkInConfidence && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">In: </span>
                      <span className="font-medium">{record.checkInConfidence.toFixed(1)}%</span>
                    </div>
                  )}
                  {record.checkOutConfidence && (
                    <div className="text-xs">
                      <span className="text-muted-foreground">Out: </span>
                      <span className="font-medium">{record.checkOutConfidence.toFixed(1)}%</span>
                    </div>
                  )}
                  {!record.checkInConfidence && !record.checkOutConfidence && (
                    <span className="text-muted-foreground text-xs">N/A</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
