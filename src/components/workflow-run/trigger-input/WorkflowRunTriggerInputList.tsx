import { Input, Textarea } from "@nextui-org/react";
import { WorkflowTriggerInputType } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { type WorkflowRunTriggerInputProps } from "~/types/workflow";
import WorkflowTriggerInputFileInput from "./WorkflowTriggerInputFileInput";
import WorkflowTriggerInputUrlInput from "./WorkflowTriggerInputUrlInput";
import WorkflowTriggerInputImageListInput from "./WorkflowTriggerInputImageListInput";

interface WorkflowRunTriggerInputListProps {
  workflowTitle: string;
  triggerInputList: WorkflowRunTriggerInputProps[];
  setTriggerInputList: Dispatch<SetStateAction<WorkflowRunTriggerInputProps[]>>;
}

export default function WorkflowRunTriggerInputList({
  workflowTitle, triggerInputList, setTriggerInputList,
}: WorkflowRunTriggerInputListProps) {

  if (triggerInputList.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-3">
        <p className="text-sm text-default-500">No input required to start running this workflow</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {triggerInputList.map((f, idx) => {
        switch (f.workflowTriggerInputData.type) {
          case WorkflowTriggerInputType.FILE:
            return (
              <WorkflowTriggerInputFileInput
                key={idx}
                label={f.workflowTriggerInputData.name}
                query={workflowTitle}
                value={triggerInputList[idx]?.value || ""}
                onValueChange={(value: string) => {
                  setTriggerInputList(prev => [
                    ...prev.slice(0, idx),
                    { workflowTriggerInputData: prev[idx]!.workflowTriggerInputData, value: value },
                    ...prev.slice(idx + 1)
                  ]);
                }}
                isRequired={f.workflowTriggerInputData.isRequired}
              />
            )
          case WorkflowTriggerInputType.URL:
            return (
              <WorkflowTriggerInputUrlInput
                key={idx}
                label={f.workflowTriggerInputData.name}
                query={workflowTitle}
                value={triggerInputList[idx]?.value || ""}
                onValueChange={(value: string) => {
                  setTriggerInputList(prev => [
                    ...prev.slice(0, idx),
                    { workflowTriggerInputData: prev[idx]!.workflowTriggerInputData, value: value },
                    ...prev.slice(idx + 1)
                  ]);
                }}
                isRequired={f.workflowTriggerInputData.isRequired}
              />
            )
          case WorkflowTriggerInputType.IMAGES:
            return (
              <WorkflowTriggerInputImageListInput
                key={idx}
                label={f.workflowTriggerInputData.name}
                value={triggerInputList[idx]?.value || ""}
                onValueChange={(value: string) => {
                  setTriggerInputList(prev => [
                    ...prev.slice(0, idx),
                    { workflowTriggerInputData: prev[idx]!.workflowTriggerInputData, value: value },
                    ...prev.slice(idx + 1)
                  ]);
                }}
                isRequired={f.workflowTriggerInputData.isRequired}
              />
            )
          default:
            return (
              <Textarea
                key={idx} label={f.workflowTriggerInputData.name + (!f.workflowTriggerInputData.isRequired ? " (optional)" : "")} placeholder="Type here..."
                value={triggerInputList[idx]?.value || ""}
                onChange={(e) => {
                  setTriggerInputList(prev => [
                    ...prev.slice(0, idx),
                    { workflowTriggerInputData: prev[idx]!.workflowTriggerInputData, value: e.target.value },
                    ...prev.slice(idx + 1)
                  ]);
                }}
                isRequired={f.workflowTriggerInputData.isRequired}
                rows={1} minRows={1} labelPlacement="outside" classNames={{ input: "text-default-700" }}
              />
            )
        }
      })}
    </div>
  )
}