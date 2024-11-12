import { z } from "zod";
import { usernameValidation } from "./SignUpSchema";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const profileInfoFormSchema = z.object({
  name: z.string().min(5, { message: "Name is required" }).optional(),
  username: z.optional(usernameValidation),
  image: z
    .instanceof(File, { message: "Please upload a file" })
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
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
