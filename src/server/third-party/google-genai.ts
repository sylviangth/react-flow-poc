"use server"

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, LanguageModel } from "ai";

export const validateGoogleGenAiApiKey = async (googleGenAiApiKey: string) => {

  const google = createGoogleGenerativeAI({
    apiKey: googleGenAiApiKey,
  })

  try {
    const { text } = await generateText({
      model: google("models/gemini-1.5-flash-latest") as LanguageModel,
      prompt: 'Hello?',
    });
    if (!text) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};