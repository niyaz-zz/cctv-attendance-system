export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar?: string
  department: string
  date: string
  checkIn?: string
  checkOut?: string
  duration?: number // in minutes
  status: "present" | "absent" | "partial" | "late"
  checkInConfidence?: number
  checkOutConfidence?: number
  checkInLocation?: string
  checkOutLocation?: string
  notes?: string
}

export interface AttendanceFilters {
  dateFrom: string
  dateTo: string
  employee: string
  department: string
  status: string
}

export type AttendanceSortField = "employeeName" | "date" | "checkIn" | "checkOut" | "duration" | "status"
export type SortDirection = "asc" | "desc"
