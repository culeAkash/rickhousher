import React from "react";
import UploadButton from "./upload-button";
import Empty from "../empty";
import { File } from "@prisma/client";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import { format } from "date-fns";
import DeleteFileButton from "./delete-file-button";
import { db } from "@/db";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const PdfSection = async () => {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/auth/sign-in");
    return;
  }

  let files: File[] = [];

  try {
    files = await db.file.findMany({
      where: {
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.log(error);
    return (
      <Empty label="Couldn't fetch files at this moment. Please try again later!" />
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-lg text-zinc-700">My Files</h1>
        <UploadButton />
      </div>
      {files && files.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/home/pdf/${file.key}`}
                  className="flex flex-col gap-2"
                >
                  <div
                    className="
                  pt-6 px-6 flex w-full items-center justify-between space-x-6"
                  >
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 via-cyan-700 to-blue-900"></div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.fileName}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "MMM yyyy")}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>
                  <DeleteFileButton fileId={file.id} />
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <Empty label="No PDF files uploaded yet. Get started." />
      )}
    </>
  );
};

export default PdfSection;
