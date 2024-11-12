import React, { useContext } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { ChatContext } from "@/context/chat-context-provider";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { conversationFormSchema } from "@/schemas/conversationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const ChatInput = ({ isDisabled }: { isDisabled: boolean }) => {
  const { addMessage, onStop, isLoading } = useContext(ChatContext);

  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onPromptSubmit = async (
    formData: z.infer<typeof conversationFormSchema>
  ) => {
    const { prompt } = formData;

    addMessage(prompt);

    form.reset();
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
            <FormItem className="col-span-12 lg:col-span-9">
              <FormControl className="m-0 p-3">
                <Input
                  {...field}
                  className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  disabled={isLoading || isDisabled}
                  placeholder="What is the national language of India?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading && !isDisabled && (
          <Button
            className="col-span-12 lg:col-span-3 w-full"
            type="button"
            onClick={() => {
              onStop();
            }}
          >
            Stop
          </Button>
        )}
        {(isLoading && !isDisabled) || (
          <Button className="col-span-12 lg:col-span-3 w-full" type="submit">
            Generate
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ChatInput;
