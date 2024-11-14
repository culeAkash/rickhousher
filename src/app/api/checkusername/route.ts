import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      {
        success: false,
        message: "username is required",
      },
      {
        status: 400,
      }
    );
  }

  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "User fetched successfully",
      data: {
        isPresent: user ? true : false,
      },
    },
    {
      status: 200,
    }
  );
};
