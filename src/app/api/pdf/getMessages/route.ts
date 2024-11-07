import { pdfFetchMessagesSchema } from "@/lib/validators/message-validators";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { db } from "@/db";

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  console.log("Fetching messages");

  const { data, error } = pdfFetchMessagesSchema.safeParse(body);

  console.log(data);

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

  const { fileId, cursor, limit } = data;

  if (!fileId) {
    return NextResponse.json(
      {
        success: false,
        message: "fileId is required",
      },
      {
        status: 400,
      }
    );
  }

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
  const fetchLimit = limit ?? INFINITE_QUERY_LIMIT;

  try {
    const file = await db.file.findUnique({
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

    const chatSessionId = file.chatSessionId;

    const messages = await db.message.findMany({
      where: {
        chatSessionId,
      },
      take: fetchLimit + 1,
      orderBy: {
        createdAt: "asc",
      },
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;

    if (messages.length > fetchLimit) {
      const nextMessage = messages.pop();
      nextCursor = nextMessage?.id;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          messages,
          nextCursor,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

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
