import { z } from "zod"
import { passwordField } from "./shared"

export const loginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: passwordField,
})

export type LoginForm = z.infer<typeof loginSchema>
