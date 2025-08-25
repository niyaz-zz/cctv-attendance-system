"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type ColorSchemeContextType = {
  colorScheme: string
  setColorScheme: (scheme: string) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined)

export function useColorScheme() {
  const context = useContext(ColorSchemeContext)
  if (context === undefined) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider")
  }
  return context
}

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState("default")

  useEffect(() => {
    const saved = localStorage.getItem("color-scheme")
    if (saved) {
      setColorSchemeState(saved)
      applyColorScheme(saved)
    }
  }, [])

  const applyColorScheme = (scheme: string) => {
    document.body.classList.remove(
      "color-scheme-corporate-blue",
      "color-scheme-security-green",
      "color-scheme-tech-purple",
      "color-scheme-executive-gray",
      "color-scheme-alert-orange",
    )

    if (scheme !== "default") {
      document.body.classList.add(`color-scheme-${scheme}`)
    }
  }

  const setColorScheme = (scheme: string) => {
    setColorSchemeState(scheme)
    applyColorScheme(scheme)
    localStorage.setItem("color-scheme", scheme)
  }

  return <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>{children}</ColorSchemeContext.Provider>
}
