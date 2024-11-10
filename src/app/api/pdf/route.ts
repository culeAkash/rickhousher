import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { pdfMessageSchema } from "@/lib/validators/message-validators";
import { db } from "@/db";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { convertToCoreMessages, streamText } from "ai";
import { createMistral } from "@ai-sdk/mistral";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.MISTRAL_API_KEY;
const mistral = createMistral({
  apiKey,
});

export const POST = async (request: NextRequest) => {
  // endpoint for asking a question to a pdf file

  const body = await request.json();

  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      {
        success: false,
        message: "You must be logged in to ask a question",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session.user.id;
  console.log(body);

  const { data, error } = pdfMessageSchema.safeParse(body);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.errors[0].message,
      },
      {
        status: 400,
      }
    );
  }

  const { fileId, messages } = data;

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) {
    return NextResponse.json(
      {
        success: false,
        message: "File not found",
      },
      {
        status: 404,
      }
    );
  }

  const freeTrial = await checkApiLimit();
  const isPro = await checkSubscription();

  console.log(freeTrial);

  if (!freeTrial && !isPro) {
    return Response.json(
      {
        success: false,
        message:
          "Your free trial has ended, please switch to pro plan to continue using...",
      },
      {
        status: 403,
      }
    );
  }
  if (!isPro) await increaseApiLimit();

  try {
    await db.message.create({
      data: {
        content: messages[messages.length - 1].content,
        chatSessionId: file.chatSessionId,
        role: "USER",
      },
    });

    //1. vectorize the user message
    const embeddings = new MistralAIEmbeddings({
      apiKey: process.env.MISTRAL_API_KEY!,
      model: "mistral-embed",
    });

    const pineconeIndex = pinecone.Index("rickhousher");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(
      messages[messages.length - 1].content,
      4
    );
    // const context = results.map((r) => r.pageContent).join("\n\n");
    // console.log(context);

    const prevMessages = await db.message.findMany({
      where: {
        chatSessionId: file.chatSessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 10,
    });

    const formattedMessages = prevMessages.map((message) => ({
      role:
        message.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: message.content,
    }));

    const model = mistral("mistral-large-latest");
    const chatResult = await streamText({
      model,
      messages: convertToCoreMessages([
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format but don't include ```markdown at the start neither end the response with ```.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${messages[messages.length - 1].content}`,
        },
      ]),
    });

    let aiResponse = "";
    for await (const textPart of chatResult.textStream) {
      aiResponse += textPart;
    }

    await db.message.create({
      data: {
        content: aiResponse,
        chatSessionId: file.chatSessionId,
        role: "ASSISTANT",
      },
    });

    const streamData = chatResult.toDataStreamResponse();

    return streamData;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
