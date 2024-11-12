"use client";
import { profileInfoFormSchema } from "@/schemas/profileSchema";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import userImage from "../../../public/user.png";
import Image from "next/image";
import { Button } from "../ui/button";

const BasicInfoUpdateSection = () => {
  const { data: session } = useSession();

  console.log(session?.user);

  const form = useForm<z.infer<typeof profileInfoFormSchema>>({
    defaultValues: {
      name: session?.user.name ?? "",
      username: session?.user.username ?? "",
      image: undefined,
    },
  });

  const inputImageRef = useRef<HTMLInputElement>(null);
  const [renderImage, setRenderImage] = useState<File | null>(null);

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
  ) => {};

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
                  <FormDescription className="text-green-500">
                    This is your public display name.
                  </FormDescription>
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
              <div className="h-48 w-48 overflow-hidden">
                <Image src={URL.createObjectURL(renderImage)} alt="" fill />
              </div>
            ) : session?.user.image ? (
              <Avatar className="h-48 w-48">
                <AvatarImage
                  src={`${session.user?.image}`}
                  alt={session.user?.username}
                />
                <AvatarFallback delayMs={100}>
                  <User />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-48 w-48 overflow-hidden">
                <Image src={userImage} alt="" />
              </div>
            )}
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <Input
                  type="file"
                  ref={inputImageRef}
                  onChange={handlerImageChange}
                  className="hidden"
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant={"default"} size={"lg"}>
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicInfoUpdateSection;
