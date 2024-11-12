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
import { AtSign, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import GithubSignIn from "@/components/auth/GithubSignIn";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const onSignInSubmit = async (signInData: z.infer<typeof loginSchema>) => {
    setIsFormSubmitting(true);
    const response = await signIn("credentials", {
      redirect: false,
      ...signInData,
    });

    // console.log(response);

    if (response?.error) {
      // console.log(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
      setIsFormSubmitting(false);
      return;
    }
    if (response?.ok) {
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      setIsFormSubmitting(false);
      form.reset();
      router.push("/home/dashboard"); // redirect to dashboard
    }
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
          onSubmit={form.handleSubmit(onSignInSubmit)}
          className="flex flex-col gap-4 p-3"
        >
          <div className="relative">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username:</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
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

          <Button
            className="mt-3"
            type="submit"
            variant={"outline"}
            disabled={isFormSubmitting}
          >
            {isFormSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait ...
              </>
            ) : (
              <span className="font-bold font-sans">Login</span>
            )}
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
