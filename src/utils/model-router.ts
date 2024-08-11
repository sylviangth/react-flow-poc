import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { LLMModel } from "@prisma/client"
import { env } from "~/env.mjs"
import { MODEL_LIST, ModelProvider } from "lib/model";

export const selectedLlmModel = (input: {
  model: LLMModel,
  openAiApiKey: string | null,
  anthropicApiKey: string | null,
  googleGenAiApiKey: string | null,
  groqApiKey: string | null,
  awsAccessKeyId: string | null,
  awsSecretAccessKey: string | null,
}) => {

  const openai = createOpenAI({
    apiKey: input.openAiApiKey || env.OPENAI_API_KEY,
  })
  const anthropic = createAnthropic({
    apiKey: input.anthropicApiKey || env.ANTHROPIC_API_KEY,
  })
  const google = createGoogleGenerativeAI({
    apiKey: input.googleGenAiApiKey || '',
  })
  const groq = createOpenAI({
    apiKey: input.groqApiKey || '',
    baseURL: 'https://api.groq.com/openai/v1',
  })
  const awsBedrock = createAmazonBedrock({
    accessKeyId: input.awsAccessKeyId || env.AWS_ACCESS_KEY_ID,
    secretAccessKey: input.awsSecretAccessKey || env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
  })
  const selectedModelItem = MODEL_LIST.find(m => m.enum === input.model) || MODEL_LIST.find(m => m.enum === LLMModel.GPT_4O_MINI)!;
  switch (selectedModelItem.provider) {
    case ModelProvider.OPENAI: {
      return ({
        model: openai(selectedModelItem.value),
        isToolStreamingAvailable: true,
      })
    }
    case ModelProvider.ANTHROPIC: {
      return ({
        model: anthropic(selectedModelItem.value),
        isToolStreamingAvailable: true,
      })
    }
    case ModelProvider.GOOGLE: {
      return ({
        model: google(selectedModelItem.value),
        isToolStreamingAvailable: true,
      })
    }
    case ModelProvider.GROQ: {
      return ({
        model: groq(selectedModelItem.value),
        isToolStreamingAvailable: false,
      })
    }
    case ModelProvider.AWS_BEDROCK: {
      return ({
        model: awsBedrock(selectedModelItem.value),
        isToolStreamingAvailable: false,
      })
    }
    default: {
      return ({
        model: openai("gpt-3.5-turbo"),
        isToolStreamingAvailable: true,
      })
    }
  }
}