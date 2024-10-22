import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { db } from "@/db";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { pinecone } from "@/lib/pinecone";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { PineconeStore } from "@langchain/pinecone";

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

      const createdChatSession = await db.chatSession.create({
        data: {
          userId: metadata.userId,
          type: "PDF",
        },
      });

      const createdFile = await db.file.create({
        data: {
          key: file.key,
          fileName: file.name,
          userId: metadata.userId,
          fileUrl: `https://utfs.io/f/${file.key}`,
          fileUploadStatus: "PROCESSING",
          chatSessionId: createdChatSession.id,
        },
      });

      try {
        const response = await fetch(`https://utfs.io/f/${file.key}`);
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();
        const pageAmt = pageLevelDocs.length;

        // vectorize and index entire document

        const pineconeIndex = pinecone.Index("rickhousher");

        const embeddings = new MistralAIEmbeddings({
          apiKey: process.env.MISTRAL_API_KEY!,
          model: "mistral-large-latest",
        });

        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: {
            fileUploadStatus: "SUCCESS",
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        console.log(error);
        await db.file.update({
          data: {
            fileUploadStatus: "FAILED",
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
