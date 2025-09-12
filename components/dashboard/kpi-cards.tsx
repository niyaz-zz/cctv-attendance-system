"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Camera, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface KPIData {
  totalEmployees: number
  presentToday: number
  camerasOnline: number
  attendanceRate: number
}

export function KPICards() {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalEmployees: 0,
    presentToday: 0,
    camerasOnline: 0,
    attendanceRate: 0,
  })

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchKPIData = () => {
      setKpiData({
        totalEmployees: 247,
        presentToday: 189,
        camerasOnline: 12,
        attendanceRate: 76.5,
      })
    }

    fetchKPIData()
    const interval = setInterval(fetchKPIData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const kpiCards = [
    {
      title: "Total Employees",
      value: kpiData.totalEmployees.toLocaleString(),
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Present Today",
      value: kpiData.presentToday.toLocaleString(),
      icon: UserCheck,
      iconColor: "text-blue-700",
      bgColor: "bg-blue-100",
      subtitle: `${((kpiData.presentToday / kpiData.totalEmployees) * 100).toFixed(1)}% attendance`,
    },
    {
      title: "Cameras Online",
      value: `${kpiData.camerasOnline}/15`,
      icon: Camera,
      iconColor: "text-sky-600",
      bgColor: "bg-sky-100",
      subtitle: `${((kpiData.camerasOnline / 15) * 100).toFixed(0)}% operational`,
    },
    {
      title: "Attendance Rate",
      value: `${kpiData.attendanceRate}%`,
      icon: TrendingUp,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      subtitle: "This month average",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            {/* Ensure icon is always visible with explicit color and background */}
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{card.value}</div>
            {card.subtitle && <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}