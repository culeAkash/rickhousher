"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <Avatar>
      <AvatarImage src={user?.image} />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
