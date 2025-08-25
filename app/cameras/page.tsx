import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { CameraManagement } from "@/components/cameras/camera-management"

export default function CamerasPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <CameraManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
