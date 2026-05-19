import { z } from "zod";

export const openAiImageModelSchema = z.enum([
  "gpt-image-1",
  "gpt-image-1-mini",
  "dall-e-3",
  "dall-e-2",
]);

export type OpenAiImageModel = z.infer<typeof openAiImageModelSchema>;

export const OPENAI_IMAGE_MODEL_DEFAULT: OpenAiImageModel = "gpt-image-1";

export const OPENAI_IMAGE_MODEL_LABEL: Record<OpenAiImageModel, string> = {
  "gpt-image-1": "GPT Image 1",
  "gpt-image-1-mini": "GPT Image 1 Mini",
  "dall-e-3": "DALL·E 3",
  "dall-e-2": "DALL·E 2",
};

export const OPENAI_IMAGE_MODEL_STORAGE_KEY =
  "slide-builder-openai-image-model";

export function readStoredOpenAiImageModel(): OpenAiImageModel {
  if (typeof window === "undefined") {
    return OPENAI_IMAGE_MODEL_DEFAULT;
  }
  const raw = window.sessionStorage.getItem(OPENAI_IMAGE_MODEL_STORAGE_KEY);
  const parsed = openAiImageModelSchema.safeParse(raw);
  return parsed.success ? parsed.data : OPENAI_IMAGE_MODEL_DEFAULT;
}

export function persistOpenAiImageModel(model: OpenAiImageModel): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(OPENAI_IMAGE_MODEL_STORAGE_KEY, model);
}
