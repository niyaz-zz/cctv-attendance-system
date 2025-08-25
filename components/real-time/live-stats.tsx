"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Camera, Activity } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

interface LiveStats {
  totalEmployees: number
  presentToday: number
  camerasOnline: number
  recentActivity: number
  lastUpdated: string
}

export function LiveStats() {
  const [stats, setStats] = useState<LiveStats>({
    totalEmployees: 247,
    presentToday: 189,
    camerasOnline: 12,
    recentActivity: 5,
    lastUpdated: new Date().toISOString(),
  })
  const { subscribe, isConnected } = useWebSocket()

  useEffect(() => {
    if (!isConnected) return

    const unsubscribeStats = subscribe("stats:update", (newStats: Partial<LiveStats>) => {
      setStats((prev) => ({
        ...prev,
        ...newStats,
        lastUpdated: new Date().toISOString(),
      }))
    })

    const unsubscribeAttendance = subscribe("attendance:new", () => {
      setStats((prev) => ({
        ...prev,
        presentToday: prev.presentToday + 1,
        recentActivity: prev.recentActivity + 1,
        lastUpdated: new Date().toISOString(),
      }))
    })

    const unsubscribeCameraStatus = subscribe("camera:status", (data: { status: string }) => {
      setStats((prev) => ({
        ...prev,
        camerasOnline: data.status === "online" ? prev.camerasOnline + 1 : Math.max(0, prev.camerasOnline - 1),
        lastUpdated: new Date().toISOString(),
      }))
    })

    return () => {
      unsubscribeStats()
      unsubscribeAttendance()
      unsubscribeCameraStatus()
    }
  }, [isConnected, subscribe])

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const kpiCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Present Today",
      value: stats.presentToday.toLocaleString(),
      icon: UserCheck,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      subtitle: `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% attendance`,
    },
    {
      title: "Cameras Online",
      value: `${stats.camerasOnline}/15`,
      icon: Camera,
      color: "text-accent",
      bgColor: "bg-accent/10",
      subtitle: `${((stats.camerasOnline / 15) * 100).toFixed(0)}% operational`,
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity.toLocaleString(),
      icon: Activity,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      subtitle: "Last 5 minutes",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading">Live Statistics</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <span className="text-xs text-muted-foreground">Updated: {formatLastUpdated(stats.lastUpdated)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{card.value}</div>
              {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
