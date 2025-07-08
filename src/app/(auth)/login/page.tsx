"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from '@/components/ui/button'
import { GoogleIcon } from '@/components/icons/google'
import { Input } from '@/components/ui/input'
import { schema, SchemaType } from './schema'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: SchemaType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(data)
        resolve(true)
      }, 2000)
    })
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
                          <Button type='submit' className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
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
                <GoogleIcon />
                Continue with Google
              </Button>
            
          </CardFooter>
      </Card>
    </div>
  )
}

export default Login
