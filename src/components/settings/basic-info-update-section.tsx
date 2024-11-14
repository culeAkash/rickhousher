"use client";
import { profileInfoFormSchema } from "@/schemas/profileSchema";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import userImage from "../../../public/user.png";
import Image from "next/image";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

const BasicInfoUpdateSection = ({
  name = "",
  username = "",
  image = "",
}: {
  name: string;
  username: string;
  image: string;
}) => {
  const form = useForm<z.infer<typeof profileInfoFormSchema>>({
    resolver: zodResolver(profileInfoFormSchema),
    defaultValues: {
      name: name ?? "",
      username: username ?? "",
    },
  });

  const { setError } = form;

  const inputImageRef = useRef<HTMLInputElement>(null);
  const [renderImage, setRenderImage] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageClick = () => {
    inputImageRef.current?.click();
  };

  const handlerImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    const file = files ? files[0] : null;
    if (file) setRenderImage(file);
  };

  const profileChangeHandler = async (
    formData: z.infer<typeof profileInfoFormSchema>
  ) => {
    try {
      setIsUpdating(true);
      const { name: formName, username: formUsername } = formData;
      console.log(formName, formUsername);
      console.log(renderImage);

      if (name !== formName || username !== formUsername) {
        const response = await axios.get(
          `/api/checkusername?username=${formUsername}`
        );

        if (response.data.data.isPresent) {
          setError("username", {
            message: "Username already exists, try again.",
          });
          return;
        }

        await axios.patch("/api/updateprofile", {
          name: formName,
          username: formUsername,
        });
      }

      if (renderImage) {
        const res = await startUpload([renderImage]);

        if (!res) {
          toast({
            title: "Error",
            description: "Failed to upload image",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError.message);
      // handle errors as needed
      toast({
        title: "Error",
        description: axiosError.message,
        variant: "default",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(profileChangeHandler)}
        className="h-fit p-5 rounded-lg shadow transition hover:shadow-md mb-5"
      >
        <div className="flex flex-col lg:flex-row justify-between">
          <div className="basis-1/2 space-y-3">
            <div className="text-sm md:text-xl lg:text-2xl text-zinc-600">
              Basic Details
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name: </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username: </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className="basis-1/2 flex justify-center items-center relative h-48 w-full mt-2 overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            {renderImage ? (
              <div className="h-48 w-48 overflow-hidden relative">
                <Image src={URL.createObjectURL(renderImage)} alt="" fill />
              </div>
            ) : image ? (
              <Avatar className="h-48 w-48">
                <AvatarImage src={`${image}`} alt={username} />
                <AvatarFallback delayMs={100}>
                  <Image src={userImage} alt="" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-48 w-48 overflow-hidden">
                <Image src={userImage} alt="" />
              </div>
            )}
            <Input
              type="file"
              ref={inputImageRef}
              onChange={handlerImageChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant={"default"} size={"lg"}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </>
            ) : (
              <span className="font-bold font-sans">Update</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicInfoUpdateSection;
