"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaceRegistration } from "./face-registration"
import type { Employee } from "@/types/employee"

const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  status: z.enum(["active", "inactive", "terminated"]),
  hireDate: z.string().min(1, "Hire date is required"),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onSave: (employee: Partial<Employee>) => void
}

export function EmployeeDialog({ open, onOpenChange, employee, onSave }: EmployeeDialogProps) {
  const [faceData, setFaceData] = useState<string | undefined>(employee?.faceData)
  const [avatar, setAvatar] = useState<string | undefined>(employee?.avatar)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  })

  const watchedStatus = watch("status")

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        phone: employee.phone,
        status: employee.status,
        hireDate: employee.hireDate,
      })
      setFaceData(employee.faceData)
      setAvatar(employee.avatar)
    } else {
      reset({
        name: "",
        email: "",
        department: "",
        position: "",
        phone: "",
        status: "active",
        hireDate: new Date().toISOString().split("T")[0],
      })
      setFaceData(undefined)
      setAvatar(undefined)
    }
  }, [employee, reset])

  const onSubmit = (data: EmployeeFormData) => {
    onSave({
      ...data,
      faceData,
      avatar,
    })
  }

  const handleFaceRegistered = (faceDataUrl: string, avatarUrl: string) => {
    setFaceData(faceDataUrl)
    setAvatar(avatarUrl)
    console.log("[v0] Face data registered successfully")
  }

  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {employee ? "Update employee information and face registration." : "Add a new employee to the system."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Employee Details</TabsTrigger>
            <TabsTrigger value="face">Face Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} placeholder="Enter full name" />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="Enter email address" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={watch("department")} onValueChange={(value) => setValue("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" {...register("position")} placeholder="Enter position" />
                  {errors.position && <p className="text-sm text-destructive">{errors.position.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date</Label>
                  <Input id="hireDate" type="date" {...register("hireDate")} />
                  {errors.hireDate && <p className="text-sm text-destructive">{errors.hireDate.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={watchedStatus} onValueChange={(value) => setValue("status", value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">{employee ? "Update Employee" : "Add Employee"}</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="face" className="space-y-4">
            <FaceRegistration
              existingFaceData={faceData}
              existingAvatar={avatar}
              onFaceRegistered={handleFaceRegistered}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
