"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useForm, SubmitHandler } from "react-hook-form"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { resetPasswordSchema, ResetPasswordForm } from "@/types/auth/reset-password"
import { zodResolver } from "@hookform/resolvers/zod"

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      console.log(data)
    } catch (error) {
      setError('password', { message: 'Failed to reset password' })
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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
                {errors.password && (
                  <div className="text-destructive text-caption mt-1" role="alert">
                    {errors.password.message}
                  </div>
                )}
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
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
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
                {errors.confirmPassword && (
                  <div className="text-destructive text-caption mt-1" role="alert">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex-center">
              <Button
                aria-disabled={isSubmitting}
                className="w-full py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
