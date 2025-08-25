"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface EmployeePresence {
  id: string
  name: string
  avatar?: string
  department: string
  checkInTime: string
  status: "present" | "break" | "meeting"
}

export function WhosInList() {
  const [presentEmployees, setPresentEmployees] = useState<EmployeePresence[]>([])

  useEffect(() => {
    // Mock data - replace with real API calls
    const mockEmployees: EmployeePresence[] = [
      {
        id: "EMP001",
        name: "Sarah Johnson",
        department: "Engineering",
        checkInTime: "08:30 AM",
        status: "present",
      },
      {
        id: "EMP002",
        name: "Michael Chen",
        department: "Design",
        checkInTime: "09:15 AM",
        status: "meeting",
      },
      {
        id: "EMP003",
        name: "Emily Rodriguez",
        department: "Marketing",
        checkInTime: "08:45 AM",
        status: "present",
      },
      {
        id: "EMP004",
        name: "David Kim",
        department: "Engineering",
        checkInTime: "09:00 AM",
        status: "break",
      },
      {
        id: "EMP005",
        name: "Lisa Thompson",
        department: "HR",
        checkInTime: "08:30 AM",
        status: "present",
      },
      {
        id: "EMP006",
        name: "James Wilson",
        department: "Sales",
        checkInTime: "09:30 AM",
        status: "present",
      },
      {
        id: "EMP007",
        name: "Anna Martinez",
        department: "Finance",
        checkInTime: "08:15 AM",
        status: "meeting",
      },
      {
        id: "EMP008",
        name: "Robert Taylor",
        department: "Engineering",
        checkInTime: "09:45 AM",
        status: "present",
      },
    ]

    setPresentEmployees(mockEmployees)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-secondary text-secondary-foreground"
      case "break":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Who's In ({presentEmployees.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {presentEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={employee.avatar || `/placeholder.svg?height=32&width=32&query=${employee.name}`}
                    alt={employee.name}
                  />
                  <AvatarFallback className="text-xs">
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{employee.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="truncate">{employee.department}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{employee.checkInTime}</span>
                  </div>
                </div>

                <Badge className={`text-xs ${getStatusColor(employee.status)}`} variant="secondary">
                  {employee.status}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
