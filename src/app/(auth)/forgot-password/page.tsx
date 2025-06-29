"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, ForgotPasswordForm } from "@/types/auth/forgot-password"
import { zodResolver } from "@hookform/resolvers/zod"

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      console.log(data)
    } catch (error) {
      setError('email', { message: 'Failed to send reset link' })
    }
  }

  return (
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
                <Input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
                {errors.email && (
                  <div className="text-destructive text-caption mt-1" role="alert">
                    {errors.email.message}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-center">
              <Button
                aria-disabled={isSubmitting}
                className="py-2.5 transition-all 
                duration-300 hover:shadow-lg hover:shadow-primary/25 
                hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
  )
}
