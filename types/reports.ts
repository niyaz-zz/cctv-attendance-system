export interface AttendanceTrendData {
  date: string
  present: number
  absent: number
  late: number
  total: number
  attendanceRate: number
}

export interface DepartmentData {
  department: string
  present: number
  absent: number
  late: number
  total: number
  attendanceRate: number
}

export interface LateArrivalData {
  hour: string
  count: number
  percentage: number
}

export interface MonthlyData {
  month: string
  avgAttendance: number
  avgLateArrivals: number
  avgWorkingHours: number
}

export interface ReportFilters {
  dateFrom: string
  dateTo: string
  department: string
}
