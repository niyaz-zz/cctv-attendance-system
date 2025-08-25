import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AttendanceSystem } from "@/components/attendance/attendance-system"

export default function AttendancePage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AttendanceSystem />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
