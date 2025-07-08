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
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp"
import Link from 'next/link'
import { schema, SchemaType } from './schema'

const OtpVerification = () => {
  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: ''
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
          <CardTitle className='font-logo text-3xl flex-center'>{'Klypora'}</CardTitle>
          <CardDescription className='flex-center'>
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS.source} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </Button>
                <div className="w-full mt-2 text-xs flex-center text-gray-400">
                  Didn't receive the code?&nbsp;
                  <Link href="/forgot-password" className="text-gray-300 hover:text-gray-200">Resend</Link>
                </div>
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

export default OtpVerification
