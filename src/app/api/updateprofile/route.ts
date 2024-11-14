import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { db } from "@/db";

export const PATCH = async (request: NextRequest) => {
  const { name, username } = await request.json();

  console.log(name, username);

  const session = await getServerSession(AuthOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = session.user.id;

  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      name: name,
      username: username,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Profile updated successfully",
      data: {
        updatedUser,
      },
    },
    {
      status: 200,
    }
  );
};
