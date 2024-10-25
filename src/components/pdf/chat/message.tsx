import BotAvatar from "@/components/bot-avatar";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/utils";
import React from "react";
import ReactMarkDown from "react-markdown";

const Message = ({ message }: { message: ExtendedMessage }) => {
  if (message.id === "loading-message") {
    return message.content;
  }
  return (
    <div
      className={cn(
        "p-8 w-full flex items-start gap-x-8 rounded-lg relative",
        message.role === "USER" ? "bg-white border border-black/10" : "bg-muted"
      )}
    >
      {message.role === "USER" ? <UserAvatar /> : <BotAvatar />}
      <ReactMarkDown className="text-sm overflow-hidden leading-7 font-serif">
        {message.content.toString()}
      </ReactMarkDown>
    </div>
  );
};

export default Message;
