"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SplashCursor } from "@/components/ui/splash-cursor"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { IconBrandGoogle } from "@tabler/icons-react"
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register attempt:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-dark">
      <SplashCursor
        BACK_COLOR={{ r: 0.1, g: 0.015, b: 0.264 }}
        COLOR_UPDATE_SPEED={5}
        DENSITY_DISSIPATION={2.8}
        VELOCITY_DISSIPATION={1.8}
        SPLAT_FORCE={4000}
        SPLAT_RADIUS={0.15}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold font-logo text-text">
            <div className="flex-center">
              <TextHoverEffect text="Klypora" />
            </div>
            </CardTitle>
            <CardDescription style={{ fontFamily: 'var(--font-bacalar)' }} className="text-text-muted">Create your account to get started</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-text">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-text">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-text">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-text-muted hover:text-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                containerClassName="!w-full"
                className="h-10 flex-center w-full py-2.5 transition-all duration-300 hover:shadow-lg 
                  hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]]"
              >
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-muted/30" />
              </div>
              <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            </div>

            <div className="flex-center">
              <Button
                variant="outline"
                containerClassName="!w-full"
                className="h-10 flex-center w-full bg-bg-light/10 border-border-muted/30 text-text hover:bg-bg-light/20 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
              <IconBrandGoogle className="h-4 w-4 text-gray-50 " />
              <span className="text-sm font-medium ml-2">
                Log in with Google
              </span>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="/login" className="text-gray-500 hover:text-gray-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
