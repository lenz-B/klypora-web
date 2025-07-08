import { z } from "zod";

export const schema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export type SchemaType = z.infer<typeof schema>;
