"use client";
import React, { useEffect, useState } from "react";
import ChatInput from "./chat-input";
import { getFileUploadStatus } from "@/actions";
import { UploadStatus } from "@prisma/client";
import Loader from "@/components/loader";
import { ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChatContextProvider } from "@/context/chat-context-provider";
import Messages from "./messages";

interface chatwrapperProps {
  fileId: string;
  userId: string;
}

const ChatWrapper = ({ fileId, userId }: chatwrapperProps) => {
  const [fileUploadStatus, setFileUploadStatus] = useState<UploadStatus | null>(
    null
  );

  useEffect(() => {
    let fileUploadStatus;
    const uploadStatusInterval = setInterval(async () => {
      fileUploadStatus = await getFileUploadStatus({ fileId, userId });
      setFileUploadStatus(fileUploadStatus);
      if (fileUploadStatus === "SUCCESS" || fileUploadStatus === "FAILED") {
        clearInterval(uploadStatusInterval);
      }
    }, 500);
  }, [fileId, userId]);

  if (!fileUploadStatus) {
    return (
      <div className="space-y-4 mt-4 px-2">
        <ChatInput isDisabled />
        <Loader label="Loading... We're preparing your pdf" />
      </div>
    );
  }

  if (fileUploadStatus === "PROCESSING") {
    return (
      <div className="space-y-4 mt-4 px-2">
        <ChatInput isDisabled />
        <Loader label="Processing PDF... This won't take long" />
      </div>
    );
  }

  if (fileUploadStatus === "FAILED") {
    return (
      <div className="space-y-4 mt-4 px-2 ">
        <ChatInput isDisabled />
        <div className="h-full w-full flex flex-col gap-y-2 items-center justify-center py-10">
          <XCircle className="h-6 w-6 text-red-500" />
          <h3 className="font-semibold text-xl">Too many pages in PDF</h3>
          <p className="text-sm text-zinc-500">
            Your <span className="font-medium">Free</span> plan supports upto 10
            pages per PDF
          </p>
          <Link
            href={"/home/pdf"}
            className={buttonVariants({
              variant: "destructive",
            })}
          >
            <ChevronLeft className="h-3 w-3 mr-1.5" />
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="space-y-4 mt-4 px-2">
        <ChatInput isDisabled={false} />
      </div>
      <Messages />
    </ChatContextProvider>
  );
};

export default ChatWrapper;
