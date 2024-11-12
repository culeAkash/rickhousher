import { db } from "@/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../../auth/[...nextauth]/options";

export const GET = async (
  request: NextRequest,
  { params }: { params: { fileKey: string } }
) => {
  const { fileKey } = params;

  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session?.user.id) {
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

  if (!fileKey) {
    return NextResponse.json(
      {
        success: false,
        message: "file key is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const file = await db.file.findFirst({
      where: {
        key: fileKey,
        userId: session.user.id,
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

    return NextResponse.json(
      {
        success: true,
        data: file,
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
