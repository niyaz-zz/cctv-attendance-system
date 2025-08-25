"use client"
import { LiveAttendanceFeed } from "./live-attendance-feed"
import { WhosInList } from "./whos-in-list"
import { CameraStatusGrid } from "./camera-status-grid"
import { LiveStats } from "@/components/real-time/live-stats"

export function DashboardContent() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <LiveStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Attendance Feed - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <LiveAttendanceFeed />
        </div>

        {/* Who's In List - Takes 1 column */}
        <div className="lg:col-span-1">
          <WhosInList />
        </div>
      </div>

      {/* Camera Status Grid */}
      <CameraStatusGrid />
    </div>
  )
}
