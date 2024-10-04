"use client";
import React, { useState } from "react";
import { ChatCompletionStreamRequestMessages } from "@mistralai/mistralai/models/components";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";
import BotAvatar from "../bot-avatar";
import ConversationInput from "./conversation-input";

const ChatSection = () => {
  // States for message streaming and storing
  const [messages, setMessages] = useState<
    ChatCompletionStreamRequestMessages[]
  >([]);

  return (
    <>
      <div className="space-y-4 mt-4">
        <ConversationInput messages={messages} setMessages={setMessages} />
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg relative",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <pre className="text-sm font-sans overflow-x-scroll">
                  {message.content as string}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChatSection;
