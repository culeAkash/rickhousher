import { z } from "zod";

export const getMessageSchema = z.object({
  chatType: z.enum(["CONVERSATION", "CODE", "PDF"], {
    message: "Please give proper chat type",
  }),
});

export const messageRequestSchema = z.object({
  message: z.string().min(1, { message: "Message can't be empty" }),
  chatType: z.enum(["CONVERSATION", "CODE", "PDF"], {
    message: "Please give proper chat type",
  }),
  role: z.enum(["USER", "ASSISTANT"], { message: "Please give proper role" }),
  fileId: z.string({ message: "fileId must be string" }).optional(),
});

export const pdfMessageSchema = z.object({
  message: z.string().min(1, { message: "Message can't be empty" }),
  fileId: z.string({ message: "fileId must be string" }),
});
