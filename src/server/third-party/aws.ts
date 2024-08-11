"use server"

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateText, LanguageModel } from "ai";
import { env } from "~/env.mjs";

export const validateAwsApiKey = async (input: { awsAccessKeyId: string, awsSecretAccessKey: string }) => {

  const awsBedrock = createAmazonBedrock({
    accessKeyId: input.awsAccessKeyId,
    secretAccessKey: input.awsSecretAccessKey,
    region: env.AWS_REGION,
  })

  try {
    const { text } = await generateText({
      model: awsBedrock("meta.llama2-70b-chat-v1") as LanguageModel,
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