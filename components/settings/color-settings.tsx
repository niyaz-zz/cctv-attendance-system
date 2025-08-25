"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useColorScheme } from "./color-scheme-provider"

const colorSchemes = [
  {
    name: "Corporate Blue",
    value: "corporate-blue",
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#0ea5e9",
    description: "Professional and trustworthy",
  },
  {
    name: "Security Green",
    value: "security-green",
    primary: "#059669",
    secondary: "#6b7280",
    accent: "#10b981",
    description: "Secure and reliable",
  },
  {
    name: "Tech Purple",
    value: "tech-purple",
    primary: "#7c3aed",
    secondary: "#64748b",
    accent: "#a855f7",
    description: "Modern and innovative",
  },
  {
    name: "Executive Gray",
    value: "executive-gray",
    primary: "#374151",
    secondary: "#6b7280",
    accent: "#4f46e5",
    description: "Sophisticated and minimal",
  },
  {
    name: "Alert Orange",
    value: "alert-orange",
    primary: "#ea580c",
    secondary: "#64748b",
    accent: "#f97316",
    description: "Energetic and attention-grabbing",
  },
  {
    name: "Default",
    value: "default",
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#2563eb",
    description: "Classic system colors",
  },
]

export function ColorSettings() {
  const { colorScheme: selectedScheme, setColorScheme } = useColorScheme()

  const applyColorScheme = (scheme: string) => {
    setColorScheme(scheme)
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Color Scheme</Label>
      <div className="grid gap-3">
        {colorSchemes.map((scheme) => (
          <Button
            key={scheme.value}
            variant={selectedScheme === scheme.value ? "default" : "outline"}
            onClick={() => applyColorScheme(scheme.value)}
            className="flex items-center justify-between h-auto p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: scheme.primary }} />
                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: scheme.secondary }} />
                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: scheme.accent }} />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{scheme.name}</div>
                <div className="text-xs text-muted-foreground">{scheme.description}</div>
              </div>
            </div>
            {selectedScheme === scheme.value && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
