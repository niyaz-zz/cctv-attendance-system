"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthState, LoginCredentials } from "@/types/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  hasPermission: (requiredRole: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Mock authentication - replace with real API calls
  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data based on email
    const mockUser: User = {
      id: "1",
      email: credentials.email,
      name:
        credentials.email === "admin@company.com"
          ? "Admin User"
          : credentials.email === "hr@company.com"
            ? "HR Manager"
            : "Viewer User",
      role:
        credentials.email === "admin@company.com" ? "admin" : credentials.email === "hr@company.com" ? "hr" : "viewer",
      avatar: `/placeholder.svg?height=40&width=40&query=user+avatar`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    localStorage.setItem("auth-token", "mock-jwt-token")
    localStorage.setItem("user", JSON.stringify(mockUser))

    setAuthState({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  const hasPermission = (requiredRole: string): boolean => {
    if (!authState.user) return false

    const roleHierarchy = { admin: 3, hr: 2, viewer: 1 }
    const userLevel = roleHierarchy[authState.user.role as keyof typeof roleHierarchy]
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy]

    return userLevel >= requiredLevel
  }

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        })
      } catch {
        logout()
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
