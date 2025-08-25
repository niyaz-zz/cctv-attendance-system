import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ReportsAnalytics } from "@/components/reports/reports-analytics"

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredRole="hr">
      <DashboardLayout>
        <ReportsAnalytics />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
