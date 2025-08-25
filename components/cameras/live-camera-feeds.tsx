"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Maximize2, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import type { Camera as CameraType } from "@/types/camera"

interface LiveCameraFeedsProps {
  cameras: CameraType[]
}

export function LiveCameraFeeds({ cameras }: LiveCameraFeedsProps) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [mutedCameras, setMutedCameras] = useState<Set<string>>(new Set())

  const toggleMute = (cameraId: string) => {
    setMutedCameras((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(cameraId)) {
        newSet.delete(cameraId)
      } else {
        newSet.add(cameraId)
      }
      return newSet
    })
  }

  if (cameras.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Online Cameras</h3>
            <p className="text-muted-foreground">No cameras are currently online to display live feeds.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Featured Camera */}
      {selectedCamera && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Featured Feed: {cameras.find((c) => c.id === selectedCamera)?.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedCamera(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Live Feed Placeholder</p>
                <p className="text-sm opacity-75">{cameras.find((c) => c.id === selectedCamera)?.rtspUrl}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cameras.map((camera) => (
          <Card key={camera.id} className="relative group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm truncate">{camera.name}</CardTitle>
                <Badge className="bg-secondary/10 text-secondary text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Video Feed Placeholder */}
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-xs">Live Feed</p>
                  </div>
                </div>

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedCamera(camera.id)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleMute(camera.id)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      {mutedCameras.has(camera.id) ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="absolute top-2 left-2 flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {camera.recognitionEnabled && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
              </div>

              {/* Camera Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span>{camera.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span>FPS:</span>
                  <span>{camera.fps}</span>
                </div>
                <div className="truncate">
                  <span>Location: </span>
                  <span>{camera.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
