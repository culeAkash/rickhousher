import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(5, {
    message: "Password must be at least 5 characters long",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
});
