/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import LoadingScreen from "~/components/utility/LoadingScreen";
import { LLMModel, MessageRole, WorkflowTriggerInputType } from "@prisma/client";
import { ButtonGroup, Button, Textarea, PopoverTrigger, Popover, PopoverContent, } from "@nextui-org/react";
import { EditIcon, CopyIcon, CheckIcon, XIcon, RefreshCcwIcon, StepForwardIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ExtendedWorkflowRunTriggerInput, type ExtendedWorkflowRunResultItem, useWorkflowRunContext, ExtendedAgent } from "~/app/_providers/WorkflowRunContextProvider";
import { ContextMetadataItemProps } from '~/types/context';
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { UIState, WorkflowRunMessage } from "~/app/_ai/workflow/provider";
import { extractIdsFromText, updatePromptWithActualValuesOfVariables } from "~/utils/workflow-helpers";
import { hasUrls } from "~/utils/helpers";
import { getMiscContext } from "~/app/_ai/workflow/actions";
import ReferenceItem from "~/components/display/ReferenceItem";
import { ImageUploadProps } from "~/server/main/upload/image";

interface CompletionItemProps {
  workflowRunTriggerInputList: ExtendedWorkflowRunTriggerInput[];
  workflowResultItemData: ExtendedWorkflowRunResultItem;
}

