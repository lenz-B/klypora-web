import { z } from "zod"
import { usernameField, emailField, passwordField } from "./shared"

export const registerSchema = z.object({
  username: usernameField,
  email: emailField,
  password: passwordField,
})

export type RegisterForm = z.infer<typeof registerSchema>
