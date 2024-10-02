import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(5, {
    message: "Password must be at least 5 characters long",
  }),
  identifier: z.string().min(5, {
    message: "Identifier must be at least 5 characters long",
  }),
});
