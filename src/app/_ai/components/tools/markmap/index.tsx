import { Card } from '@nextui-org/react';
import OpenAI from 'openai';
import getMarkmapGenMsgList from 'prompt/plugin/markmap';
import { env } from '~/env.mjs';
import MarkmapDisplay from './display';

export interface MarkmapCardProps {
  markdownContent: string;
}

export function MarkmapCard({ markdownContent }: MarkmapCardProps) {
  return (
    <Card className="w-full h-[20rem] flex items-center justify-center bg-default-50 border border-default-300 shadow-primary/40">
      <MarkmapDisplay markdownContent={markdownContent} />
    </Card>
  );
}

export async function generateMindmap(input: {
  prompt: string, agentBackground: string | null, context: string | null, openAiApiKey: string | null
}) {

  const openai = new OpenAI({
    apiKey: input.openAiApiKey || env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: getMarkmapGenMsgList(input),
  });

  return {
    markdownContent: response.choices[0]?.message.content || "",
  };
}