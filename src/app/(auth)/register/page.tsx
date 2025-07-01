"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { IconBrandGoogle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterForm } from "@/types/auth/register"

const defaultValues = {
  email: '',
  username: '',
  password: ''
}

interface Props{ email: string, id: number }

export default function RegisterPage({
  email, id 
}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }, 
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      //send to backend
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      console.log(data);
    } catch (error) {
      setError('root', {
        message: 'message from the backend'
      })
    }
  }


  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold font-logo text-text">
        <div className="flex-center">
          <TextHoverEffect text="Klypora" />
        </div>
        </CardTitle>
        <CardDescription className="text-text-muted">Create your account to get started</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="username" className="text-text">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <Input
                id="username"
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="pl-10"
              />
              { errors.username && (
                <div className="text-destructive text-caption mt-1" role="alert">
                  {errors.username.message}
                </div>
              ) }
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
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                required
              />
              { errors.email && (
                <div className="text-destructive text-caption mt-1" role="alert">
                  {errors.email.message}
                </div>
              ) }
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              { errors.password && (
                <div className="text-destructive text-caption mt-1" role="alert">
                  {errors.password.message}
                </div>
              ) }
            </div>
          </div>

          {errors.root && (
            <div className="text-destructive text-caption text-center bg-destructive/10 border border-destructive/20 rounded-md p-3" role="alert">
              {errors.root.message}
            </div>
          )}

          <Button
            aria-disabled={isSubmitting}
            containerClassName="!w-full"
            className="h-10 flex-center w-full py-2.5 transition-all duration-300 hover:shadow-lg 
              hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]]"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
            containerClassName="!w-full"
            className="h-10 flex-center w-full bg-bg-light/10 border-border-muted/30 text-text hover:bg-bg-light/20 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
          <IconBrandGoogle className="h-4 w-4 text-gray-50 " />
          <span className="text-sm font-medium ml-2">
            Continue with Google
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
  )
}