"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"

export function useWebSocket() {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected" | "error">(
    "disconnected",
  )
  const eventListenersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map())

  useEffect(() => {
    if (user) {
      setConnectionStatus("connecting")

      // Simulate connection delay
      const connectTimer = setTimeout(() => {
        setIsConnected(true)
        setConnectionStatus("connected")
      }, 1000)

      return () => {
        clearTimeout(connectTimer)
        setIsConnected(false)
        setConnectionStatus("disconnected")
      }
    } else {
      setIsConnected(false)
      setConnectionStatus("disconnected")
    }
  }, [user])

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        // Simulate attendance events
        const attendanceEvents = [
          { type: "attendance_in", employee: "John Doe", time: new Date().toISOString(), confidence: 0.95 },
          { type: "attendance_out", employee: "Jane Smith", time: new Date().toISOString(), confidence: 0.92 },
          { type: "camera_status", camera: "Main Entrance", status: "online" },
        ]

        const randomEvent = attendanceEvents[Math.floor(Math.random() * attendanceEvents.length)]

        eventListenersRef.current.forEach((listeners, event) => {
          if (event === "attendance_update" || event === "camera_update") {
            listeners.forEach((callback) => callback(randomEvent))
          }
        })
      }, 5000) // Emit events every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isConnected]) // Only depend on isConnected

  const emit = (event: string, data: any) => {
    // Simulate emit functionality
    console.log(`[v0] Simulated emit: ${event}`, data)
  }

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    const currentListeners = eventListenersRef.current
    const existing = currentListeners.get(event) || []
    currentListeners.set(event, [...existing, callback])

    return () => {
      const currentListeners = eventListenersRef.current
      const existing = currentListeners.get(event) || []
      const filtered = existing.filter((cb) => cb !== callback)
      if (filtered.length === 0) {
        currentListeners.delete(event)
      } else {
        currentListeners.set(event, filtered)
      }
    }
  }, [])

  return {
    isConnected,
    connectionStatus,
    emit,
    subscribe,
  }
}
