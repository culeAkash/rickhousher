"use client";
import { conversationFormSchema } from "@/schemas/conversationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ConversationForm = () => {
  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting: isFormSubmitting } = form.formState;

  const onPromptSubmit = async (
    formData: z.infer<typeof conversationFormSchema>
  ) => {
    console.log(formData);

    await axios.post(`/api/conversation`, { prompt: formData.prompt });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onPromptSubmit)}
        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
      >
        <FormField
          name="prompt"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-10">
              <FormControl className="m-0 p-3">
                <Input
                  {...field}
                  className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  disabled={isFormSubmitting}
                  placeholder="What is the national language of India?"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="col-span-12 lg:col-span-2 w-full"
          disabled={isFormSubmitting}
        >
          Generate
        </Button>
      </form>
    </Form>
  );
};

export default ConversationForm;
