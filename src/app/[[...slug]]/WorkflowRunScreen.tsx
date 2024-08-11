"use client";

import { ExtendedWorkflowRun, WorkflowRunContextProvider } from "~/app/_providers/WorkflowRunContextProvider";
import WorkflowRunStudio from "~/components/workflow-run/studio/WorkflowRunStudio";

export default function WorkflowRunScreen(props: { workflowRunData: ExtendedWorkflowRun }) {

  return (
    <WorkflowRunContextProvider
      workflowRunData={props.workflowRunData}
    >
      <WorkflowRunStudio />
    </WorkflowRunContextProvider>
  );
}