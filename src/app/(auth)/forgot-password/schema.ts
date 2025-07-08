import { z } from "zod";  

export const schema = z.object({
  email: z.string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
})
export type SchemaType = z.infer<typeof schema>;