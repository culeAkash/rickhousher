"use client";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/LoginSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AtSign, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import GithubSignIn from "@/components/auth/GithubSignIn";
import GoogleSignIn from "@/components/auth/GoogleSignIn";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log(data);
  };

  return (
    <>
      {/* title */}
      <div className="mx-auto min-w-[60%] text-center px-4">
        <h1 className="text-gray-700 text-xl font-bold py-2">Welcome</h1>
        <p className="text-gray-400">Sign in to try out our platform</p>
      </div>
      {/* seperation */}
      <Separator className="my-2" />
      {/* form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginSubmit)}
          className="flex flex-col gap-4 p-3"
        >
          <div className="relative">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AtSign className="absolute top-10 right-2" size={20} />
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-10 right-2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <Button type="submit" variant={"outline"}>
            <span className="font-bold font-sans">Login</span>
          </Button>
        </form>
      </Form>
      <Separator className="my-1" />

      {/* google sign in button */}
      <GoogleSignIn />
      {/* github sign in button */}
      <GithubSignIn />

      <div className="flex flex-row gap-1 place-content-center items-center">
        <span>Dont have an account?</span>
        <Link href={"/auth/sign-up"} className="block w-fit">
          <Button variant={"link"}>
            <span className="font-bold">Sign Up</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default LoginPage;
