"use client"

class WebSocketManager {
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map()
  private connected = false
  private userId?: string

  connect(userId?: string) {
    this.userId = userId

    // Simulate connection delay
    setTimeout(() => {
      this.connected = true
      console.log("[v0] WebSocket connected (simulated)")
      this.triggerEvent("connect", {})

      // Start simulating real-time events
      this.startSimulation()
    }, 1000)

    return this
  }

  private startSimulation() {
    // Simulate periodic events
    setInterval(
      () => {
        if (this.connected) {
          const events = [
            {
              type: "attendance_update",
              data: {
                employeeId: Math.floor(Math.random() * 100) + 1,
                employeeName: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"][Math.floor(Math.random() * 4)],
                action: Math.random() > 0.5 ? "in" : "out",
                timestamp: new Date().toISOString(),
                confidence: 0.85 + Math.random() * 0.15,
                camera: "Main Entrance",
              },
            },
            {
              type: "camera_update",
              data: {
                cameraId: Math.floor(Math.random() * 5) + 1,
                status: Math.random() > 0.1 ? "online" : "offline",
                timestamp: new Date().toISOString(),
              },
            },
          ]

          const randomEvent = events[Math.floor(Math.random() * events.length)]
          this.triggerEvent(randomEvent.type, randomEvent.data)
        }
      },
      3000 + Math.random() * 4000,
    ) // Random interval between 3-7 seconds
  }

  private triggerEvent(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach((callback) => callback(data))
  }

  disconnect() {
    this.connected = false
    console.log("[v0] WebSocket disconnected (simulated)")
    this.triggerEvent("disconnect", {})
  }

  emit(event: string, data: any) {
    console.log(`[v0] WebSocket emit (simulated): ${event}`, data)
  }

  on(event: string, callback: (data: any) => void) {
    const existing = this.eventListeners.get(event) || []
    this.eventListeners.set(event, [...existing, callback])
  }

  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      const existing = this.eventListeners.get(event) || []
      const filtered = existing.filter((cb) => cb !== callback)
      if (filtered.length === 0) {
        this.eventListeners.delete(event)
      } else {
        this.eventListeners.set(event, filtered)
      }
    } else {
      this.eventListeners.delete(event)
    }
  }

  getSocket() {
    return this
  }

  isConnected() {
    return this.connected
  }
}

export const websocketManager = new WebSocketManager()
