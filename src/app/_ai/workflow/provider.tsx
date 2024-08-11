/* eslint-disable */

import { createAI, getMutableAIState, getAIState, streamUI, createStreamableValue, } from 'ai/rsc';
import { CoreMessage, LanguageModel, generateId } from 'ai';
import { z } from 'zod';
import { Agent, CredentialType, LLMModel, Style } from '@prisma/client';
import { ContextMetadataItemProps } from '~/types/context';
import { generateImageWithFal, FalImageResultCard } from '../components/tools/fal';
import { generateFlashcardList, FlashcardListCard } from '../components/tools/flashcards';
import { generateMindmap, MarkmapCard } from '../components/tools/markmap';
import { PPTXGenResultCard } from '../components/tools/pptx';
import { BotCard, BotMessage, SpinnerMessage } from './messages';
import { getAgentData, getApiKeysFromWorkflowId, getApiKeysFromWorkflowRunId, updateWorkflowRunResultItems } from './actions';
import { selectedLlmModel } from '~/utils/model-router';
import { getChatSystemMessage } from 'prompt/chat';
import { generatePPTX } from '~/server/main/tools/pptx';
import { ImageUploadProps } from '~/server/main/upload/image';
import { getImageUint8ArrayFromUrl } from '~/utils/workflow-helpers';

interface ExtendedAgent extends Agent {
  StyleOnAgent: { Style: Style }[];
}

async function updateAssistantMessage(
  workflowRunResultItemId: string,
  content: string,
) {
  'use server';

  const aiState = getMutableAIState<typeof AI>()

  const updatedMessages = aiState.get().messages.reduceRight((acc: WorkflowRunMessage[], message: WorkflowRunMessage) => {
    if (message.workflowRunResultItemId === workflowRunResultItemId) {
      return [{ ...message, content }, ...acc];
    } else {
      return [message, ...acc];
    }
  }, []);

  aiState.done({
    ...aiState.get(),
    messages: updatedMessages
  });

  return getUIStateFromAIState(aiState.get());
}

