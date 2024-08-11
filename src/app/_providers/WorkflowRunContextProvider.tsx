"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import { Style, type Agent, type Workflow, type WorkflowNode, type WorkflowRun, type WorkflowRunResultItem, type WorkflowRunTriggerInput, type WorkflowTriggerInput } from "@prisma/client";

export interface ExtendedAgent extends Agent {
  StyleOnAgent: { Style: Style }[];
}

interface ExtendedWorkflowNode extends WorkflowNode {
  Agent: ExtendedAgent;
}

export interface ExtendedWorkflowRunResultItem extends WorkflowRunResultItem {
  WorkflowNode: ExtendedWorkflowNode;
}

export interface ExtendedWorkflowRunTriggerInput extends WorkflowRunTriggerInput {
  WorkflowTriggerInput: WorkflowTriggerInput;
}

export interface ExtendedWorkflowRun extends WorkflowRun {
  Workflow: Workflow;
  WorkflowRunTriggerInput: ExtendedWorkflowRunTriggerInput[];
  WorkflowRunResultItem: ExtendedWorkflowRunResultItem[];
}

interface WorkflowRunContextProps {
  workflowRunId: string;
  workflowRunData: ExtendedWorkflowRun;
}

const WorkflowRunContext = createContext<WorkflowRunContextProps | undefined>(undefined);

export const useWorkflowRunContext = () => {
  const context = useContext(WorkflowRunContext);
  if (!context) {
    throw new Error('useWorkflowRunContext must be used within a WorkflowRunContextProvider');
  }
  return context;
};

interface WorkflowRunContextProviderProps {
  workflowRunData: ExtendedWorkflowRun;
  children: ReactNode;
}

export const WorkflowRunContextProvider = ({
  workflowRunData,
  children
}: WorkflowRunContextProviderProps) => {

  const contextValue = useMemo(() => {
    return {
      workflowRunId: workflowRunData.id,
      workflowRunData,
    };
  }, [
    workflowRunData,
  ]);

  return (
    <WorkflowRunContext.Provider value={contextValue}>
      {children}
    </WorkflowRunContext.Provider>
  );
};
