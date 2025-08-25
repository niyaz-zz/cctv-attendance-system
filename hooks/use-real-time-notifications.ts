"use client"

import { useState, useEffect } from "react"
import { useWebSocket } from "./use-websocket"
import { useToast } from "./use-toast"

export interface RealTimeNotification {
  id: string
  type: "attendance" | "camera" | "system" | "alert"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  data?: any
}

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { subscribe, isConnected } = useWebSocket()
  const { toast } = useToast()

  useEffect(() => {
    if (!isConnected) return

    const unsubscribeAttendance = subscribe("attendance:new", (data) => {
      const notification: RealTimeNotification = {
        id: Date.now().toString(),
        type: "attendance",
        title: "New Attendance Record",
        message: `${data.employeeName} ${data.type === "check-in" ? "checked in" : "checked out"} at ${data.location}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: "medium",
        data,
      }
      addNotification(notification)
    })

    const unsubscribeCameraStatus = subscribe("camera:status", (data) => {
      const notification: RealTimeNotification = {
        id: Date.now().toString(),
        type: "camera",
        title: "Camera Status Change",
        message: `Camera ${data.name} is now ${data.status}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: data.status === "offline" ? "high" : "low",
        data,
      }
      addNotification(notification)

      if (data.status === "offline") {
        toast({
          title: "Camera Offline",
          description: `${data.name} has gone offline`,
          variant: "destructive",
        })
      }
    })

    const unsubscribeSystemAlert = subscribe("system:alert", (data) => {
      const notification: RealTimeNotification = {
        id: Date.now().toString(),
        type: "alert",
        title: data.title,
        message: data.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: data.priority || "medium",
        data,
      }
      addNotification(notification)

      toast({
        title: data.title,
        description: data.message,
        variant: data.priority === "high" ? "destructive" : "default",
      })
    })

    return () => {
      unsubscribeAttendance()
      unsubscribeCameraStatus()
      unsubscribeSystemAlert()
    }
  }, [isConnected, subscribe, toast])

  const addNotification = (notification: RealTimeNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 49)]) // Keep last 50 notifications
    setUnreadCount((prev) => prev + 1)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }
}
