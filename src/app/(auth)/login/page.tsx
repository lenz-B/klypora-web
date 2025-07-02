"use client"

import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { emailField, passwordField } from './schema'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const formSchema = z.object({
  email: emailField,
  password: passwordField,
})

const defaultValues = {
  email: '',
  password: ''
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <div className='flex-center flex-col h-screen bg-bg-dark'>
      <Card className="p-0 max-w-sm w-full shadow-none border-border">
          <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
            <CardTitle className='font-logo text-3xl flex-center'>Klypora</CardTitle>
            <CardDescription className='flex-center'>
              Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
                <div className="grid gap-4">
                  <FormField control={form.control} name='email' render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Mail size={16} />
                          </span>
                          <FormControl>
                            <Input
                              type='email'
                              className="pl-9"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )
                  }} />
                  <FormField control={form.control} name='password' render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Lock size={16} />
                          </span>
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              className="pl-9 pr-9"
                              placeholder="Password"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                            onClick={() => setShowPassword((v) => !v)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <FormMessage />
                        <div className="w-full text-xs text-right text-gray-400">
                          <Link href="/forgot-password" className="text-gray-300 hover:text-gray-200">Forgot Password?</Link>
                        </div>
                        <div>
                          <Button type='submit' className='w-full' onClick={form.handleSubmit(handleSubmit)}>
                            Login
                          </Button>
                          <div className="w-full mt-2 text-xs flex-center text-gray-400">
                            Don't have an account?&nbsp;
                            <Link href="/register" className="text-gray-300 hover:text-gray-200">Register</Link>
                          </div>
                        </div>
                      </FormItem>
                    )
                  }} />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
            <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_9914_10)">
                    <path d="M17.64 9.2045C17.64 8.56636 17.5827 7.95272 17.4764 7.36359H9V10.8453H13.8436C13.6345 11.9564 13.0036 12.9118 12.0482 13.5482V15.5482H14.8236C16.3491 14.1455 17.64 11.9273 17.64 9.2045Z" fill="#4285F4"/>
                    <path d="M9 18C11.43 18 13.4673 17.2045 14.8236 15.5482L12.0482 13.5482C11.3273 14.0482 10.3273 14.3636 9 14.3636C6.65545 14.3636 4.67364 12.7045 3.96455 10.5482H1.09091V12.6182C2.44 15.0455 5.48182 18 9 18Z" fill="#34A853"/>
                    <path d="M3.96455 10.5482C3.78409 10.0482 3.68182 9.51182 3.68182 8.95455C3.68182 8.39727 3.78409 7.86091 3.96455 7.36091V5.29091H1.09091C0.396364 6.61818 0 8.23636 0 9.95455C0 11.6727 0.396364 13.2909 1.09091 14.6182L3.96455 12.5482V10.5482Z" fill="#FBBC05"/>
                    <path d="M9 3.63636C10.3273 3.63636 11.3273 4.04545 12.0482 4.54545L14.8818 1.70909C13.4673 0.409091 11.43 0 9 0C5.48182 0 2.44 2.95455 1.09091 5.29091L3.96455 7.36091C4.67364 5.20455 6.65545 3.63636 9 3.63636Z" fill="#EA4335"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_9914_10">
                      <rect width="18" height="18" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Continue with Google
              </Button>
            
          </CardFooter>
      </Card>
    </div>
  )
}

export default Login
