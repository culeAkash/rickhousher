import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { db } from "@/db";

const f = createUploadthing();
export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // TODO : Authorize the user
      const session = await getServerSession(AuthOptions);

      if (!session || !session?.user || !session?.user.id) {
        throw new UploadThingError("Not Authorized");
      }

      console.log("Upload thing", session);

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Creating file");

      try {
        await db.file.create({
          data: {
            key: file.key,
            fileName: file.name,
            userId: metadata.userId,
            fileUrl: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
            fileUploadStatus: "PROCESSING",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
