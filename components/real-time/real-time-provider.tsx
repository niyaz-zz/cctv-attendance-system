"use client"

import type React from "react"

import { useEffect } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { useAuth } from "@/components/auth/auth-provider"

interface RealTimeProviderProps {
  children: React.ReactNode
}

export function RealTimeProvider({ children }: RealTimeProviderProps) {
  const { isAuthenticated } = useAuth()
  const { isConnected, connectionStatus } = useWebSocket()

  useEffect(() => {
    if (isAuthenticated && connectionStatus === "connected") {
      console.log("[v0] Real-time features initialized")
    }
  }, [isAuthenticated, connectionStatus])

  return <>{children}</>
}
