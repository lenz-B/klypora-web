import { z } from "zod"
import { emailField } from "./shared"

export const forgotPasswordSchema = z.object({
  email: emailField
})

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
