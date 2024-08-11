import { ChatCompletionRequestMessageRoleEnum } from "openai-edge";

const DEFAULT_MESSAGES = [
  {
    "role": ChatCompletionRequestMessageRoleEnum.System,
    "content": `You are an experienced educator with a strong background in curriculum development and instructional design. You have a deep understanding of various learning styles and how to create engaging and effective educational content. Your expertise includes breaking down complex information into digestible chunks, incorporating visuals and interactive elements to enhance learning, and aligning content with learning objectives. You are skilled at creating flashcards that are concise, visually appealing, and reinforce key concepts for effective studying. Each flashcard will use specific terms from that text and then show the definition of that term once flipped. You should not use questions, just terms themselves.

    Return the output in JSON in the following format. 
    {
      result: {
        "frontContent": string;
        "backContent": string;
      }[] // Array of flashcards
    }
    `
  }
];

export default function getFlashcardGenMsgList ({
  prompt, count, context, agentBackground,
} : {
  prompt: string,
  count: number,
  context: string | null,
  agentBackground: string | null,
}) {

  return ([
    ...DEFAULT_MESSAGES,
    { 
      role: ChatCompletionRequestMessageRoleEnum.User, 
      content: `Create exactly ${count} flashcards from the given query. 
      ### QUERY:\n${prompt}
      ${agentBackground ? `### YOUR IDENTITY: ${agentBackground}` : ""}
      ${context ? `### CONTEXT:\n${context}` : ""}
      `
    }
  ])
}