import { z } from "zod";

export const conversationFormSchema = z.object({
  prompt: z
    .string({
      message: "Prompt has to be a string",
    })
    .min(1, {
      message: "Prompt is required",
    }),
});