export default function CompletionItem({
  workflowRunTriggerInputList, workflowResultItemData,
}: CompletionItemProps) {

  const router = useRouter();

  const { workflowRunData } = useWorkflowRunContext();

  const { submitUserMessage, updateAssistantMessage } = useActions();
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const updateResultItemContent = api.workflowRun.updateResultItemContent.useMutation({
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: async (data) => {
      const newUiState = await updateAssistantMessage(data.id, data.content);
      setMessages(newUiState);
      router.refresh();
      setIsTextEditable(false);
    },
    onError: (error) => {
      toast.error((error as { message: string }).message);
    },
    onSettled: () => {
      setIsSaving(false);
    }
  })

  useEffect(() => {
    if (!aiState.messages || !workflowRunData) { return; }
    const doneWorkflowRunMessages = aiState.messages.filter((m: WorkflowRunMessage, index: number, self: WorkflowRunMessage[]) =>
      !["user", "system"].includes(m.role) &&
      !!m.content &&
      index === self.reduce((lastIndex, currentMsg, currentIndex) =>
        currentMsg.workflowRunResultItemId === m.workflowRunResultItemId ? currentIndex : lastIndex, -1)
    );
    currentResultInstance.current = doneWorkflowRunMessages.find((m: WorkflowRunMessage) => m.workflowRunResultItemId === workflowResultItemData.id)?.content || '';
    const savedWorkflowRunResultItems = workflowRunData.WorkflowRunResultItem.filter(item => !!item.content);
    if (doneWorkflowRunMessages.length > savedWorkflowRunResultItems.length) {
      router.refresh();
    }
  }, [aiState.messages, workflowRunData])

  const [activeAgent, setActiveAgent] = useState<ExtendedAgent | null>(null);
  const [input, setInput] = useState<string>("");
  useEffect(() => {
    if (workflowRunData) {
      // AGENT
      setActiveAgent(workflowResultItemData.WorkflowNode.Agent);
      // INPUT
      const prompt = updatePromptWithActualValuesOfVariables(
        workflowResultItemData.WorkflowNode.prompt,
        workflowRunTriggerInputList.map(item => ({ workflowTriggerInputId: item.workflowTriggerInputId, inputValue: item.value })),
        workflowRunData.WorkflowRunResultItem.map(item => ({ inputNodeId: item.workflowNodeId, inputContent: item.content || '' })),
      )
      setInput(prompt);
    }
  }, [])

  const isGettingContext = useRef<boolean>(false);
  const isGenerating = useRef<boolean>(false);
  const isContinuing = useRef<boolean>(false);

  const currentResultInstance = useRef<string>(workflowResultItemData.content || '');
  const regenBtnRef = useRef<HTMLButtonElement | null>(null);
  const [regenPrompt, setRegenPrompt] = useState<string>('');

  useEffect(() => {
    if (workflowRunData && !workflowRunData.isRunInBackgroundEnabled && !workflowResultItemData.content && activeAgent) {
      if (!isGettingContext.current && !isGenerating.current && !(messages as UIState).slice().reverse().find(m => m.workflowRunResultItemId === workflowResultItemData.id)) {
        isGenerating.current = true;
        handleSubmit(input);
      }
    }
  }, [workflowResultItemData.content, activeAgent, isGettingContext.current, isGenerating.current, messages])

  const handleSubmit = async (value: string) => {
    if (!workflowRunData) { return; }
    const intSourceDocIdList = activeAgent?.defaultIntSourceDocIdList ? JSON.parse(activeAgent.defaultIntSourceDocIdList) as string[] : [];
    const smartNoteIdList = activeAgent?.defaultSmartNoteIdList ? JSON.parse(activeAgent.defaultSmartNoteIdList) as string[] : [];
    const extSourceEnumList = activeAgent?.defaultExtSourceEnumList ? JSON.parse(activeAgent.defaultExtSourceEnumList) as string[] : [];
    let additionalContext: string | null = null;
    let contextMetadata: ContextMetadataItemProps[] = [];
    if (intSourceDocIdList.length > 0 || smartNoteIdList.length > 0 || extSourceEnumList.length > 0 || hasUrls(input)) {
      isGettingContext.current = true;
      try {
        const contextResponse = await getMiscContext({
          queryText: value,
          model: activeAgent?.model || LLMModel.GPT_4O_MINI,
          docIdList: intSourceDocIdList,
          smartNoteIdList,
          extSourceValueList: extSourceEnumList,
          workflowId: workflowRunData.workflowId,
        })
        contextMetadata = contextResponse.metadata.reduce((acc: ContextMetadataItemProps[], curr) => {
          if ("document_id" in curr) {
            const currentHref = `/knowledge-source/${curr.document_id}`;
            const existingRecord = acc.find(record => record.href === currentHref);
            if (existingRecord) {
              const index = acc.indexOf(existingRecord);
              acc = [
                ...acc.slice(0, index),
                {
                  title: existingRecord.title,
                  href: existingRecord.href,
                  chunkIdList: [...(existingRecord.chunkIdList ? existingRecord.chunkIdList : []), curr.chunk_id],
                },
                ...acc.slice(index + 1)
              ];
            } else {
              acc.push({
                title: curr.title || "Unknown",
                href: `/knowledge-source/${curr.document_id}`,
                chunkIdList: [curr.chunk_id],
              });
            }
          } else if ("note_id" in curr) {
            acc.push({
              title: curr.title || "Unknown",
              href: `/note/${curr.note_id}`,
            });
          } else {
            acc.push({
              title: curr.title,
              href: curr.url,
            });
          }
          return acc;
        }, []);
        additionalContext =
          "Context:\n"
          + JSON.stringify(contextResponse.context.map(piece => `
          <<<
          citationIndex: ${contextMetadata.findIndex(item => item.href === piece.metadata.url) + 1}
          citationUrl: "${piece.metadata.url}"
          title: "${piece.metadata.title}"
  
          ${piece.page_content}
          >>>
        `).join('\n'))
        isGettingContext.current = false;
      } catch (error) {
        isGettingContext.current = false;
        console.error(error);
        toast.warning((error as { message: string }).message || 'An error occurred while MindPal was researching! Please try again.');
      }
    }
    isGenerating.current = true;
    // Check if there are any images in the input
    let passedImgUrlList: ImageUploadProps[] = [];
    const extractedWorkflowRunTriggerInputIdList = extractIdsFromText(workflowResultItemData.WorkflowNode.prompt).triggerInputIdList;
    const imageTypedWorkflowRunTriggerInputList = workflowRunTriggerInputList.filter(item => extractedWorkflowRunTriggerInputIdList.includes(item.workflowTriggerInputId) && item.WorkflowTriggerInput.type === WorkflowTriggerInputType.IMAGES);
    if (imageTypedWorkflowRunTriggerInputList.length > 0) {
      passedImgUrlList = imageTypedWorkflowRunTriggerInputList.map(item => JSON.parse(item.value) as ImageUploadProps[]).flat();
    }
    // Submit and get response message
    const responseMessage = await submitUserMessage(
      value,
      (passedImgUrlList.length > 0 ? JSON.stringify(passedImgUrlList) : null),
      activeAgent?.id || null,
      additionalContext,
      (contextMetadata.length > 0 ? JSON.stringify(contextMetadata) : null),
      workflowResultItemData.id,
      workflowRunData.id,
      workflowRunData.workflowId,
    )
    isGenerating.current = false;
    isContinuing.current = false;
    setMessages((currentMessages: UIState) => [...currentMessages, responseMessage]);
  }

  const [isTextEditable, setIsTextEditable] = useState<boolean>(false);
  const [value, setValue] = useState<string>(workflowResultItemData.content ? workflowResultItemData.content : "");
  useEffect(() => {
    if (!value && workflowResultItemData.content) {
      setValue(workflowResultItemData.content);
    }
  }, [value, workflowResultItemData.content])

  const handleRegenerate = () => {
    if (!workflowRunData) { return; }
    handleSubmit(!!regenPrompt.trim() ? regenPrompt : "Retry");
  }

  const handleContinue = () => {
    if (!workflowRunData) { return; }
    if (!currentResultInstance.current) { return; }
    isContinuing.current = true;
    handleSubmit("Continue");
  }

  const handleUpdateSection = () => {
    if (!workflowRunData) { return; }
    updateResultItemContent.mutate({
      workflowRunResultItemId: workflowResultItemData.id,
      workflowId: workflowRunData.Workflow.id,
      workflowRunId: workflowRunData.id,
      content: value,
      referenceList: workflowResultItemData.referenceList as { title: string, href: string }[],
    });
  }

  const { isSuccessful, copyToClipboard } = useCopyToClipboard();

  return (
    <section className="w-full flex flex-col gap-6">
      {workflowResultItemData.content && !isTextEditable ? (
        <div className="w-full">
          <ButtonGroup>
            {workflowRunData && workflowResultItemData.role === MessageRole.ASSISTANT && !!currentResultInstance.current && !workflowRunData.isRunInBackgroundEnabled && (
              <Button
                onClick={handleContinue}
                isLoading={isContinuing.current === true} spinnerPlacement="end"
                size="sm" variant="light" color="primary"
                startContent={<StepForwardIcon size={16} />}
              >
                Continue
              </Button>
            )}
            {workflowRunData && !workflowRunData.isRunInBackgroundEnabled && (
              <Popover placement="bottom" showArrow offset={10}>
                <PopoverTrigger>
                  <Button
                    ref={regenBtnRef}
                    isLoading={isGenerating.current === true && isContinuing.current === false}
                    size="sm" variant="light" color="primary" className="z-0"
                    startContent={<RefreshCcwIcon size={16} />}
                  >
                    Regenerate
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[24rem]">
                  <div className="px-1 py-2 w-full flex flex-col gap-2">
                    <Textarea
                      label="Any requirements?" placeholder="Type here..."
                      value={regenPrompt || ""} onValueChange={setRegenPrompt}
                    />
                    <Button
                      onClick={() => {
                        handleRegenerate();
                        regenBtnRef.current?.click();
                      }}
                      isLoading={isGenerating.current === true} spinnerPlacement="end"
                      size="sm" variant="solid" color="primary" className="rounded-lg"
                      startContent={<RefreshCcwIcon size={16} />}
                    >
                      Regenerate {regenPrompt ? "with" : "without"} prompt
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {workflowResultItemData.role === MessageRole.ASSISTANT && (
              <Button
                onClick={() => setIsTextEditable(true)}
                size="sm" variant="light" color="primary" startContent={<EditIcon size={16} />}
              >
                Edit
              </Button>
            )}
            {workflowResultItemData.role === MessageRole.ASSISTANT && (
              <Button
                onClick={() => void copyToClipboard(workflowResultItemData.content || '')}
                size="sm" variant="light" color="primary" startContent={isSuccessful ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              >
                Copy
              </Button>
            )}
          </ButtonGroup>
        </div>
      ) : isTextEditable && (
        <div className="w-full">
          <ButtonGroup>
            <Button
              onClick={handleUpdateSection}
              isLoading={isSaving} spinnerPlacement="end"
              size="sm" variant="light" color="primary" startContent={<CheckIcon size={16} />}
            >
              Save
            </Button>
            <Button
              onClick={() => setIsTextEditable(false)}
              size="sm" variant="light" color="primary" startContent={<XIcon size={16} />}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </div>
      )}
      {(isGenerating.current || isGettingContext.current) && !workflowResultItemData.content && !(messages as UIState).slice().reverse().find(m => m.workflowRunResultItemId === workflowResultItemData.id) &&
        <LoadingScreen desc={`Working on ${workflowResultItemData.WorkflowNode.title}...`} />
      }
      {(workflowResultItemData.content || !!(messages as UIState).slice().reverse().find(m => m.workflowRunResultItemId === workflowResultItemData.id) || currentResultInstance.current) && !isTextEditable ? (
        !!(messages as UIState).slice().reverse().find(m => m.workflowRunResultItemId === workflowResultItemData.id) && (messages as UIState).slice().reverse().find(m => m.workflowRunResultItemId === workflowResultItemData.id)!.display
      ) : (workflowResultItemData.content || !!(messages as UIState).slice().reverse().find(m => m.workflowRunResultItemId === workflowResultItemData.id) || currentResultInstance.current) && isTextEditable && (
        <Textarea
          defaultValue={workflowResultItemData.content ? workflowResultItemData.content : currentResultInstance.current}
          value={value} onValueChange={setValue}
          variant="bordered" classNames={{ input: "text-default-700" }}
        />
      )}
      {workflowResultItemData.referenceList && (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(workflowResultItemData.referenceList as { title: string, href: string }[]).filter(item => !!item.href).map((reference, idx) => (
            <li key={idx}>
              <ReferenceItem
                index={idx + 1}
                title={reference.title}
                href={reference.href}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}