"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Edit, Trash2, Camera } from "lucide-react"
import type { Employee, EmployeeSortField, SortDirection } from "@/types/employee"

interface EmployeeTableProps {
  employees: Employee[]
  sortField: EmployeeSortField
  sortDirection: SortDirection
  onSort: (field: EmployeeSortField, direction: SortDirection) => void
  onEdit: (employee: Employee) => void
  onDelete: (employeeId: string) => void
}

export function EmployeeTable({ employees, sortField, sortDirection, onSort, onEdit, onDelete }: EmployeeTableProps) {
  const handleSort = (field: EmployeeSortField) => {
    if (sortField === field) {
      onSort(field, sortDirection === "asc" ? "desc" : "asc")
    } else {
      onSort(field, "asc")
    }
  }

  const getSortIcon = (field: EmployeeSortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary/10 text-secondary">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("department")} className="h-auto p-0 font-medium">
                Department
                {getSortIcon("department")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("position")} className="h-auto p-0 font-medium">
                Position
                {getSortIcon("position")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")} className="h-auto p-0 font-medium">
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("hireDate")} className="h-auto p-0 font-medium">
                Hire Date
                {getSortIcon("hireDate")}
              </Button>
            </TableHead>
            <TableHead>Face Data</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={employee.avatar || `/placeholder.svg?height=32&width=32&query=${employee.name}`}
                      alt={employee.name}
                    />
                    <AvatarFallback>
                      {employee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                    <div className="text-xs text-muted-foreground">{employee.employeeId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{getStatusBadge(employee.status)}</TableCell>
              <TableCell>{formatDate(employee.hireDate)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {employee.faceData ? (
                    <Badge variant="outline" className="text-secondary">
                      <Camera className="mr-1 h-3 w-3" />
                      Registered
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Not Registered
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(employee)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(employee.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
