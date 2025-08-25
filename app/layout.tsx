import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { RealTimeProvider } from "@/components/real-time/real-time-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { ColorSchemeProvider } from "@/components/settings/color-scheme-provider"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "CCTV Attendance System",
  description: "Professional CCTV Camera Based Attendance Management System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="cctv-attendance-theme">
          <ColorSchemeProvider>
            <AuthProvider>
              <RealTimeProvider>
                {children}
                <Toaster />
              </RealTimeProvider>
            </AuthProvider>
          </ColorSchemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
