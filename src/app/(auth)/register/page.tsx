'use client'
import React from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { MagicCard } from "@/components/magicui/magic-card"
import { usernameField, emailField, passwordField } from './schema'

export const formSchema = z.object({
  username: usernameField,
  email: emailField,
  password: passwordField,
})

const defaultValues = {
  email: '',
  username: '',
  password: ''
}

const Register = () => {
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
        <MagicCard
          className="p-0"
        >
          <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
            <CardTitle>Klypora</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
                <div className="grid gap-4">
                  <FormField control={form.control} name='username' render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="grid gap-2">
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='name12'
                             {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )
                  }} />
                  <FormField control={form.control} name='email' render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="grid gap-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder="name@example.com"
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )
                  }} />
                  <FormField control={form.control} name='password' render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="grid gap-2">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type='password'
                              placeholder="don't tell me"
                              {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )
                  }} />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="p-4 border-t border-border [.border-t]:pt-4">
            <Button type='submit' className='w-full' onClick={form.handleSubmit(handleSubmit)}>
              Register
            </Button>
          </CardFooter>
        </MagicCard>
      </Card>
    </div>
  )
}

export default Register