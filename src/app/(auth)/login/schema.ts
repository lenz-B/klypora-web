import { z } from "zod";

export const schema = z.object({
  email: z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address"),
password: z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
})

export type SchemaType = z.infer<typeof schema>;