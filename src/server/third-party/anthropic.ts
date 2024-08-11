"use server"

import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export const validateAnthropicApiKey = async (anthropicApiKey: string) => {

  const anthropic = createAnthropic({
    apiKey: anthropicApiKey,
  })

  try {
    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
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