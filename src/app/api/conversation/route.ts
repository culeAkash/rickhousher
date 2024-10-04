import { Mistral } from "@mistralai/mistralai";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";

const apiKey = process.env.MISTRAL_API_KEY;

console.log(apiKey);

const client = new Mistral({
  apiKey: apiKey,
});

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

    //get response from AI

    const chatResponse = await client.chat.stream({
      model: "mistral-small-latest",
      messages,
    });

    let newMessage: string = "";

    for await (const chunk of chatResponse) {
      const streamText = chunk.data.choices[0].delta.content;
      if (streamText) newMessage += streamText;
      console.log(streamText);
    }
    return Response.json(
      {
        success: true,
        data: newMessage,
      },
      {
        status: 200,
      }
    );
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
