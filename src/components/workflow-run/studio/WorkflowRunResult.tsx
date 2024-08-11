import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import { BotIcon, CheckIcon, CircleDot } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useWorkflowRunContext } from "~/app/_providers/WorkflowRunContextProvider";
import { extractIdsFromText } from "~/utils/workflow-helpers";
import CompletionItem from "./CompletionItem";
import WorkflowRunMonitorPanel from "./WorkflowRunMonitorPanel";

export default function WorkflowRunResult() {

  const { workflowRunData } = useWorkflowRunContext();

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
  const [disabledKeys, setDisabledKeys] = useState<Set<string>>(new Set([]));

  const superviseAskMessage = useRef<ReactNode | null>(null);
  const superviseOnApprove = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (workflowRunData && !workflowRunData.isRunInBackgroundEnabled) {
      // IF SOME ITEMS ARE NOT YET COMPLETED
      if (!workflowRunData.WorkflowRunResultItem.every(item => item.content)) {
        let completedSectionIdList: string[] = [];
        completedSectionIdList =
          workflowRunData.WorkflowRunResultItem
            .filter(item => item.content)
            .map(section => section.id).flat();

        // Ready sections: Not completed sections but the input is ready.
        let readySectionIdList: string[] = [];
        readySectionIdList =
          workflowRunData.WorkflowRunResultItem
            .filter(item => !item.content)
            .filter(section =>
              extractIdsFromText(section.WorkflowNode.prompt).inputNodeIdList
                .every(inputNodeId => {
                  const inputNode = workflowRunData.WorkflowRunResultItem.find(item => item.workflowNodeId === inputNodeId);
                  if (!inputNode) {
                    return true;
                  } else {
                    if (inputNode.content) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                }))
            .map(section => section.id).flat();
        if (readySectionIdList.length > 0) {
          setDisabledKeys(new Set(
            workflowRunData.WorkflowRunResultItem
              .filter(item => !completedSectionIdList.includes(item.id))
              .map(section => section.id).flat())
          )
          handleAskForApprovalIfNeeded({
            completedSectionIdList,
            readySectionIdList,
          })
        } else {
          setSelectedKeys(new Set([
            ...completedSectionIdList
          ]));
          setDisabledKeys(new Set(
            workflowRunData.WorkflowRunResultItem
              .filter(item => !completedSectionIdList.includes(item.id) && (readySectionIdList.length === 0 || (item.id !== readySectionIdList[0])))
              .map(section => section.id).flat()
          ));
        }
        // IF ALL ITEMS ARE COMPLETED
      } else {
        setSelectedKeys(new Set([...workflowRunData.WorkflowRunResultItem.map(section => section.id).flat()]));
        setDisabledKeys(new Set([]));
      }
    }
  }, [workflowRunData?.WorkflowRunResultItem])

  const handleAskForApprovalIfNeeded = ({ completedSectionIdList, readySectionIdList }: { completedSectionIdList: string[], readySectionIdList: string[] }) => {
    if (!workflowRunData) { return; }
    if (workflowRunData.isSuperviseModeEnabled) {
      const nextReadySection = workflowRunData.WorkflowRunResultItem.find(item => item.id === readySectionIdList[0]!)!.WorkflowNode;
      superviseAskMessage.current = <p className="text-sm text-default-600">Step {nextReadySection.index} <span className="text-primary font-semibold">{nextReadySection.title}</span> is ready to run. Approve?</p>;
      superviseOnApprove.current = () => handleProceed({ completedSectionIdList, readySectionIdList });
    } else {
      handleProceed({ completedSectionIdList, readySectionIdList });
    }
  }
  const handleProceed = ({ completedSectionIdList, readySectionIdList }: { completedSectionIdList: string[], readySectionIdList: string[] }) => {
    if (!workflowRunData) { return; }
    setSelectedKeys(new Set([
      ...completedSectionIdList,
      readySectionIdList[0]!,
    ]));
    setDisabledKeys(new Set(
      workflowRunData.WorkflowRunResultItem
        .filter(item => !completedSectionIdList.includes(item.id) && (readySectionIdList.length === 0 || (item.id !== readySectionIdList[0])))
        .map(section => section.id).flat()
    ));
    superviseAskMessage.current = null;
    superviseOnApprove.current = null;
  }

  return (
    <section className="w-full h-full flex flex-col gap-1">

      <Accordion
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        disabledKeys={disabledKeys}
        fullWidth
        itemClasses={{
          base: "w-full mx-0 px-0 py-2",
          trigger: "flex items-start gap-6",
          title: "text-2xl font-medium data-[open=true]:text-primary",
          content: "ml-14 pb-8 pt-0 mt-0",
        }}
      >
        {workflowRunData.WorkflowRunResultItem.map((section, sectionIdx) => (
          <AccordionItem
            key={section.id} aria-label={`Accordion ${sectionIdx + 1}`}
            title={
              <div className="flex flex-col gap-1">
                <p className="text-sm text-default-500 font-normal">{section.WorkflowNode.Agent.title}</p>
                <div className="flex items-center gap-0">
                  <Chip
                    size="sm" variant="light" color={section && section.content ? "success" : "warning"} className="p-0"
                    startContent={section && section.content ? <CheckIcon size={16} /> : <CircleDot size={16} />}
                  ></Chip>
                  <h3 className="text-lg">{section.WorkflowNode.title}</h3>
                </div>
              </div>
            }
            startContent={
              <div className='flex-none w-8 h-8 flex items-center justify-center text-default-600 bg-default-100 rounded-full'>
                <BotIcon size={16} />
              </div>
            }
          >
            <div className="w-full flex flex-col gap-6">
              <CompletionItem
                workflowRunTriggerInputList={workflowRunData.WorkflowRunTriggerInput}
                workflowResultItemData={section}
              />
            </div>
          </AccordionItem>
        ))}
      </Accordion>

      {workflowRunData.isSuperviseModeEnabled && superviseAskMessage.current && superviseOnApprove.current && (
        <WorkflowRunMonitorPanel
          message={superviseAskMessage.current}
          onApprove={superviseOnApprove.current}
        />
      )}

    </section>
  )
}