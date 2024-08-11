import { Card } from "@nextui-org/react";
import OpenAI from "openai";
import getFlashcardGenMsgList from "prompt/plugin/flashcard";
import { env } from "~/env.mjs";
import FlashcardsDisplay from "./display";

export interface FlashcardProps {
  frontContent: string,
  backContent: string,
}

export interface FlashcardListCardProps {
  flashcardList: FlashcardProps[],
}

export function FlashcardListCard({ flashcardList }: FlashcardListCardProps) {
  return (
    <Card className="p-4 w-full flex flex-col gap-0 items-center justify-center bg-default-50 border border-default-300 shadow-primary/40">
      <FlashcardsDisplay flashcardList={flashcardList} />
    </Card>
  );
}

export async function generateFlashcardList(input: {
  prompt: string, count: number,
  agentBackground: string | null,
  context: string | null,
  openAiApiKey: string | null,
}) {

  const openai = new OpenAI({
    apiKey: input.openAiApiKey || env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: getFlashcardGenMsgList(input),
    response_format: { "type": "json_object" }
  });

  return {
    flashcardList: (JSON.parse(response.choices[0]?.message.content || `{"result":[]}`) as { result: FlashcardProps[] }).result,
  };
}