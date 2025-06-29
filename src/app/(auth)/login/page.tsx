"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { IconBrandGoogle } from "@tabler/icons-react"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import { loginSchema, LoginForm } from "@/types/auth/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      // send to backend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(data)
    } catch (error) {
      setError('identifier', { message: 'Login failed' })
    }
  }

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-text">
        <div className="flex-center">
          <TextHoverEffect text="Klypora"/>  
        </div>
        </CardTitle>
        <CardDescription className="text-text-muted">Sign in to your account to continue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-text">
              Username or Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <Input
                id="identifier"
                {...register('identifier')}
                type="text"
                placeholder="Enter your username or email"
                className="pl-10"
                required
              />
              {errors.identifier && (
                <div className="text-destructive text-caption mt-1" role="alert">
                  {errors.identifier.message}
                </div>
              )}
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
                {...register('password')}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <div className="flex-center">
            <Button
              aria-disabled={isSubmitting}
              className="flex-center w-full py-2.5 transition-all duration-300 hover:shadow-lg 
              hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
              containerClassName="!w-full"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>

        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-muted/30" />
          </div>
        <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
        </div>

        <div className="flex-center">
          <Button
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
          {"Don't have an account? "}
          <Link href="/register" className="text-gray-500 hover:text-gray-300 transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
