import { createMistral } from "@ai-sdk/mistral";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import { convertToCoreMessages, streamText } from "ai";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
const apiKey = process.env.MISTRAL_API_KEY;

console.log(apiKey);

const mistral = createMistral({
  apiKey,
});

export const maxDuration = 5000;

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(AuthOptions);
    const { messages } = await request.json();

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          message: "Missing API Key",
        },
        {
          status: 500,
        }
      );
    }

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authorized",
        },
        {
          status: 401,
        }
      );
    }

    if (!messages) {
      return Response.json(
        {
          success: false,
          message: "Missing prompt",
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

    //get response from AI

    const model = mistral("mistral-large-latest");

    const result = await streamText({
      model,
      system:
        "You are a code generator. You must only answer only in markdown code snippets. Use code comments for explanations",
      messages: convertToCoreMessages(messages),
    });

    await increaseApiLimit();

    const data = result.toDataStreamResponse();

    return data;
  } catch (error) {
    console.log(error);
    return Response.json(
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
