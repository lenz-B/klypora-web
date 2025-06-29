import { z } from "zod"

export const usernameField = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed")
  .refine((val) => !val.includes(" "), "Username cannot contain spaces")

export const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")

export const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[^A-Za-z0-9]/, "At least one special character")
