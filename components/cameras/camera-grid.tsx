"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Camera, Wifi, WifiOff, AlertTriangle, MoreHorizontal, Edit, Trash2, Settings, Play } from "lucide-react"
import type { Camera as CameraType } from "@/types/camera"

interface CameraGridProps {
  cameras: CameraType[]
  onEdit: (camera: CameraType) => void
  onDelete: (cameraId: string) => void
}

export function CameraGrid({ cameras, onEdit, onDelete }: CameraGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-secondary" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-destructive" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "connecting":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Camera className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Online</Badge>
      case "offline":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Offline</Badge>
      case "error":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Error</Badge>
      case "connecting":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">
            Connecting
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cameras.map((camera) => (
        <Card key={camera.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(camera.status)}
                <CardTitle className="text-base">{camera.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(camera.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {camera.status === "online" && (
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        View Live Feed
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(camera)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(camera.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Camera Preview */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {camera.status === "online" ? (
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Live Feed</p>
                </div>
              ) : (
                <div className="text-center">
                  <WifiOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No Signal</p>
                </div>
              )}
            </div>

            {/* Camera Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="truncate ml-2">{camera.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolution:</span>
                <span>{camera.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">FPS:</span>
                <span>{camera.fps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recognition:</span>
                <Badge variant={camera.recognitionEnabled ? "default" : "secondary"} className="text-xs">
                  {camera.recognitionEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              {camera.recognitionEnabled && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Threshold:</span>
                  <span>{camera.recognitionThreshold}%</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last seen:</span>
                <span>{formatLastSeen(camera.lastSeen)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
