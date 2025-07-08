"use client"

import React from 'react'
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
import {schema, SchemaType} from './schema'

  // TODO
    // 1 - loading state - done
    // 2 - try catch - 
    // 3 - 500 error handler
    // 4 - sentry error logger
    // 5 - show toast message on success

const ForgotPassword = () => {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues :{
      email:""
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
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
              <div className="grid gap-4">
                <FormField control={form.control} name='email' render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type='email'
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword
