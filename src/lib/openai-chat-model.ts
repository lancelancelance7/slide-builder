import { z } from "zod";

export const openAiChatModelSchema = z.enum(["gpt-4o", "gpt-5.5"]);

export type OpenAiChatModel = z.infer<typeof openAiChatModelSchema>;

export const OPENAI_CHAT_MODEL_DEFAULT: OpenAiChatModel = "gpt-4o";

export const OPENAI_CHAT_MODEL_STORAGE_KEY = "slide-builder-openai-chat-model";

export function readStoredOpenAiChatModel(): OpenAiChatModel {
  if (typeof window === "undefined") {
    return OPENAI_CHAT_MODEL_DEFAULT;
  }
  const raw = window.sessionStorage.getItem(OPENAI_CHAT_MODEL_STORAGE_KEY);
  const parsed = openAiChatModelSchema.safeParse(raw);
  return parsed.success ? parsed.data : OPENAI_CHAT_MODEL_DEFAULT;
}

export function persistOpenAiChatModel(model: OpenAiChatModel): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(OPENAI_CHAT_MODEL_STORAGE_KEY, model);
}
