"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { Camera } from "@/types/camera"

const cameraSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(1, "Location is required"),
  rtspUrl: z.string().url("Please enter a valid RTSP URL").startsWith("rtsp://", "URL must start with rtsp://"),
  resolution: z.string().min(1, "Resolution is required"),
  fps: z.number().min(1).max(60),
  recognitionEnabled: z.boolean(),
  recognitionThreshold: z.number().min(50).max(99),
  dedupeWindow: z.number().min(10).max(120),
})

type CameraFormData = z.infer<typeof cameraSchema>

interface CameraDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  camera: Camera | null
  onSave: (camera: Partial<Camera>) => void
}

export function CameraDialog({ open, onOpenChange, camera, onSave }: CameraDialogProps) {
  const [recognitionEnabled, setRecognitionEnabled] = useState(camera?.recognitionEnabled ?? true)
  const [recognitionThreshold, setRecognitionThreshold] = useState([camera?.recognitionThreshold ?? 85])
  const [dedupeWindow, setDedupeWindow] = useState([camera?.dedupeWindow ?? 30])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CameraFormData>({
    resolver: zodResolver(cameraSchema),
  })

  useEffect(() => {
    if (camera) {
      reset({
        name: camera.name,
        location: camera.location,
        rtspUrl: camera.rtspUrl,
        resolution: camera.resolution,
        fps: camera.fps,
        recognitionEnabled: camera.recognitionEnabled,
        recognitionThreshold: camera.recognitionThreshold,
        dedupeWindow: camera.dedupeWindow,
      })
      setRecognitionEnabled(camera.recognitionEnabled)
      setRecognitionThreshold([camera.recognitionThreshold])
      setDedupeWindow([camera.dedupeWindow])
    } else {
      reset({
        name: "",
        location: "",
        rtspUrl: "rtsp://",
        resolution: "1920x1080",
        fps: 30,
        recognitionEnabled: true,
        recognitionThreshold: 85,
        dedupeWindow: 30,
      })
      setRecognitionEnabled(true)
      setRecognitionThreshold([85])
      setDedupeWindow([30])
    }
  }, [camera, reset])

  const onSubmit = (data: CameraFormData) => {
    onSave({
      ...data,
      recognitionEnabled,
      recognitionThreshold: recognitionThreshold[0],
      dedupeWindow: dedupeWindow[0],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{camera ? "Edit Camera" : "Add New Camera"}</DialogTitle>
          <DialogDescription>
            {camera ? "Update camera configuration and recognition settings." : "Add a new CCTV camera to the system."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Camera Name</Label>
                <Input id="name" {...register("name")} placeholder="e.g., Main Entrance" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} placeholder="e.g., Building A - Front Door" />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rtspUrl">RTSP URL</Label>
              <Input id="rtspUrl" {...register("rtspUrl")} placeholder="rtsp://192.168.1.100:554/stream1" />
              {errors.rtspUrl && <p className="text-sm text-destructive">{errors.rtspUrl.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Input id="resolution" {...register("resolution")} placeholder="1920x1080" />
                {errors.resolution && <p className="text-sm text-destructive">{errors.resolution.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fps">FPS</Label>
                <Input
                  id="fps"
                  type="number"
                  min="1"
                  max="60"
                  {...register("fps", { valueAsNumber: true })}
                  placeholder="30"
                />
                {errors.fps && <p className="text-sm text-destructive">{errors.fps.message}</p>}
              </div>
            </div>
          </div>

          {/* Recognition Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recognition Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Face Recognition</Label>
                <p className="text-sm text-muted-foreground">Process faces detected by this camera</p>
              </div>
              <Switch
                checked={recognitionEnabled}
                onCheckedChange={(checked) => {
                  setRecognitionEnabled(checked)
                  setValue("recognitionEnabled", checked)
                }}
              />
            </div>

            {recognitionEnabled && (
              <>
                <div className="space-y-3">
                  <Label>Recognition Threshold: {recognitionThreshold[0]}%</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimum confidence level required for face recognition
                  </p>
                  <Slider
                    value={recognitionThreshold}
                    onValueChange={(value) => {
                      setRecognitionThreshold(value)
                      setValue("recognitionThreshold", value[0])
                    }}
                    max={99}
                    min={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Dedupe Window: {dedupeWindow[0]} seconds</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimum time between consecutive detections of the same person
                  </p>
                  <Slider
                    value={dedupeWindow}
                    onValueChange={(value) => {
                      setDedupeWindow(value)
                      setValue("dedupeWindow", value[0])
                    }}
                    max={120}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{camera ? "Update Camera" : "Add Camera"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
