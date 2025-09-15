"use client"

import { useEffect, useMemo, useState } from "react"
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

  // Load employees from Flask backend
  useEffect(() => {
const fetchEmployees = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/employees")
    const data = await res.json()
    setEmployees(data)
  } catch (err) {
    console.error("Failed to fetch employees:", err)
  }
}
    fetchEmployees()
  }, [])

  // Departments list
  const departments = useMemo(
    () => Array.from(new Set(employees.map((emp) => emp.department))).filter(Boolean),
    [employees],
  )

  // Filtering + sorting
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        filters.search === "" ||
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.employee_id.toLowerCase().includes(filters.search.toLowerCase())

      const matchesDepartment = filters.department === "All Departments" || employee.department === filters.department
      const matchesStatus = filters.status === "All Status" || employee.status === filters.status
      return matchesSearch && matchesDepartment && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date
      switch (sortField) {
        case "hire_date":
          aValue = new Date(a.hire_date)
          bValue = new Date(b.hire_date)
          break
        default:
          aValue = (a[sortField] as string).toLowerCase()
          bValue = (b[sortField] as string).toLowerCase()
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

const handleDeleteEmployee = async (employeeId: string) => {
  try {
    await fetch(`http://localhost:5000/api/employees/${employeeId}`, { method: "DELETE" })
    await fetchEmployees() // <-- Fetch fresh data after delete
  } catch (err) {
    console.error("Failed to delete employee:", err)
  }
}

const handleSaveEmployee = (saved: Employee) => {
  if (selectedEmployee) {
    setEmployees((prev) => prev.map((emp) => (emp.id === saved.id ? saved : emp)))
  } else {
    setEmployees((prev) => [...prev, saved])
  }
  setIsDialogOpen(false) // <-- This will close the dialog after save
}

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

<EmployeeTable
  employees={filteredEmployees}
  sortField={sortField}
  sortDirection={sortDirection}
  onSort={(field, direction) => {
    setSortField(field)
    setSortDirection(direction)
  }}
  onEdit={handleEditEmployee}
  onDelete={(id) => handleDeleteEmployee(id)} // Make sure id is correct
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
