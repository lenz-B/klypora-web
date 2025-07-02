import { z } from "zod";

export const emailField = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")