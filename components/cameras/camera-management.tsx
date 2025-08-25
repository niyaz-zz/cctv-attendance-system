"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings } from "lucide-react"
import { CameraGrid } from "./camera-grid"
import { CameraDialog } from "./camera-dialog"
import { CameraSettingsDialog } from "./camera-settings-dialog"
import { LiveCameraFeeds } from "./live-camera-feeds"
import type { Camera, CameraSettings, CameraFilters } from "@/types/camera"

export function CameraManagement() {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [filteredCameras, setFilteredCameras] = useState<Camera[]>([])
  const [filters, setFilters] = useState<CameraFilters>({
    status: "All Status",
    location: "All Locations",
  })
  const [settings, setSettings] = useState<CameraSettings>({
    globalRecognitionThreshold: 85,
    globalDedupeWindow: 30,
    maxConcurrentStreams: 8,
    recordingEnabled: true,
    alertsEnabled: true,
  })
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockCameras: Camera[] = [
      {
        id: "CAM001",
        name: "Main Entrance",
        location: "Building A - Front Door",
        rtspUrl: "rtsp://192.168.1.100:554/stream1",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
        recognitionEnabled: true,
        recognitionThreshold: 90,
        dedupeWindow: 30,
        createdAt: "2024-01-01T09:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CAM002",
        name: "Side Exit",
        location: "Building A - Side Door",
        rtspUrl: "rtsp://192.168.1.101:554/stream1",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
        recognitionEnabled: true,
        recognitionThreshold: 85,
        dedupeWindow: 25,
        createdAt: "2024-01-01T09:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CAM003",
        name: "Parking Entrance",
        location: "Parking Lot - Gate",
        rtspUrl: "rtsp://192.168.1.102:554/stream1",
        status: "error",
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        resolution: "1920x1080",
        fps: 0,
        recognitionEnabled: false,
        recognitionThreshold: 80,
        dedupeWindow: 35,
        createdAt: "2024-01-01T09:00:00Z",
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: "CAM004",
        name: "Reception Area",
        location: "Building A - Lobby",
        rtspUrl: "rtsp://192.168.1.103:554/stream1",
        status: "online",
        lastSeen: new Date().toISOString(),
        resolution: "1920x1080",
        fps: 30,
        recognitionEnabled: true,
        recognitionThreshold: 88,
        dedupeWindow: 30,
        createdAt: "2024-01-01T09:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "CAM005",
        name: "Cafeteria",
        location: "Building B - Dining Area",
        rtspUrl: "rtsp://192.168.1.104:554/stream1",
        status: "offline",
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolution: "1920x1080",
        fps: 0,
        recognitionEnabled: false,
        recognitionThreshold: 85,
        dedupeWindow: 30,
        createdAt: "2024-01-01T09:00:00Z",
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "CAM006",
        name: "Conference Room A",
        location: "Building A - Floor 2",
        rtspUrl: "rtsp://192.168.1.105:554/stream1",
        status: "connecting",
        lastSeen: new Date(Date.now() - 30 * 1000).toISOString(),
        resolution: "1920x1080",
        fps: 15,
        recognitionEnabled: true,
        recognitionThreshold: 85,
        dedupeWindow: 30,
        createdAt: "2024-01-01T09:00:00Z",
        updatedAt: new Date().toISOString(),
      },
    ]

    setCameras(mockCameras)
  }, [])

  // Filter cameras
  useEffect(() => {
    const filtered = cameras.filter((camera) => {
      const matchesStatus = filters.status === "All Status" || camera.status === filters.status
      const matchesLocation = filters.location === "All Locations" || camera.location.includes(filters.location)
      return matchesStatus && matchesLocation
    })

    setFilteredCameras(filtered)
  }, [cameras, filters])

  const handleAddCamera = () => {
    setSelectedCamera(null)
    setIsCameraDialogOpen(true)
  }

  const handleEditCamera = (camera: Camera) => {
    setSelectedCamera(camera)
    setIsCameraDialogOpen(true)
  }

  const handleDeleteCamera = (cameraId: string) => {
    setCameras((prev) => prev.filter((cam) => cam.id !== cameraId))
  }

  const handleSaveCamera = (cameraData: Partial<Camera>) => {
    if (selectedCamera) {
      // Update existing camera
      setCameras((prev) =>
        prev.map((cam) =>
          cam.id === selectedCamera.id ? { ...cam, ...cameraData, updatedAt: new Date().toISOString() } : cam,
        ),
      )
    } else {
      // Add new camera
      const newCamera: Camera = {
        id: `CAM${(cameras.length + 1).toString().padStart(3, "0")}`,
        status: "connecting",
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...cameraData,
      } as Camera

      setCameras((prev) => [...prev, newCamera])
    }
    setIsCameraDialogOpen(false)
  }

  const handleSaveSettings = (newSettings: CameraSettings) => {
    setSettings(newSettings)
    setIsSettingsDialogOpen(false)
  }

  const locations = Array.from(new Set(cameras.map((cam) => cam.location.split(" - ")[0])))
  const onlineCameras = cameras.filter((cam) => cam.status === "online")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Camera Management</h1>
          <p className="text-muted-foreground">
            Manage CCTV cameras, configure recognition settings, and monitor live feeds
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsSettingsDialogOpen(true)} variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={handleAddCamera}>
            <Plus className="mr-2 h-4 w-4" />
            Add Camera
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Camera Overview</TabsTrigger>
          <TabsTrigger value="live">Live Feeds</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="connecting">Connecting</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.location}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Locations">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CameraGrid cameras={filteredCameras} onEdit={handleEditCamera} onDelete={handleDeleteCamera} />
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <LiveCameraFeeds cameras={onlineCameras} />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Global Settings Card */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading">Global Settings</h3>
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <label className="text-sm font-medium">
                    Recognition Threshold: {settings.globalRecognitionThreshold}%
                  </label>
                  <Input
                    type="range"
                    min="50"
                    max="99"
                    value={settings.globalRecognitionThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, globalRecognitionThreshold: Number.parseInt(e.target.value) }))
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Dedupe Window: {settings.globalDedupeWindow}s</label>
                  <Input
                    type="range"
                    min="10"
                    max="120"
                    value={settings.globalDedupeWindow}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, globalDedupeWindow: Number.parseInt(e.target.value) }))
                    }
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Concurrent Streams: {settings.maxConcurrentStreams}</label>
                  <Input
                    type="range"
                    min="1"
                    max="16"
                    value={settings.maxConcurrentStreams}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, maxConcurrentStreams: Number.parseInt(e.target.value) }))
                    }
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading">System Status</h3>
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between">
                  <span>Total Cameras:</span>
                  <span className="font-medium">{cameras.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Online:</span>
                  <span className="font-medium text-secondary">
                    {cameras.filter((c) => c.status === "online").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Offline:</span>
                  <span className="font-medium text-destructive">
                    {cameras.filter((c) => c.status === "offline").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Recognition Enabled:</span>
                  <span className="font-medium">{cameras.filter((c) => c.recognitionEnabled).length}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CameraDialog
        open={isCameraDialogOpen}
        onOpenChange={setIsCameraDialogOpen}
        camera={selectedCamera}
        onSave={handleSaveCamera}
      />

      <CameraSettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
