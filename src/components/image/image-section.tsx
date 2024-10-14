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
import { imageFormSchema, resolutionOptions } from "@/schemas/image-schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiResponse } from "@/types/ApiResponse";
import Image from "next/image";
import Loader from "../loader";
import { Card, CardFooter } from "../ui/card";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

const ImageSection = () => {
  const proModal = useProModal();
  const router = useRouter();
  const { toast } = useToast();
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      resolution: "512x512",
    },
  });

  const onPromptSubmit = async (formData: z.infer<typeof imageFormSchema>) => {
    setImage("");
    setIsLoading(true);
    const { prompt, resolution } = formData;
    console.log(prompt, resolution);

    try {
      const response: ApiResponse = await axios.post("/api/image", {
        prompt,
        resolution,
      });

      if (response.data.success) {
        const base64Data = response.data.data;

        // convert base64 string back to blob
        const byteArray = Buffer.from(base64Data, "base64");

        const blob = new Blob([byteArray], { type: "image/png" });
        console.log(blob.size);

        const imageUrl = URL.createObjectURL(blob);
        setIsLoading(false);
        setImage(imageUrl);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setIsLoading(false);

      if (axiosError.status === 403) {
        proModal.onOpen();
      }

      toast({
        title: "Error",
        description: axiosError.message,
        variant: "destructive",
      });
    } finally {
      router.refresh();
    }
  };

  console.log(image);

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
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl className="m-0 p-3">
                    <Input
                      disabled={isLoading}
                      {...field}
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      placeholder="A beautiful Cat."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="resolution"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-3">
                  <FormControl>
                    <Select disabled={isLoading} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an image resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Resolution</SelectLabel>
                          {resolutionOptions.map((option) => {
                            return (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="col-span-12 lg:col-span-3 w-full"
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
        {image.length === 0 && !isLoading && (
          <Empty label="Start generating your desired images" />
        )}
        {image.length > 0 && !isLoading && (
          <div className="mt-8">
            <Card className="rounded-lg overflow-hidden h-full w-full">
              <div className="relative aspect-square">
                <Image src={image} fill alt="Response Image" />
              </div>
              <CardFooter className="p-2">
                <Button
                  onClick={() => window.open(image)}
                  variant={"secondary"}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageSection;
