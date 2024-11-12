import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import z from "zod";
import { Message } from "ai";
import {
  getMessageSchema,
  messageRequestSchema,
} from "@/lib/validators/message-validators";

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(AuthOptions);

  const { searchParams } = new URL(request.url);
  const chatType = searchParams.get("chatType");

  if (!chatType) {
    return NextResponse.json(
      {
        success: false,
        message: "chatType is required",
      },
      {
        status: 400,
      }
    );
  }

  const { error, data } = getMessageSchema.safeParse({ chatType });

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authorized",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session.user.id;

  try {
    const chatSession = await getChatSession(data, userId);

    if (!chatSession) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Couldn't load chat session, Please reload the page and try again!",
        },
        {
          status: 500,
        }
      );
    }

    const messages = await db.message.findMany({
      where: {
        chatSessionId: chatSession.id,
      },
    });

    const responseMessages: Message[] = [];

    messages.forEach((message) => {
      if (message.role === "USER") {
        responseMessages.push({
          id: message.id,
          role: "user",
          content: message.content,
        });
      } else {
        responseMessages.push({
          id: message.id,
          role: "assistant",
          content: message.content,
        });
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: responseMessages,
      },
      {
        status: 200,
      }
    );
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

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authorized",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session.user.id;
  const requestData = await request.json();

  const { data, error } = messageRequestSchema.safeParse(requestData);

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

  const { message, chatType, role } = data;

  try {
    const chatSession = await getChatSession({ chatType }, userId);

    if (!chatSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to fetch chat session, Try again after some time.",
        },
        {
          status: 500,
        }
      );
    }

    await db.message.create({
      data: {
        chatSessionId: chatSession.id,
        content: message,
        role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message stored successfully",
      },
      {
        status: 200,
      }
    );
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

async function getChatSession(
  { chatType }: z.infer<typeof getMessageSchema>,
  userId: string
) {
  console.log(chatType);

  try {
    let chatSession = await db.chatSession.findFirst({
      where: {
        AND: {
          userId,
          type: chatType,
        },
      },
    });

    console.log(chatSession);

    if (!chatSession) {
      chatSession = await db.chatSession.create({
        data: {
          userId,
          type: chatType,
        },
      });
    }

    return chatSession;
  } catch (error) {
    console.log(error);
    throw new Error("Unable to fetch/create chatSession");
  }
}
