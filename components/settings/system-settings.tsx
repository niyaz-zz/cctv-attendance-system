"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function SystemSettings() {
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState("30")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Real-time Notifications</Label>
            <p className="text-xs text-muted-foreground">Receive live updates for attendance events</p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Auto Refresh Dashboard</Label>
            <p className="text-xs text-muted-foreground">Automatically refresh dashboard data</p>
          </div>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Sound Alerts</Label>
            <p className="text-xs text-muted-foreground">Play sounds for important events</p>
          </div>
          <Switch checked={soundAlerts} onCheckedChange={setSoundAlerts} />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Refresh Interval</Label>
        <Select value={refreshInterval} onValueChange={setRefreshInterval}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 seconds</SelectItem>
            <SelectItem value="30">30 seconds</SelectItem>
            <SelectItem value="60">1 minute</SelectItem>
            <SelectItem value="300">5 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
