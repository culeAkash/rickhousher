import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { pdfMessageSchema } from "@/lib/validators/message-validators";
import { db } from "@/db";

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

  const { fileId, message } = data;

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

  await db.message.create({
    data: {
      content: message,
      chatSessionId: file.chatSessionId,
      role: "USER",
    },
  });

  //
};
