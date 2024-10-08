"use client";
import React, { useState } from "react";
import Empty from "../empty";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import Loader from "../loader";
import { conversationFormSchema } from "@/schemas/conversationSchema";

const MusicSection = () => {
  const { toast } = useToast();
  const [music, setMusic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof conversationFormSchema>>({
    resolver: zodResolver(conversationFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onPromptSubmit = async (
    formData: z.infer<typeof conversationFormSchema>
  ) => {
    setMusic("");
    setIsLoading(true);
    const { prompt } = formData;
    console.log(prompt);

    try {
      const response: ApiResponse = await axios.post("/api/music", {
        prompt,
      });

      if (response.data.success) {
        //TODO: convert base64 string back to blob for music
        console.log(response.data.data);
        const base64Data = response.data.data;
        const byteArray = Buffer.from(base64Data, "base64");
        const blob = new Blob([byteArray], { type: "audio/mpeg" });

        const musicContent = URL.createObjectURL(blob);
        console.log(musicContent);

        setIsLoading(false);
        setMusic(musicContent);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setIsLoading(false);
      toast({
        title: "Error",
        description: axiosError.message,
        variant: "destructive",
      });
    }
  };

  console.log(music);

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
                      disabled={isLoading}
                      {...field}
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      placeholder="Give a soothing tune which can help me fall asleep."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4 flex items-center justify-center">
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {music.length === 0 && !isLoading && (
          <Empty label="Start generating your desired audios" />
        )}
        {music.length !== 0 && !isLoading && (
          <audio controls src={music} autoPlay className="mt-8 w-[75%]" />
        )}
      </div>
    </>
  );
};

export default MusicSection;
