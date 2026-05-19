import "server-only";

import type { OpenAiImageModel } from "~/lib/openai-image-model";
import { openai } from "~/lib/openai";
import { persistImageBuffer } from "~/server/uploadthing/persist-buffer";

function isGptImageModel(model: OpenAiImageModel): boolean {
  return model.startsWith("gpt-image");
}

function buildImagePrompt(prompt: string, imageStyle: string): string {
  const trimmedPrompt = prompt.trim();
  const trimmedStyle = imageStyle.trim();
  if (!trimmedStyle) return trimmedPrompt;
  return `${trimmedPrompt}\n\nVisual style: ${trimmedStyle}`;
}

async function generateImageBuffer(input: {
  model: OpenAiImageModel;
  prompt: string;
}): Promise<Buffer> {
  if (isGptImageModel(input.model)) {
    const response = await openai.images.generate({
      model: input.model,
      prompt: input.prompt,
      n: 1,
      size: "1536x1024",
      output_format: "png",
    });
    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("Model returned no image data.");
    }
    return Buffer.from(b64, "base64");
  }

  if (input.model === "dall-e-3") {
    const response = await openai.images.generate({
      model: input.model,
      prompt: input.prompt,
      n: 1,
      size: "1792x1024",
      response_format: "b64_json",
      quality: "standard",
    });
    const b64 = response.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error("Model returned no image data.");
    }
    return Buffer.from(b64, "base64");
  }

  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: input.prompt,
    n: 1,
    size: "1024x1024",
    response_format: "b64_json",
  });
  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("Model returned no image data.");
  }
  return Buffer.from(b64, "base64");
}

export async function generateAndPersistSlideImage(input: {
  slideId: string;
  model: OpenAiImageModel;
  prompt: string;
  imageStyle: string;
}): Promise<{ url: string; key?: string }> {
  const fullPrompt = buildImagePrompt(input.prompt, input.imageStyle);
  const buffer = await generateImageBuffer({
    model: input.model,
    prompt: fullPrompt,
  });

  return persistImageBuffer({
    buffer,
    filename: `slide-${input.slideId}-ai.png`,
    contentType: "image/png",
  });
}
