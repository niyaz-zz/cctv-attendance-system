"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Wifi, WifiOff, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface CameraStatus {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "warning"
  lastSeen: string
  resolution: string
  fps: number
}

export function CameraStatusGrid() {
  const [cameras, setCameras] = useState<CameraStatus[]>([])

  useEffect(() => {
    // Mock data - replace with real API calls
    const mockCameras: CameraStatus[] = [
      {
        id: "CAM001",
        name: "Main Entrance",
        location: "Building A - Front Door",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
      },
      {
        id: "CAM002",
        name: "Side Exit",
        location: "Building A - Side Door",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
      },
      {
        id: "CAM003",
        name: "Parking Entrance",
        location: "Parking Lot - Gate",
        status: "warning",
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        resolution: "1920x1080",
        fps: 15,
      },
      {
        id: "CAM004",
        name: "Reception Area",
        location: "Building A - Lobby",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
      },
      {
        id: "CAM005",
        name: "Cafeteria",
        location: "Building B - Dining Area",
        status: "offline",
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolution: "1920x1080",
        fps: 0,
      },
      {
        id: "CAM006",
        name: "Conference Room A",
        location: "Building A - Floor 2",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
      },
    ]

    setCameras(mockCameras)

    // Simulate status updates
    const interval = setInterval(() => {
      setCameras((prev) =>
        prev.map((camera) => ({
          ...camera,
          lastSeen: camera.status === "online" ? new Date().toISOString() : camera.lastSeen,
        })),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-secondary" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Camera className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-secondary/10 text-secondary border-secondary/20" variant="outline">
            Online
          </Badge>
        )
      case "offline":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20" variant="outline">
            Offline
          </Badge>
        )
      case "warning":
        return (
          <Badge
            className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800"
            variant="outline"
          >
            Warning
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Camera Status ({cameras.filter((c) => c.status === "online").length}/{cameras.length} Online)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((camera) => (
            <Card key={camera.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(camera.status)}
                    <h3 className="font-medium text-sm">{camera.name}</h3>
                  </div>
                  {getStatusBadge(camera.status)}
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="truncate">{camera.location}</p>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span>{camera.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FPS:</span>
                    <span>{camera.fps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last seen:</span>
                    <span>{formatLastSeen(camera.lastSeen)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
