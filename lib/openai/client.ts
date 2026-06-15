import OpenAI from "openai";

let openai: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return openai;
}

export const openAITextModel = process.env.OPENAI_TEXT_MODEL || "gpt-5.5";
export const openAIImageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
