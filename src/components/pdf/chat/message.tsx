import BotAvatar from "@/components/bot-avatar";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { Message } from "ai";
import React, { forwardRef } from "react";
import ReactMarkDown from "react-markdown";

interface MessageProps {
  message: Message;
}

const MessageBox = forwardRef<HTMLDivElement, MessageProps>(
  ({ message }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-8 w-full flex items-start gap-x-8 rounded-lg relative",
          message.role === "user"
            ? "bg-white border border-black/10"
            : "bg-muted"
        )}
      >
        {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
        <ReactMarkDown className="text-sm overflow-hidden leading-7 font-serif">
          {message.content || ""}
        </ReactMarkDown>
      </div>
    );
  }
);
MessageBox.displayName = "MessageBox";
export default MessageBox;
