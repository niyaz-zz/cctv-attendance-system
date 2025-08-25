"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeSettings } from "./theme-settings"
import { ColorSettings } from "./color-settings"
import { SystemSettings } from "./system-settings"

export function SettingsContent() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Customize your CCTV attendance system preferences and appearance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme & Appearance</CardTitle>
            <CardDescription>Customize the visual appearance of your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ThemeSettings />
            <ColorSettings />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure system-wide settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
