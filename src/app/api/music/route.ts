import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

export async function POST(request: NextRequest) {
  const session = await getServerSession(AuthOptions);

  if (!session || !session?.user) {
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

  if (!process.env.HUGGING_FACE_ACCESS_TOKEN) {
    return NextResponse.json(
      {
        success: false,
        message: "Hugging Face Access Token is required",
      },
      {
        status: 500,
      }
    );
  }

  const { prompt } = await request.json();

  if (!prompt || prompt.length <= 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Prompt is required",
      },
      {
        status: 400,
      }
    );
  }

  const freeTrial = checkApiLimit();

  if (!freeTrial) {
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

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await increaseApiLimit();

    const result = await response.blob();
    const arrayBuffer = await result.arrayBuffer();
    const data = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json(
      {
        success: true,
        data,
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
        message: error,
      },
      {
        status: 500,
      }
    );
  }
}
