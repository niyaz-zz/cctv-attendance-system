"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

type ColorScheme = "default" | "corporate-blue" | "security-green" | "tech-purple" | "executive-gray" | "alert-orange"

type ColorSchemeContextType = {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined)

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (!context) throw new Error("useColorScheme must be used within a ColorSchemeProvider")
  return context
}

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("default")

  const applyColorScheme = useCallback((scheme: ColorScheme) => {
    if (typeof document === "undefined") return

    document.body.classList.remove(
      "color-scheme-corporate-blue",
      "color-scheme-security-green",
      "color-scheme-tech-purple",
      "color-scheme-executive-gray",
      "color-scheme-alert-orange"
    )

    if (scheme !== "default") {
      document.body.classList.add(`color-scheme-${scheme}`)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const saved = localStorage.getItem("color-scheme") as ColorScheme | null
    if (saved) setColorSchemeState(saved)
  }, [])

  useEffect(() => {
    applyColorScheme(colorScheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("color-scheme", colorScheme)
    }
  }, [colorScheme, applyColorScheme])

  const setColorScheme = (scheme: ColorScheme) => setColorSchemeState(scheme)

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  )
}
