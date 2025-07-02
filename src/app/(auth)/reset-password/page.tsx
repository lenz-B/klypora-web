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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { resetPasswordSchema } from './schema'
import { Eye, EyeOff, Lock } from "lucide-react"

const defaultValues = {
  password: '',
  confirmPassword: ''
}

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues
  })

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    console.log(data)
  }

  return (
    <div className='flex-center flex-col h-screen bg-bg-dark'>
      <Card className="p-0 max-w-sm w-full shadow-none border-border">
        <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
          <CardTitle className='font-logo text-3xl flex-center'>Klypora</CardTitle>
          <CardDescription className='flex-center'>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
              <div className="grid gap-4">
                <FormField control={form.control} name='password' render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock size={16} />
                      </span>
                      <FormControl>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          className="pl-9 pr-9"
                          placeholder="New Password"
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
                  </FormItem>
                )} />
                <FormField control={form.control} name='confirmPassword' render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock size={16} />
                      </span>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pl-9 pr-9"
                          placeholder="Confirm Password"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type='submit' className='w-full'>
                  Reset Password
                </Button>
                <div className="w-full mt-2 text-xs flex-center text-gray-400">
                  <Link href="/login" className="text-gray-300 hover:text-gray-200">Back to login</Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
