import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import ChatWrapper from "@/components/pdf/chat-wrapper";
import PdfRenderer from "@/components/pdf/pdf-renderer";
import { File } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileId: string;
  };
}

const FilePage = async ({ params }: PageProps) => {
  const { fileId } = params;

  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/auth/sign-in");
  }

  // make db call

  let file: File;
  try {
    const response = await axios.get(
      `${process.env.NEXTAUTH_URL}/api/file/${fileId}`
    );
    file = response.data.data;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError;

    if (axiosError.status === 404) {
      notFound();
    }
  }

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
