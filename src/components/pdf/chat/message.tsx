import BotAvatar from "@/components/bot-avatar";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/utils";
import { Message } from "ai";
import React from "react";
import ReactMarkDown from "react-markdown";

const MessageBox = ({ message }: { message: Message | ExtendedMessage }) => {
  if (message.id === "loading-message") {
    return message.content;
  }

  console.log(message);

  return (
    <div
      className={cn(
        "p-8 w-full flex items-start gap-x-8 rounded-lg relative",
        message.role === "USER" || message.role === "user"
          ? "bg-white border border-black/10"
          : "bg-muted"
      )}
    >
      {message.role === "USER" || message.role === "user" ? (
        <UserAvatar />
      ) : (
        <BotAvatar />
      )}
      <ReactMarkDown className="text-sm overflow-hidden leading-7 font-serif">
        {message.content.toString()}
      </ReactMarkDown>
    </div>
  );
};

export default MessageBox;
