"use client";
import Empty from "@/components/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import React, { useContext, useEffect, useRef } from "react";
import MessageBox from "./message";
import { ChatContext } from "@/context/chat-context-provider";

const Messages = () => {
  const {
    fetchMoreMessages,
    gettingResponse,
    isFetchingFromDB,
    messages,
    hasMore,
  } = useContext(ChatContext);

  console.log(messages);

  const loadingMessage = {
    createdAt: new Date(),
    id: "loading-message",
    isUserMessage: false,
    content: (
      <div className="p-8 w-full flex items-start gap-x-8 rounded-lg relative bg-red-800/10 border-red-800/10">
        <Skeleton className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ),
    role: "ASSISTANT",
  };

  const combinedMessages = [
    ...(messages ?? []),
    ...(gettingResponse ? [loadingMessage] : []),
  ];

  useEffect(() => {
    const container = document.querySelector(".flex flex-col-reverse");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (!gettingResponse && !hasMore && combinedMessages.length === 0) {
    return (
      <Empty label="You are all set... Start asking your first question" />
    );
  }

  console.log(combinedMessages);

  return (
    <>
      {messages.length === 0 && !isFetchingFromDB && (
        <Empty label="No Conversation Started" />
      )}
      <div className="space-y-4 mt-4 px-2">
        <div className="flex flex-col-reverse max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-round scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
          {combinedMessages &&
            combinedMessages.length > 0 &&
            combinedMessages.map((message, index) => {
              if (0 === index) {
                return <MessageBox key={index} message={message} />;
              } else {
                return <MessageBox key={index} message={message} />;
              }
            })}

          {isFetchingFromDB && (
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          )}
          {!hasMore && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="h-8 w-8 text-purple-700" />
              <h3 className="font-semibold text-xl">
                No more messages to load
              </h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
