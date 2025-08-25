"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { EmployeeTable } from "./employee-table"
import { EmployeeDialog } from "./employee-dialog"
import type { Employee, EmployeeFilters, EmployeeSortField, SortDirection } from "@/types/employee"

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    department: "All Departments",
    status: "All Status",
  })
  const [sortField, setSortField] = useState<EmployeeSortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: "1",
        employeeId: "EMP001",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        department: "Engineering",
        position: "Senior Developer",
        phone: "+1 (555) 123-4567",
        status: "active",
        hireDate: "2022-03-15",
        createdAt: "2022-03-15T09:00:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        employeeId: "EMP002",
        name: "Michael Chen",
        email: "michael.chen@company.com",
        department: "Design",
        position: "UI/UX Designer",
        phone: "+1 (555) 234-5678",
        status: "active",
        hireDate: "2021-11-20",
        createdAt: "2021-11-20T09:00:00Z",
        updatedAt: "2024-01-10T14:20:00Z",
      },
      {
        id: "3",
        employeeId: "EMP003",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@company.com",
        department: "Marketing",
        position: "Marketing Manager",
        phone: "+1 (555) 345-6789",
        status: "active",
        hireDate: "2023-01-10",
        createdAt: "2023-01-10T09:00:00Z",
        updatedAt: "2024-01-05T16:45:00Z",
      },
      {
        id: "4",
        employeeId: "EMP004",
        name: "David Kim",
        email: "david.kim@company.com",
        department: "Engineering",
        position: "DevOps Engineer",
        phone: "+1 (555) 456-7890",
        status: "inactive",
        hireDate: "2022-08-05",
        createdAt: "2022-08-05T09:00:00Z",
        updatedAt: "2024-01-12T11:15:00Z",
      },
      {
        id: "5",
        employeeId: "EMP005",
        name: "Lisa Thompson",
        email: "lisa.thompson@company.com",
        department: "HR",
        position: "HR Specialist",
        phone: "+1 (555) 567-8901",
        status: "active",
        hireDate: "2021-06-12",
        createdAt: "2021-06-12T09:00:00Z",
        updatedAt: "2024-01-08T13:30:00Z",
      },
    ]

    setEmployees(mockEmployees)
  }, [])

  // Filter and sort employees
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        filters.search === "" ||
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(filters.search.toLowerCase())

      const matchesDepartment = filters.department === "All Departments" || employee.department === filters.department

      const matchesStatus = filters.status === "All Status" || employee.status === filters.status

      return matchesSearch && matchesDepartment && matchesStatus
    })

    // Sort employees
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortField) {
        case "hireDate":
          aValue = new Date(a.hireDate)
          bValue = new Date(b.hireDate)
          break
        default:
          aValue = a[sortField].toLowerCase()
          bValue = b[sortField].toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredEmployees(filtered)
  }, [employees, filters, sortField, sortDirection])

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
  }

  const handleSaveEmployee = (employeeData: Partial<Employee>) => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...employeeData, updatedAt: new Date().toISOString() } : emp,
        ),
      )
    } else {
      // Add new employee
      const newEmployee: Employee = {
        id: Date.now().toString(),
        employeeId: `EMP${(employees.length + 1).toString().padStart(3, "0")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...employeeData,
      } as Employee

      setEmployees((prev) => [...prev, newEmployee])
    }
    setIsDialogOpen(false)
  }

  const departments = Array.from(new Set(employees.map((emp) => emp.department)))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Employee Management</h1>
          <p className="text-muted-foreground">Manage employee records and face registration</p>
        </div>
        <Button onClick={handleAddEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.department}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, department: value }))}
        >
          <SelectTrigger className="w-full sm:w-48">
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
        <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employee Table */}
      <EmployeeTable
        employees={filteredEmployees}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={(field, direction) => {
          setSortField(field)
          setSortDirection(direction)
        }}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />

      {/* Employee Dialog */}
      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  )
}
