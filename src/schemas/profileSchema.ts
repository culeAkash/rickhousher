import { z } from "zod";
import { usernameValidation } from "./SignUpSchema";

export const profileInfoFormSchema = z.object({
  name: z.string().optional(),
  username: usernameValidation,
});

export const passwordChangeFormSchema = z.object({
  oldPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters long",
    })
    .max(20, {
      message: "Password must be less than 20 characters long",
    })
    .optional(),
  confirmPassword: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters long",
    })
    .max(20, {
      message: "Password must be less than 20 characters long",
    })
    .optional(),
});