async function submitUserMessage(
  input: string,
  imgUrlList: string | null,
  agentId: string | null = null,
  additionalContext: string | null = null,
  stringifiedContextMetadata: string | null = null,
  workflowRunResultItemId: string,
  workflowRunId: string,
  workflowId: string,
) {
  'use server';

  const contextMetadata = stringifiedContextMetadata ? JSON.parse(stringifiedContextMetadata) as ContextMetadataItemProps[] : [];

  const finalImgUrlList = imgUrlList ? JSON.parse(imgUrlList) as ImageUploadProps[] : [];
  let passedImgUrlList = [];
  // Turn each image in finalImgUrlList into a Uint8Array with getImageUint8ArrayFromUrl
  for (let i = 0; i < finalImgUrlList.length; i++) {
    const img = finalImgUrlList[i];
    const imgUint8Array = await getImageUint8ArrayFromUrl(img!.url);
    if (imgUint8Array) {
      passedImgUrlList.push({ url: img!.url, s3_file_path: img!.s3_file_path, imgUint8Array });
    }
  }

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        workflowRunResultItemId,
        role: 'user',
        content: input,
        imgUrlList: finalImgUrlList.map((item) => item.s3_file_path ? item.s3_file_path : item.url).flat(),
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  let agentData: ExtendedAgent | null = null;
  let systemMessage = `You are a helpful assisstant.`;
  let tools: string[] = [];
  if (agentId) {
    const data = await getAgentData(agentId);
    if (data) {
      agentData = data;
      systemMessage = data.instruction;
      tools = data.tools;
    }
  } else {
    tools = [];
  }

  const authorApiKeys = await getApiKeysFromWorkflowId({ workflowId });
  const userApiKeys = await getApiKeysFromWorkflowRunId({ workflowRunId });

  const availableTools: { [key: string]: any } = {
    "generate_mindmap": {
      description: "Generate a mindmap based on a topic",
      parameters: z.object({
        topic: z.string().describe("The topic about which the mindmap will be generated")
      }).required(),
      generate: async function* ({ topic }: { topic: string }) {
        yield <SpinnerMessage message='Preparing your mindmap...' />;
        const result = await generateMindmap({
          prompt: topic,
          agentBackground: agentData ? agentData.instruction : null,
          context: additionalContext,
          openAiApiKey: userApiKeys.find(k => k.type === CredentialType.OPENAI_API_KEY)?.value || authorApiKeys.openAiApiKey,
        });
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: generateId(),
              workflowRunResultItemId,
              role: "function",
              name: "generate_mindmap",
              content: JSON.stringify(result),
              referenceList: contextMetadata.length > 0 ? JSON.stringify(contextMetadata) : undefined,
            }
          ]
        })
        return <BotCard><MarkmapCard {...result} /></BotCard>;
      },
    },
    "generate_flashcards": {
      description: "Generate flashcards based on a given topic.",
      parameters: z.object({
        topic: z.string().describe("The topic about which the flashcards will be generated"),
        count: z.number().describe("The total number of the flashcards to generate")
      }).required(),
      generate: async function* ({ topic, count }: { topic: string, count: number }) {
        yield <SpinnerMessage message='Preparing your flashcards...' />;
        const result = await generateFlashcardList({
          prompt: topic, count,
          agentBackground: agentData ? agentData.instruction : null,
          context: additionalContext,
          openAiApiKey: userApiKeys.find(k => k.type === CredentialType.OPENAI_API_KEY)?.value || authorApiKeys.openAiApiKey,
        });
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: generateId(),
              workflowRunResultItemId,
              role: "function",
              name: "generate_flashcards",
              content: JSON.stringify(result),
              referenceList: contextMetadata.length > 0 ? JSON.stringify(contextMetadata) : undefined,
            }
          ]
        })
        return <BotCard><FlashcardListCard {...result} /></BotCard>;
      },
    },
    "generate_image_with_fal": {
      description: "Generate an image based on the user's prompt",
      parameters: z.object({
        prompt: z.string().describe('The prompt for the image generation.'),
      }).required(),
      generate: async function* ({ prompt }: { prompt: string }) {
        yield <SpinnerMessage message='Preparing your image...' />;
        const result = await generateImageWithFal({ prompt, agentBackground: agentData ? agentData.instruction : null });
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: generateId(),
              workflowRunResultItemId,
              role: "function",
              name: "generate_image_with_fal",
              content: JSON.stringify(result),
              referenceList: contextMetadata.length > 0 ? JSON.stringify(contextMetadata) : undefined,
            }
          ]
        })
        return <BotCard><FalImageResultCard {...result} /></BotCard>;
      }
    },
    "generate_pptx": {
      description: "Generate a presentation (PowerPoint/PPTX/slides) based on the user's prompt",
      parameters: z.object({
        prompt: z.string().describe('The prompt for the presentation generation.'),
      }).required(),
      generate: async function* ({ prompt }: { prompt: string }) {
        yield <SpinnerMessage message='Preparing your presentation...' />;
        const result = await generatePPTX({
          prompt: prompt + (additionalContext ? `### CONTEXT: ${additionalContext}` : ''),
          presenterName: 'MindPal.io'
        });
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: generateId(),
              workflowRunResultItemId,
              role: "function",
              name: "generate_pptx",
              content: JSON.stringify(result),
              referenceList: contextMetadata.length > 0 ? JSON.stringify(contextMetadata) : undefined,
            }
          ]
        })
        return <BotCard><PPTXGenResultCard {...result} /></BotCard>;
      }
    }
  }

  const finalModel = selectedLlmModel({
    model: agentData ? agentData.model : LLMModel.GPT_4O_MINI,
    openAiApiKey: userApiKeys.find(k => k.type === CredentialType.OPENAI_API_KEY)?.value || authorApiKeys.openAiApiKey,
    anthropicApiKey: userApiKeys.find(k => k.type === CredentialType.ANTHROPIC_API_KEY)?.value || authorApiKeys.anthropicApiKey,
    googleGenAiApiKey: userApiKeys.find(k => k.type === CredentialType.GOOGLE_GENAI_API_KEY)?.value || authorApiKeys.googleGenAiApiKey,
    groqApiKey: userApiKeys.find(k => k.type === CredentialType.GROQ_API_KEY)?.value || authorApiKeys.groqApiKey,
    awsAccessKeyId: userApiKeys.find(k => k.type === CredentialType.AWS_ACCESS_KEY_ID)?.value || authorApiKeys.awsAccessKeyId,
    awsSecretAccessKey: userApiKeys.find(k => k.type === CredentialType.AWS_SECRET_ACCESS_KEY)?.value || authorApiKeys.awsSecretAccessKey,
  })

  let additionalSystemMessage = "";
  if (tools.length > 0 && finalModel.isToolStreamingAvailable === true) {
    additionalSystemMessage = tools.map(tool => {
      const availableTool = availableTools[tool];
      if (!availableTool) {
        return "";
      } else {
        return `- If the user requests to ${availableTool.description} ==> Call "${tool}".\n`
      }
    }).join("\n");
    additionalSystemMessage = "### RULES\n" + additionalSystemMessage;
  }

  try {
    const result = await streamUI({
      model: finalModel.model as LanguageModel,
      initial: <SpinnerMessage message='Working on it...' />,
      system: getChatSystemMessage({
        systemMessage, additionalSystemMessage,
        hasContext: contextMetadata.length > 0 ? true : false,
        ...agentData,
        styleList: agentData ? agentData.StyleOnAgent.map(item => item.Style) : [],
      }),
      messages:
        ([
          ...(aiState.get().messages as WorkflowRunMessage[]).filter((_, idx) => idx !== aiState.get().messages.length - 1).filter(m => m.workflowRunResultItemId === workflowRunResultItemId).map(item => ({ ...item, role: item.role === "function" ? "assistant" : item.role })),
          {
            role: "user",
            content:
              passedImgUrlList.length > 0
                ? [
                  { type: 'text', text: aiState.get().messages[aiState.get().messages.length - 1].content + (additionalContext ? `### CONTEXT: ${additionalContext}` : '') },
                  ...passedImgUrlList.map((item) => ({ type: 'image', image: item.imgUint8Array }))
                ]
                : aiState.get().messages[aiState.get().messages.length - 1].content + (additionalContext ? `### CONTEXT: ${additionalContext}` : ''),
          }
        ]) as CoreMessage[],
      text: ({ content, done, delta }) => {
        const lastAssistantMsgOfTheSameWorkflowRunResultItem = (aiState.get().messages as WorkflowRunMessage[]).slice().reverse().find(item => item.workflowRunResultItemId === workflowRunResultItemId && item.role === "assistant");
        const initialValue = input === "Continue"
          ? (lastAssistantMsgOfTheSameWorkflowRunResultItem ? lastAssistantMsgOfTheSameWorkflowRunResultItem.content + "\n" : "")
          : "";
        if (!textStream) {
          textStream = createStreamableValue(initialValue);
          textNode = <BotMessage content={textStream.value} msgReferenceList={contextMetadata} />
        }

        if (done) {
          textStream.done()
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: generateId(),
                workflowRunResultItemId,
                role: 'assistant',
                content: initialValue + content,
                referenceList: contextMetadata.length > 0 ? JSON.stringify(contextMetadata) : undefined,
              }
            ]
          })
        } else {
          textStream.update(delta)
        }

        return textNode
      },
      // @ts-ignore
      tools: finalModel.isToolStreamingAvailable === true && Object.entries(availableTools).filter(([key]) => tools.includes(key)).length > 0 ? Object.fromEntries(Object.entries(availableTools).filter(([key]) => tools.includes(key))) : undefined,
    })
    return {
      id: generateId(),
      workflowRunResultItemId,
      display: result.value,
    }
  } catch (error) {
    console.error(error);
    return {
      id: generateId(),
      display: <BotMessage content={`An error occurred while processing your request${error && typeof error === "object" && "message" in error ? `: ${error.message}` : ""}. Please try again.`} msgReferenceList={[]} />,
    }
  }
}

