"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import type { CameraSettings } from "@/types/camera"

interface CameraSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: CameraSettings
  onSave: (settings: CameraSettings) => void
}

export function CameraSettingsDialog({ open, onOpenChange, settings, onSave }: CameraSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<CameraSettings>(settings)

  const handleSave = () => {
    onSave(localSettings)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Global Camera Settings</DialogTitle>
          <DialogDescription>Configure system-wide camera and recognition settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Global Recognition Threshold: {localSettings.globalRecognitionThreshold}%</Label>
            <p className="text-sm text-muted-foreground">Default threshold for new cameras</p>
            <Slider
              value={[localSettings.globalRecognitionThreshold]}
              onValueChange={(value) => setLocalSettings((prev) => ({ ...prev, globalRecognitionThreshold: value[0] }))}
              max={99}
              min={50}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Global Dedupe Window: {localSettings.globalDedupeWindow} seconds</Label>
            <p className="text-sm text-muted-foreground">Default dedupe window for new cameras</p>
            <Slider
              value={[localSettings.globalDedupeWindow]}
              onValueChange={(value) => setLocalSettings((prev) => ({ ...prev, globalDedupeWindow: value[0] }))}
              max={120}
              min={10}
              step={5}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Max Concurrent Streams: {localSettings.maxConcurrentStreams}</Label>
            <p className="text-sm text-muted-foreground">Maximum number of simultaneous camera streams</p>
            <Slider
              value={[localSettings.maxConcurrentStreams]}
              onValueChange={(value) => setLocalSettings((prev) => ({ ...prev, maxConcurrentStreams: value[0] }))}
              max={16}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recording Enabled</Label>
                <p className="text-sm text-muted-foreground">Enable automatic recording of camera feeds</p>
              </div>
              <Switch
                checked={localSettings.recordingEnabled}
                onCheckedChange={(checked) => setLocalSettings((prev) => ({ ...prev, recordingEnabled: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alerts Enabled</Label>
                <p className="text-sm text-muted-foreground">Enable system alerts for camera events</p>
              </div>
              <Switch
                checked={localSettings.alertsEnabled}
                onCheckedChange={(checked) => setLocalSettings((prev) => ({ ...prev, alertsEnabled: checked }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
