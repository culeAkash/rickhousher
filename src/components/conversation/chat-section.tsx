"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";
import BotAvatar from "../bot-avatar";
import Empty from "../empty";
import { useChat } from "ai/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { conversationFormSchema } from "@/schemas/conversationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

const ChatSection = () => {
  const { toast } = useToast();

  const [getResponse, setGetResponse] = useState(false);

  const { messages, isLoading, stop, append } = useChat({
    keepLastMessageOnError: true,
    api: "/api/conversation",
    onResponse: (response) => {
      setGetResponse(false);
      console.log(response);
    },
  });

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
    console.log(prompt);

    try {
      setGetResponse(true);
      append({
        role: "user",
        content: prompt,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      toast({
        title: "Error",
        description: axiosError.message,
        variant: "destructive",
      });
    }
  };

  console.log(messages);

  return (
    <>
      <div className="space-y-4 mt-4">
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
                      disabled={isLoading}
                      placeholder="What is the national language of India?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading && (
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="button"
                onClick={() => {
                  stop();
                  setGetResponse(false);
                }}
              >
                Stop
              </Button>
            )}
            {isLoading || (
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
              >
                Generate
              </Button>
            )}
          </form>
        </Form>
        <div>
          {messages.length === 0 && <Empty label="No Conversation Started" />}
        </div>
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg relative",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm font-sans">{message.content as string}</p>
              </div>
            );
          })}
          {getResponse && (
            <div className="p-8 w-full flex items-start gap-x-8 rounded-lg relative bg-red-800/10 border-red-800/10">
              <Skeleton className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[450px]" />
                <Skeleton className="h-4 w-[400px]" />
              </div>
            </div>
          )}
          {}
        </div>
      </div>
    </>
  );
};

export default ChatSection;