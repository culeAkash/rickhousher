"use client";
import Empty from "@/components/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@prisma/client";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import MessageBox from "./message";
import axios from "axios";
import { ChatContext } from "@/context/chat-context-provider";

interface MessageProps {
  fileId: string;
}

const Messages = ({ fileId }: MessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { isLoading: isAiThinking } = useContext(ChatContext);

  console.log(isAiThinking ? "Loading" : "Not Loading");

  const { toast } = useToast();

  const fetchMessages = async () => {
    if (loading || !hasMore || isAiThinking) return;

    setLoading(true);
    console.log("fetching messages");

    try {
      const response = await axios.post("/api/pdf/getMessages", {
        fileId: fileId as string,
        cursor: nextCursor,
        limit: 10,
      });

      const result = response.data;

      if (result.success) {
        console.log(result.data.messages);

        setMessages((prevMessages) => {
          console.log(prevMessages);
          return [...prevMessages, ...result.data.messages];
        });

        setNextCursor(result.data.nextCursor);

        setHasMore(Boolean(result.data.nextCursor));
        console.log("fetching messages");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [isAiThinking]);

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
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  if (!loading && !hasMore && combinedMessages.length === 0) {
    return (
      <Empty label="You are all set... Start asking your first question" />
    );
  }

  console.log(combinedMessages);

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-round scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages &&
        combinedMessages.length > 0 &&
        combinedMessages.map((message, index) => {
          if (combinedMessages.length - 1 === index) {
            return <MessageBox key={index} message={message} />;
          } else {
            return <MessageBox key={index} message={message} />;
          }
        })}

      {loading && (
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
          <h3 className="font-semibold text-xl">No more messages to load</h3>
        </div>
      )}
    </div>
  );
};

export default Messages;
