"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signupSchema } from "@/schemas/SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AtSign, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { onSignUpSubmit } from "@/actions";
import { SignUpFormState } from "@/types/utils";
import { useFormState } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import SubmitButton from "@/components/auth/SubmitButton";
import { useRouter } from "next/navigation";

const initialData: SignUpFormState = {
  errors: {
    username: [],
    email: [],
    password: [],
    confirmPassword: [],
  },
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { setError } = form;

  const [state, formAction] = useFormState<SignUpFormState, FormData>(
    onSignUpSubmit,
    initialData
  );

  useEffect(() => {
    // console.log(state.errors);
    if (state.errors?.username) {
      setError("username", { message: state.errors.username[0] });
    }

    if (state.errors?.email) {
      setError("email", { message: state.errors.email[0] });
    }

    if (state.errors?.password) {
      setError("password", { message: state.errors.password[0] });
    }

    if (state.errors?.confirmPassword) {
      setError("confirmPassword", { message: state.errors.confirmPassword[0] });
    }

    if (state?.success) {
      toast({
        title: "Success",
        description: state?.message,
      });
      form.reset();
      router.replace("/auth/sign-in");
    } else if (state.success === false) {
      toast({
        title: "Error",
        description: state?.message,
        variant: "destructive",
      });
    }
  }, [
    setError,
    state.errors,
    state.message,
    state.success,
    toast,
    router,
    form,
  ]);

  return (
    <>
      <div className="mx-auto min-w-[60%] text-center px-4">
        <h1 className="text-gray-700 text-xl font-bold py-2">Sign Up</h1>
        <p className="text-gray-400">
          Sign up to dive into the world of our AI platform
        </p>
      </div>
      {/* seperation */}
      <Separator className="my-2" />
      <Form {...form}>
        <form action={formAction} className="flex flex-col gap-1">
          {/* username field */}
          <div className="relative">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem {...field}>
                  <Label>Username:</Label>
                  <FormControl>
                    <Input
                      name="username"
                      type="text"
                      placeholder="Enter your username..."
                    />
                  </FormControl>
                  <FormDescription className="text-green-400">
                    This will appear as your username on the platform.
                  </FormDescription>
                  {state.errors.username &&
                    state.errors?.username.length > 0 && <FormMessage />}
                </FormItem>
              )}
            />
            <User className="absolute top-10 right-2" size={20} />
          </div>

          {/* email field */}
          <div className="relative">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem {...field}>
                  <Label>Email:</Label>
                  <FormControl>
                    <Input
                      name="email"
                      type="text"
                      placeholder="Enter your email..."
                    />
                  </FormControl>
                  {state.errors.email && state.errors?.email.length > 0 && (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />
            <AtSign className="absolute top-10 right-2" size={20} />
          </div>

          {/*Password field */}
          <div className="relative">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem {...field}>
                  <Label>Password:</Label>
                  <FormControl>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your username..."
                    />
                  </FormControl>
                  {state.errors.password &&
                    state.errors?.password.length > 0 && <FormMessage />}
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

          {/* confirmPassword field */}
          <div className="relative">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem {...field}>
                  <Label>Confirm Password:</Label>
                  <FormControl>
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                    />
                  </FormControl>
                  {state.errors.confirmPassword &&
                    state.errors?.confirmPassword.length > 0 && <FormMessage />}
                </FormItem>
              )}
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-10 right-2"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          <SubmitButton>Sign Up</SubmitButton>
        </form>
      </Form>

      <div className="flex flex-row gap-1 place-content-center items-center">
        <span>Already have an account?</span>
        <Link href={"/auth/sign-in"} className="block w-fit">
          <Button variant={"link"}>
            <span className="font-bold">Sign In</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default SignUpPage;
