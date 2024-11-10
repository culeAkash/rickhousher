"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { absoluteUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

const logoutRedirectUrl = absoluteUrl("/auth/sign-in");

const LogoutButton = () => {
  const router = useRouter();
  const onLogout = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: logoutRedirectUrl,
    });
    router.push(data.url);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      className="w-full space-x-1 text-sm font-serif"
      onClick={onLogout}
    >
      <LogOut />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
