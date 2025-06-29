"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    console.log("Password reset:", formData)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-text">
          {isSubmitted ? "Password Reset Complete" : "Reset Password"}
        </CardTitle>
        <CardDescription className="text-text-muted">
          {isSubmitted ? "Your password has been successfully reset" : "Enter your new password below"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-text">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-text-muted hover:text-text transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="mt-5 flex-center">
              <Button
                className="w-full py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Reset Password
              </Button>                  
            </div>

          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-6 bg-success/10 border border-success/20 rounded-lg">
              <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
              <p className="text-success text-sm">Your password has been successfully reset!</p>
            </div>

            <Link href="/login">
              <Button className="w-full bg-gradient-to-br from-primary to-primary-dark hover:from-primary-light hover:to-primary text-bg font-semibold py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]">
                Continue to Login
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
