import React from "react";
import { Separator } from "./ui/separator";
import { Key, LogOutIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileSection = () => {
  const optionStyle =
    "text-sm text-muted-foreground font-mono flex items-center cursor-pointer hover:bg-gray-900 hover:text-white p-2 rounded-md";

  return (
    <div className="w-full h-full md:ml-72 flex space-x-6">
      <div className="w-[28%] md:w-[20%] flex flex-col gap-y-3 mt-5 pl-2">
        <div className={cn(optionStyle)}>
          <User className="text-blue-500 bg-blue-500/10 rounded-sm p-1" />
          <p className="ml-2">Update Info</p>
        </div>
        <Separator />
        <div className={cn(optionStyle)}>
          <Key className="text-orange-900 bg-fuchsia-900/10 rounded-sm p-1" />
          <p className="ml-2">Privary Settings</p>
        </div>
        <Separator />
        <div className={cn(optionStyle)}>
          <LogOutIcon
            className="text-red-800 bg-red-800/10 
          rounded-sm p-1"
          />
          <p className="ml-2">Logout</p>
        </div>
      </div>
      <Separator orientation="vertical" />
    </div>
  );
};

export default ProfileSection;
