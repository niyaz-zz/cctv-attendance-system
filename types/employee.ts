export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  department: string
  position: string
  phone: string
  avatar?: string
  faceData?: string // Base64 encoded face data
  status: "active" | "inactive" | "terminated"
  hireDate: string
  createdAt: string
  updatedAt: string
}

export interface EmployeeFilters {
  search: string
  department: string
  status: string
}

export type EmployeeSortField = "name" | "department" | "position" | "hireDate" | "status"
export type SortDirection = "asc" | "desc"
