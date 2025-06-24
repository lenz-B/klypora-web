"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SplashCursor } from "@/components/ui/splash-cursor"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset request for:", email)
    setIsSubmitted(true)
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
            <CardTitle className="text-2xl font-bold text-text">
              {isSubmitted ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-text-muted">
              {isSubmitted
                ? "We've sent a password reset link to your email address"
                : "Enter your email address & we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex-center">
                  <Button
                    type="submit"
                    className="py-2.5 transition-all 
                    duration-300 hover:shadow-lg hover:shadow-primary/25 
                    hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Send Reset Link
                  </Button>
                </div>

              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-success text-sm">Password reset link sent successfully!</p>
                </div>

                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className=" w-full bg-bg-light/10 border-border-muted/30 
                  text-text hover:bg-bg-light/20 hover:border-primary/50 
                  transition-all duration-300"
                >
                  Send Another Link
                </Button>
              </div>
            )}

            <div className="flex items-center justify-center">
              <Link
                href="/login"
                className="flex items-center text-sm text-text-muted hover:text-text transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
