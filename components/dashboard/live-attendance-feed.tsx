"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, MapPin, Wifi } from "lucide-react"
import { useEffect, useState } from "react"
import { useWebSocket } from "@/hooks/use-websocket"

interface AttendanceEvent {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar?: string
  type: "check-in" | "check-out"
  timestamp: string
  location: string
  confidence: number
}

export function LiveAttendanceFeed() {
  const [attendanceEvents, setAttendanceEvents] = useState<AttendanceEvent[]>([])
  const { subscribe, isConnected } = useWebSocket()

  useEffect(() => {
    const mockEvents: AttendanceEvent[] = [
      {
        id: "1",
        employeeId: "EMP001",
        employeeName: "Sarah Johnson",
        type: "check-in",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        location: "Main Entrance",
        confidence: 98.5,
      },
      {
        id: "2",
        employeeId: "EMP002",
        employeeName: "Michael Chen",
        type: "check-out",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        location: "Side Exit",
        confidence: 95.2,
      },
      {
        id: "3",
        employeeId: "EMP003",
        employeeName: "Emily Rodriguez",
        type: "check-in",
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        location: "Main Entrance",
        confidence: 97.8,
      },
      {
        id: "4",
        employeeId: "EMP004",
        employeeName: "David Kim",
        type: "check-in",
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        location: "Parking Entrance",
        confidence: 94.1,
      },
      {
        id: "5",
        employeeId: "EMP005",
        employeeName: "Lisa Thompson",
        type: "check-out",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        location: "Main Entrance",
        confidence: 96.7,
      },
    ]

    setAttendanceEvents(mockEvents)
  }, [])

  useEffect(() => {
    if (!isConnected) return

    const unsubscribe = subscribe("attendance:new", (newEvent: AttendanceEvent) => {
      setAttendanceEvents((prev) => [newEvent, ...prev.slice(0, 9)]) // Keep last 10 events
    })

    return unsubscribe
  }, [isConnected, subscribe])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Live Attendance Feed
          {isConnected && (
            <Badge variant="outline" className="ml-auto">
              <Wifi className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {attendanceEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-4 p-3 rounded-lg border bg-card/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={event.employeeAvatar || `/placeholder.svg?height=40&width=40&query=${event.employeeName}`}
                    alt={event.employeeName}
                  />
                  <AvatarFallback>
                    {event.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{event.employeeName}</p>
                    <Badge variant={event.type === "check-in" ? "default" : "secondary"} className="ml-2">
                      {event.type === "check-in" ? "IN" : "OUT"}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{event.location}</span>
                    <span className="mx-2">•</span>
                    <span>{formatTime(event.timestamp)}</span>
                    <span className="mx-2">•</span>
                    <span>{event.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