export type WorkflowRunMessage = {
  id: string,
  workflowRunResultItemId: string,
  role: 'user' | 'assistant' | 'system' | 'function',
  content: string,
  name?: string,
  referenceList?: string,
  imgUrlList?: string[],
}

export type AIState = {
  workflowRunId: string,
  messages: WorkflowRunMessage[],
}

export type UIState = {
  id: string,
  workflowRunResultItemId: string,
  display: React.ReactNode,
}[]

export const AI: any = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    updateAssistantMessage,
  },
  onGetUIState: async () => {
    'use server'
    const aiState = getAIState();
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState as AIState);
      return uiState;
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'
    if (done) {
      const { messages } = state;
      await updateWorkflowRunResultItems({
        workflowRunMessages: messages.filter((m: WorkflowRunMessage, index: number, self: WorkflowRunMessage[]) =>
          !["user", "system"].includes(m.role) &&
          !!m.content &&
          index === self.reduce((lastIndex, currentMsg, currentIndex) =>
            currentMsg.workflowRunResultItemId === m.workflowRunResultItemId ? currentIndex : lastIndex, -1)
        ).map(message => ({
          workflowRunResultItemId: message.workflowRunResultItemId,
          role: message.role,
          name: message.name,
          content: message.content
        }))
      })
    } else {
      return;
    }
  },
})

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages
    .map(message => ({
      id: message.id,
      workflowRunResultItemId: message.workflowRunResultItemId,
      display:
        message.role.toLowerCase() === 'function' ? (
          message.name === 'generate_mindmap' ? (
            <BotCard><MarkmapCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_flashcards' ? (
            <BotCard><FlashcardListCard {...JSON.parse(message.content)} /></BotCard>
            // ) : message.name === 'generate_quiz_list' ? (
            //   <BotCard><QuizListCard {...JSON.parse(message.content)} /></BotCard>
            // ) : message.name === 'upload_cv' ? (
            //   <BotCard><CVUploaderCard /></BotCard>
            // ) : message.name === 'clarify_user_query' ? (
            //   <BotCard><ClarificationSetCard {...JSON.parse(message.content)} /></BotCard>
            // ) : message.name === 'provide_writing_task' ? (
            //   <BotCard><WritingTaskCard {...JSON.parse(message.content)} /></BotCard>
            // ) : message.name === 'provide_speaking_task' ? (
            //   <BotCard><SpeakingTaskCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_image_with_fal' ? (
            <BotCard><FalImageResultCard {...JSON.parse(message.content)} /></BotCard>
          ) : message.name === 'generate_pptx' ? (
            <BotCard><PPTXGenResultCard {...JSON.parse(message.content)} /></BotCard>
          ) : (
            <BotMessage content={"Unrecognized component!"} msgReferenceList={message.referenceList ? JSON.parse(message.referenceList) as ContextMetadataItemProps[] : []} />
          )
          // ) : message.role.toLowerCase() === 'user' ? (
          //   <UserMessage>{message.content}</UserMessage>
        ) : message.role.toLowerCase() === 'assistant' ? (
          <BotMessage content={message.content} msgReferenceList={[]} />
        ) : (
          undefined
        )
    }))
}