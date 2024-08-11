"use server";

import { CredentialType, LLMModel, MessageRole } from "@prisma/client";
import { MODEL_LIST } from "lib/model";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { ContextResponse, getContextWithNote } from "~/server/main/get-context";

export const getAgentData = (agentId: string) => {
  return prisma.agent.findUnique({
    where: {
      id: agentId,
    },
    include: {
      StyleOnAgent: {
        select: {
          Style: true,
        }
      }
    }
  })
}

export const getApiKeysFromWorkflowId = async (input: { workflowId: string }) => {
  const workflowData = await prisma.workflow.findUnique({
    where: {
      id: input.workflowId
    },
    select: {
      teamId: true,
      userId: true,
      openAiApiKey: true,
      openRouterApiKey: true,
      serpApiKey: true,
    }
  });
  if (!workflowData) {
    throw new Error("Workflow not found");
  }
  const credentialList = await prisma.credential.findMany({
    where: {
      teamId: workflowData.teamId,
      userId: workflowData.teamId ? undefined : workflowData.userId,
    },
  });
  return ({
    openAiApiKey: credentialList.find(c => c.type === CredentialType.OPENAI_API_KEY)?.value || workflowData.openAiApiKey || null,
    anthropicApiKey: credentialList.find(c => c.type === CredentialType.ANTHROPIC_API_KEY)?.value || null,
    googleGenAiApiKey: credentialList.find(c => c.type === CredentialType.GOOGLE_GENAI_API_KEY)?.value || null,
    groqApiKey: credentialList.find(c => c.type === CredentialType.GROQ_API_KEY)?.value || null,
    awsAccessKeyId: credentialList.find(c => c.type === CredentialType.AWS_ACCESS_KEY_ID)?.value || null,
    awsSecretAccessKey: credentialList.find(c => c.type === CredentialType.AWS_SECRET_ACCESS_KEY)?.value || null,
  })
}

export const getApiKeysFromWorkflowRunId = (input: { workflowRunId: string }) => {
  return prisma.workflowRunCredential.findMany({
    where: {
      workflowRunId: input.workflowRunId,
    },
    select: {
      type: true,
      value: true,
    }
  });
}

interface GetMiscContextProps {
  queryText: string;
  model: LLMModel;
  docIdList: string[];
  smartNoteIdList: string[];
  extSourceValueList: string[];
  workflowId: string;
}

export const getMiscContext = async (props: GetMiscContextProps) => {
  const apiKeys = await getApiKeysFromWorkflowId({ workflowId: props.workflowId });
  try {
    let finalContextResult: ContextResponse = {
      context: [],
      metadata: [],
    };
    if (props.docIdList.length > 0 || props.smartNoteIdList.length > 0 || props.extSourceValueList.length > 0) {
      const mainContextResult = await getContextWithNote({
        openAiApiKey: apiKeys.openAiApiKey || env.OPENAI_API_KEY,
        serpApiKey: undefined,
        queryText: props.queryText,
        chunkLimit: Math.min(Math.round(Object.values(MODEL_LIST).flat().find(m => m.enum === props.model)!.contextLength / 1000), 40),
        docIdList: props.docIdList,
        smartNoteIdList: props.smartNoteIdList,
        google: props.extSourceValueList.includes("GOOGLE"),
        duckduckgo: props.extSourceValueList.includes("DUCKDUCKGO"),
        wikipedia: props.extSourceValueList.includes("WIKIPEDIA"),
        youtube: props.extSourceValueList.includes("YOUTUBE"),
        pexelsImage: props.extSourceValueList.includes("PEXELS_IMAGE"),
        pexelsVideo: props.extSourceValueList.includes("PEXELS_VIDEO"),
        arxiv: props.extSourceValueList.includes("ARXIV"),
        yahooFinance: props.extSourceValueList.includes("YAHOO_FINANCE"),
        semanticScholar: props.extSourceValueList.includes("SEMANTIC_SCHOLAR"),
      });
      finalContextResult = {
        context: [
          ...finalContextResult.context,
          ...mainContextResult.context,
        ],
        metadata: [
          ...finalContextResult.metadata,
          ...mainContextResult.metadata,
        ],
      }
    }
    return finalContextResult;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to get context. Please try again.");
  }
}

export const getWorkflowRunData = async (input: { workflowRunId: string }) => {
  const workflowRunData = await prisma.workflowRun.findUnique({
    where: {
      id: input.workflowRunId,
    },
    include: {
      Workflow: true,
      WorkflowRunTriggerInput: {
        include: {
          WorkflowTriggerInput: true,
        },
        orderBy: {
          WorkflowTriggerInput: {
            index: "asc",
          }
        },
      },
      WorkflowRunResultItem: {
        include: {
          WorkflowNode: {
            include: {
              Agent: {
                include: {
                  StyleOnAgent: {
                    select: {
                      Style: true,
                    }
                  }
                }
              },
            }
          },
        },
        orderBy: {
          WorkflowNode: {
            index: "asc",
          }
        },
      }
    },
  });
  return workflowRunData;
}

export const updateWorkflowRunResultItems = async (input: { workflowRunMessages: { workflowRunResultItemId: string, role: "user" | "assistant" | "function" | "system", name?: string, content: string }[] }) => {
  const updatedWorkflowRunResultItems = await Promise.all(input.workflowRunMessages.filter(item => !["user", "system"].includes(item.role) && !!item.content).map(async item => {
    return await prisma.workflowRunResultItem.update({
      where: {
        id: item.workflowRunResultItemId,
      },
      data: {
        role: item.role.toUpperCase() as MessageRole,
        name: item.name,
        content: item.content,
      },
    });
  }));
  return updatedWorkflowRunResultItems;
}