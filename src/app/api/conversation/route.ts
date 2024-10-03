import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";

export const POST = async (request: Request) => {
  const apiKey = process.env.MISTRAL_API_KEY;

  const client = new Mistral({
    apiKey,
  });

  const { prompt } = await request.json();

  console.log(prompt);

  const chatResponse = await client.chat.stream({
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: "Talk like rick sanchez from Rick and Morty" },
      { role: "user", content: prompt },
    ],
  });

  for await (const chunk of chatResponse) {
    const streamText = chunk.data.choices[0].delta.content;
    console.log(streamText);
  }

  return Response.json({
    success: true,
  });
};
