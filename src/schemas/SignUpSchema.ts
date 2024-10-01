import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "Username can't be less than 5 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9\s]+$/, "Username must not contain special characters");

export const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters long",
    })
    .max(20, {
      message: "Password must be less than 20 characters long",
    }),
  confirmPassword: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters long",
    })
    .max(20, {
      message: "Password must be less than 20 characters long",
    }),
});
