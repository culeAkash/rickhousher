"use client";
import ChatWrapper from "@/components/pdf/chat-wrapper";
import PdfRenderer from "@/components/pdf/pdf-renderer";
import React from "react";

interface PageProps {
  params: {
    fileKey: string;
  };
}

const FilePage = ({ params }: PageProps) => {
  const { fileKey } = params;

  return (
    <>
      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
          {/* Left side */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PdfRenderer />
            </div>
          </div>
          <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            <ChatWrapper />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilePage;
