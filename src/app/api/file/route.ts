import { db } from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: "userId is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const files = await db.file.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: files,
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
        message: "Error fetching files",
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const fileId = searchParams.get("fileId");

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
        message: "Not Authorized",
      },
      {
        status: 401,
      }
    );
  }

  const file = await db.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file || file.userId !== session.user.id) {
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

  try {
    await db.file.delete({
      where: {
        id: fileId,
      },
    });

    revalidatePath("/home/pdf");
    return NextResponse.json(
      {
        success: true,
        message: "File deleted successfully",
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
        message: "Error deleting file",
      },
      {
        status: 500,
      }
    );
  }
};
