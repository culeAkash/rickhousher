"use client";
import { passwordChangeFormSchema } from "@/schemas/profileSchema";
import React, { useState } from "react";
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
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

interface showPasswordOptions {
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

const PasswordChangeSection = () => {
  const [showPasswords, setShowPasswords] = useState<showPasswordOptions>({
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const form = useForm<z.infer<typeof passwordChangeFormSchema>>({
    resolver: zodResolver(passwordChangeFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { setError } = form;

  const passwordChangeHandler = async (
    formData: z.infer<typeof passwordChangeFormSchema>
  ) => {
    // Perform password change logic here
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    try {
    } catch (error) {}
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(passwordChangeHandler)}
        className="h-fit p-5 rounded-lg shadow transition hover:shadow-md"
      >
        <div className="basis-1/2 space-y-3">
          <div className="text-sm md:text-xl lg:text-2xl text-zinc-600">
            Privacy Settings
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password: </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter old password"
                      {...field}
                      type={showPasswords.showOldPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span
              onClick={() =>
                setShowPasswords((prev) => {
                  return { ...prev, showOldPassword: !prev.showOldPassword };
                })
              }
              className="absolute top-10 right-2"
            >
              {showPasswords.showOldPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password: </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter new password..."
                      {...field}
                      type={showPasswords.showNewPassword ? "text" : "password"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span
              onClick={() =>
                setShowPasswords((prev) => {
                  return { ...prev, showNewPassword: !prev.showNewPassword };
                })
              }
              className="absolute top-10 right-2"
            >
              {showPasswords.showNewPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>
          </div>
          <div className="relative">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password: </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm new Password..."
                      {...field}
                      type={
                        showPasswords.showConfirmPassword ? "text" : "password"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <span
              onClick={() =>
                setShowPasswords((prev) => {
                  return {
                    ...prev,
                    showConfirmPassword: !prev.showConfirmPassword,
                  };
                })
              }
              className="absolute top-10 right-2"
            >
              {showPasswords.showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant={"default"} size={"lg"}>
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PasswordChangeSection;
