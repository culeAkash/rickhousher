import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { checkApiLimit } from "@/lib/api-limit";

interface imageOptions {
  prompt: string;
  resolution: string;
}

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

  const { prompt, resolution }: imageOptions = await request.json();

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

  if (!resolution || resolution.length <= 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Resolution is required",
      },
      {
        status: 400,
      }
    );
  }

  const height = Number.parseInt(resolution.split("x")[0]);
  const width = Number.parseInt(resolution.split("x")[1]);
  console.log(height);
  console.log(width);

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
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            height,
            width,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

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
