export interface Camera {
  id: string
  name: string
  location: string
  rtspUrl: string
  status: "online" | "offline" | "error" | "connecting"
  lastSeen: string
  resolution: string
  fps: number
  recognitionEnabled: boolean
  recognitionThreshold: number
  dedupeWindow: number // in seconds
  createdAt: string
  updatedAt: string
}

export interface CameraSettings {
  globalRecognitionThreshold: number
  globalDedupeWindow: number
  maxConcurrentStreams: number
  recordingEnabled: boolean
  alertsEnabled: boolean
}

export interface CameraFilters {
  status: string
  location: string
}
