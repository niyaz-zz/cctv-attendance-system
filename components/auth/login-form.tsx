"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Shield, Sun, Moon, Monitor } from "lucide-react"
import { useAuth } from "./auth-provider"
import type { LoginCredentials } from "@/types/auth"
import { useTheme } from "next-themes"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />
    if (theme === "dark") return <Moon className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError("")
      await login(data)
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 light:from-slate-50 light:via-slate-100 light:to-slate-200 p-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-10 h-9 w-9 p-0 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
        title={`Current theme: ${theme}. Click to cycle through light/dark/system`}
      >
        {getThemeIcon()}
      </Button>

      <Card className="w-full max-w-md shadow-2xl border-2 border-border/20 dark:border-slate-700/50 bg-background/95 dark:bg-slate-800/95 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg ring-2 ring-primary/20">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-heading bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            CCTV Attendance System
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Sign in to access the attendance management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`h-11 transition-all duration-200 ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive/20"
                    : "focus-visible:ring-primary/20"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`h-11 pr-11 transition-all duration-200 ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive/20"
                      : "focus-visible:ring-primary/20"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 w-11 hover:bg-muted/50 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 dark:bg-slate-700/50 border border-border/50 dark:border-slate-600/50">
            <p className="text-center text-sm font-medium text-foreground mb-3">Demo Accounts</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-primary">Admin:</span>
                <span className="text-muted-foreground">admin@company.com</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-primary">HR:</span>
                <span className="text-muted-foreground">hr@company.com</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium text-primary">Viewer:</span>
                <span className="text-muted-foreground">viewer@company.com</span>
              </div>
              <div className="text-center pt-2 border-t border-border/30 dark:border-slate-600/30">
                <span className="text-muted-foreground">Password: any 6+ characters</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
