"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2, AlertTriangle } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export function ConnectionStatus() {
  const { isConnected, connectionStatus } = useWebSocket()

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          icon: Wifi,
          text: "Connected",
          variant: "default" as const,
          className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 dark:border-green-400/20",
        }
      case "connecting":
        return {
          icon: Loader2,
          text: "Connecting",
          variant: "outline" as const,
          className: "text-blue-600 dark:text-blue-400 border-blue-500/20",
        }
      case "error":
        return {
          icon: AlertTriangle,
          text: "Error",
          variant: "destructive" as const,
          className: "text-red-600 dark:text-red-400",
        }
      default:
        return {
          icon: WifiOff,
          text: "Disconnected",
          variant: "secondary" as const,
          className: "text-gray-600 dark:text-gray-400",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`${config.className} text-xs`}>
      <Icon className={`h-3 w-3 mr-1 ${connectionStatus === "connecting" ? "animate-spin" : ""}`} />
      {config.text}
    </Badge>
  )
}
