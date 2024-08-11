"use server"

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export const validateGroqApiKey = async (groqApiKey: string) => {

  const groq = createOpenAI({
    apiKey: groqApiKey || '',
    baseURL: 'https://api.groq.com/openai/v1',
  })

  try {
    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
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