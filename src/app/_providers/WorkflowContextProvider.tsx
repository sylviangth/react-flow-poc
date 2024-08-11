"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { LLMModel, type Workflow, type WorkflowTriggerInput } from "@prisma/client";
import { api } from "~/utils/api";
import LoadingScreen from "~/components/utility/LoadingScreen";
import { useRouter } from "next/navigation";

export type BasicWorkflowProps = Omit<Workflow, 'createdAt' | 'updatedAt' | 'teamId' | 'userId' | 'openAiApiKey' | 'openRouterApiKey' | 'serpApiKey' | 'isPublic' | 'category' | 'slug' | 'lmsqueezyCheckoutUrl' | 'videoDemoUrl' | 'copywritingContent'>;

export interface ExtendedWorkflow extends BasicWorkflowProps {
  WorkflowTriggerInput: WorkflowTriggerInput[];
  WorkflowNode: { Agent: { model: LLMModel } }[];
}

interface WorkflowContextProps {
  workflowId: string;
  workflowData: ExtendedWorkflow;
  aiCreditCount: number;
  aiCreditLimit: number | null;
}

const WorkflowContext = createContext<WorkflowContextProps | undefined>(undefined);

export const useWorkflowContext = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within a WorkflowContextProvider');
  }
  return context;
};

interface WorkflowContextProviderProps {
  workflowId: string;
  workflowData: ExtendedWorkflow,
  children: ReactNode;
}

export const WorkflowContextProvider = ({
  workflowId,
  workflowData,
  children
}: WorkflowContextProviderProps) => {

  const router = useRouter();

  const { data: aiCreditCount, isLoading: isLoadingAiCreditCount } = api.usageControl.getAiCreditCountByWorkflowIdOrSlug.useQuery({
    workflowIdOrSlug: workflowId,
  });

  const { data: aiCreditLimit, isLoading: isLoadingAiCreditLimit } = api.usageControl.getAiCreditLimitByWorkflowIdOrSlug.useQuery({
    workflowIdOrSlug: workflowId,
  })

  const contextValue = useMemo(() => {
    return {
      workflowId, workflowData,
      aiCreditCount: aiCreditCount || 0,
      aiCreditLimit: aiCreditLimit || null,
    };
  }, [
    workflowId, workflowData,
    aiCreditCount, isLoadingAiCreditCount, aiCreditLimit, isLoadingAiCreditLimit,
  ]);

  return (
    <WorkflowContext.Provider value={contextValue}>
      {(isLoadingAiCreditCount || isLoadingAiCreditLimit) ? (
        <div className="w-screen h-screen">
          <LoadingScreen desc="Getting ready..." />
        </div>
      ) : (
        children
      )}
    </WorkflowContext.Provider>
  );
};
