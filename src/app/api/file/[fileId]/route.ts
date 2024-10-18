import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { fileId: string } }
) => {
  const { fileId } = params;

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

  try {
    const file = await db.file.findUnique({
      where: {
        id: Array.isArray(fileId) ? fileId[0] : fileId,
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
