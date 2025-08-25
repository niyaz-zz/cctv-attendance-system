import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeeManagement } from "@/components/employees/employee-management"

export default function EmployeesPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <DashboardLayout>
        <EmployeeManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
