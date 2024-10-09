import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/utils/db";

import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // check if user with same name or email already exists
    const existingUserByUsernameOrEmail = await db.user.findFirst({
      where: {
        OR: [{ username: { equals: username } }, { email: { equals: email } }],
      },
    });

    if (existingUserByUsernameOrEmail) {
      const response: ApiResponse = {
        success: false,
        message: "User already exists",
      };
      return NextResponse.json(response, {
        status: 400,
      });
    }

    // hash password using bcrypt

    const hashedPassword = await bcrypt.hash(password, 8);

    // create new user
    await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isSubscribed: false,
      },
    });

    const response: ApiResponse = {
      success: true,
      message: "User created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log("Error creating user", error);

    const response: ApiResponse = {
      success: false,
      message: "Error creating user",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
