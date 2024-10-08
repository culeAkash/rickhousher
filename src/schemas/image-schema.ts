import z from "zod";

export const imageFormSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
  resolution: z.string().min(1),
});

export const resolutionOptions = [
  {
    value: "256x256",
    label: "256x256",
  },
  {
    value: "512x512",
    label: "512x512",
  },
  {
    value: "1024x1024",
    label: "1024x1024",
  },
];
