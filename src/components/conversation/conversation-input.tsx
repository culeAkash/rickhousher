"use client";
import { conversationFormSchema } from "@/schemas/conversationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatCompletionStreamRequestMessages } from "@mistralai/mistralai/models/components";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import BotAvatar from "../bot-avatar";
import Empty from "../empty";
import axios from "axios";

interface InputProps {
  messages: ChatCompletionStreamRequestMessages[];
  setMessages: React.Dispatch<
    React.SetStateAction<ChatCompletionStreamRequestMessages[]>
  >;
}

const ConversationInput = ({ messages, setMessages }: InputProps) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const currentFullMessageRef = useRef("");
  const [streamingMessage, setStreamingMessage] = useState("");

  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting: isFormSubmitting } = form.formState;

  useEffect(() => {
    if (isStreaming) {
      let index = 0;
      const currentFullMessage = currentFullMessageRef.current;
      // console.log(currentFullMessage);

      const intervalId = setInterval(() => {
        if (index < currentFullMessage.length) {
          // console.log(index);
          // console.log(currentFullMessage[index]);
          setStreamingMessage((prev) => prev + currentFullMessage[index]);
          index++;
        } else {
          clearInterval(intervalId);
          setIsStreaming(false);

          const assistantMessage: ChatCompletionStreamRequestMessages = {
            role: "assistant",
            content: currentFullMessage.substring(1),
          };

          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
          setStreamingMessage("");
        }
      }, 20);
    }
  }, [isStreaming]);

  const onPromptSubmit = async (
    formData: z.infer<typeof conversationFormSchema>
  ) => {
    try {
      const userMessage: ChatCompletionStreamRequestMessages = {
        role: "user",
        content: formData.prompt,
      };

      setMessages((oldMessages) => [...oldMessages, userMessage]);

      const newMessages = [...messages, userMessage];

      const response = await axios.post(`/api/conversation`, {
        messages: newMessages,
      });
      // console.log("Got response");
      currentFullMessageRef.current = "  " + response.data.data;
      setIsStreaming(true);

      form.reset();
    } catch (error) {
      // TODO : Open Pro Model
      console.log(error);
    }
  };

  return (
    <>
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
      {isStreaming ? (
        <div className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-red-600/10 border-red-600">
          <BotAvatar />
          <pre className="text-sm font-serif overflow-x-scroll">
            {streamingMessage}
          </pre>
        </div>
      ) : null}
      <div>
        {!isStreaming && messages.length === 0 && (
          <Empty label="No Conversation Started" />
        )}
      </div>
    </>
  );
};

export default ConversationInput;
