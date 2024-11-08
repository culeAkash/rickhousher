"use client";
import Empty from "@/components/empty";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useContext, useEffect, useRef } from "react";
import MessageBox from "./message";
import { ChatContext } from "@/context/chat-context-provider";
import { MessageSquare } from "lucide-react";
import { useIntersection } from "@mantine/hooks";

const Messages = () => {
  const {
    fetchMoreMessages,
    gettingResponse,
    isFetchingFromDB,
    messages,
    hasMore,
    resetScroll,
  } = useContext(ChatContext);

  const messagesContainer = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);

  useEffect(() => {
    if (messagesContainer.current) {
      if (resetScroll)
        messagesContainer.current.scrollTop =
          -messagesContainer.current.scrollHeight;
      else {
        messagesContainer.current.scrollTop =
          prevScrollHeight.current - messagesContainer.current.scrollHeight;
      }
      prevScrollHeight.current = messagesContainer.current.scrollHeight;
    }
  }, [messages, resetScroll]);

  console.log(messages);

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchMoreMessages();
    }
  }, [entry, fetchMoreMessages]);

  if (!isFetchingFromDB && !hasMore && messages.length === 0) {
    return (
      <Empty label="You are all set... Start asking your first question" />
    );
  }

  return (
    <>
      <div className="space-y-4 mt-4 px-2">
        <div
          ref={messagesContainer}
          className="flex flex-col-reverse max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-round scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {isFetchingFromDB && (
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          )}
          {!hasMore && messages.length > 0 && (
            <div className="flex gap-x-3 justify-center">
              <MessageSquare />
              <p className="text-sm text-zinc-500">End of conversation</p>
            </div>
          )}
          {messages &&
            messages.length > 0 &&
            messages.map((message, index) => {
              if (0 === index) {
                return (
                  <MessageBox ref={ref} key={message.id} message={message} />
                );
              } else {
                return <MessageBox key={message.id} message={message} />;
              }
            })}
          {gettingResponse && (
            <div className="p-8 w-full flex items-start gap-x-8 rounded-lg relative bg-red-800/10 border-red-800/10">
              <Skeleton className="flex h-10 w-10 shrink-0 overflow-hidden rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
