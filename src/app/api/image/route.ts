import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf_inference = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  const image = await hf_inference.textToImage({
    model: "black-forest-labs/FLUX.1-dev",
    inputs: prompt,
    parameters: {
      height: 160,
      width: 160,
      //   negative_prompt: "cartoonish",
    },
  });

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  //   const imageData = imageBuffer.toString("base64");

  console.log(image);

  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
