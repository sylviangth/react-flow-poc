import { Button, Card, CardBody, CardFooter, CardHeader, Switch } from "@nextui-org/react";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWorkflowContext } from "~/app/_providers/WorkflowContextProvider";
import { WorkflowRunTriggerInputProps } from "~/types/workflow";
import { api } from "~/utils/api";
import WorkflowRunTriggerInputList from "../workflow-run/trigger-input/WorkflowRunTriggerInputList";
import { toast } from "react-toastify";
import MpBadge from "../branding/MpBadge";
import { MODEL_LIST } from "lib/model";
import { CredentialType } from "@prisma/client";
import CredentialInputList, { CredentialInput } from "./CredentialInputList";
import { validateOpenAiApiKey } from "~/server/third-party/openai";
import { validateAnthropicApiKey } from "~/server/third-party/anthropic";
import { validateGoogleGenAiApiKey } from "~/server/third-party/google-genai";
import { validateGroqApiKey } from "~/server/third-party/groq";
import { validateAwsApiKey } from "~/server/third-party/aws";

export default function WorkflowForm() {

  const router = useRouter();
  const { workflowId, workflowData, aiCreditCount, aiCreditLimit } = useWorkflowContext();

  const [credentialList, setCredentialList] = useState<CredentialInput[]>([]);
  useEffect(() => {
    const requiredCredentialList = Array.from(new Set(workflowData.WorkflowNode.map(item => item.Agent.model).map(item => MODEL_LIST.find(m => m.enum === item)?.relatedCredentialList || [CredentialType.OPENAI_API_KEY]).flat()));
    setCredentialList(requiredCredentialList.map(item => ({ type: item, value: "" })));
  }, [])

  const [triggerInputList, setTriggerInputList] = useState<WorkflowRunTriggerInputProps[]>(workflowData.WorkflowTriggerInput.map(item => ({
    workflowTriggerInputData: item,
    value: "",
  })));
  const [isSuperviseModeEnabled, setIsSuperviseModeEnabled] = useState<boolean>(false);

  const [status, setStatus] = useState<number>(0);
  // 0: Not started, 1: Loading, 2: Success, 3: Failed
  const createWorkflowRun = api.workflowRun.create.useMutation({
    onMutate: () => {
      setStatus(1);
    },
    onSuccess: (data) => {
      setStatus(2);
      // SEND WORKFLOW_RUN_ID TO THE PARENT WINDOW OF AGENTCREW
      const messageToSend = { workflowRunId: data.id };
      typeof window !== "undefined" && window.parent.postMessage(messageToSend, "*");
      router.push(`?wrid=${data.id}`);
      router.refresh();
    },
    onError: () => {
      setStatus(3);
    }
  });
  const handleCreateWorkflowRun = async () => {
    if (triggerInputList.filter(item => item.workflowTriggerInputData.isRequired === true && !item.value.trim()).length > 0) { return; }
    if (workflowData.isLlmApiKeyInputRequiredBeforeRun && credentialList.filter(item => !item.value.trim()).length > 0) { return; }
    if (aiCreditLimit !== null && aiCreditCount >= aiCreditLimit) {
      toast.info("This account is running out of AI credits. Please upgrade this account to continue.");
      return;
    }

    // VALIDATE CREDENTIAL LIST
    if (workflowData.isLlmApiKeyInputRequiredBeforeRun) {
      const validations = credentialList.map(async (credential) => {
        if (credential.type === CredentialType.OPENAI_API_KEY) {
          const isValid = await validateOpenAiApiKey(credential.value);
          if (!isValid) {
            toast.warning("Invalid OpenAI API Key");
            return false;
          }
        } else if (credential.type === CredentialType.ANTHROPIC_API_KEY) {
          const isValid = await validateAnthropicApiKey(credential.value);
          if (!isValid) {
            toast.warning("Invalid Anthropic API Key");
            return false;
          }
        } else if (credential.type === CredentialType.GOOGLE_GENAI_API_KEY) {
          const isValid = await validateGoogleGenAiApiKey(credential.value);
          if (!isValid) {
            toast.warning("Invalid Google GenAI API Key");
            return false;
          }
        } else if (credential.type === CredentialType.GROQ_API_KEY) {
          const isValid = await validateGroqApiKey(credential.value);
          if (!isValid) {
            toast.warning("Invalid Groq API Key");
            return false;
          }
        } else if (credential.type === CredentialType.AWS_ACCESS_KEY_ID) {
          const awsSecretAccessKey = credentialList.find(item => item.type === CredentialType.AWS_SECRET_ACCESS_KEY)?.value;
          if (!awsSecretAccessKey) {
            toast.warning("AWS Secret Access Key is required");
            return false;
          }
          const isValid = await validateAwsApiKey({ awsAccessKeyId: credential.value, awsSecretAccessKey });
          if (!isValid) {
            toast.warning("Invalid AWS Access Key ID");
            return false;
          }
        } else if (credential.type === CredentialType.AWS_SECRET_ACCESS_KEY) {
          const awsAccessKeyId = credentialList.find(item => item.type === CredentialType.AWS_ACCESS_KEY_ID)?.value;
          if (!awsAccessKeyId) {
            toast.warning("AWS Access Key ID is required");
            return false;
          }
          const isValid = await validateAwsApiKey({ awsAccessKeyId, awsSecretAccessKey: credential.value });
          if (!isValid) {
            toast.warning("Invalid AWS Secret Access Key");
            return false;
          }
        }
        return true;
      });

      const validationResults = await Promise.all(validations);

      if (validationResults.some(result => !result)) {
        return;
      }
    }

    createWorkflowRun.mutate({
      workflowIdOrSlug: workflowId,
      triggerInputList: triggerInputList.filter(item => !!item.value).map((item) => ({ workflowTriggerInputId: item.workflowTriggerInputData.id, value: item.value })),
      credentialList,
      isSuperviseModeEnabled,
    })
  }

  return (
    <Card className="max-w-screen-md w-full flex flex-col items-center gap-3 p-4 bg-default-50 shadow-default-900">
      <CardHeader className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-center text-default-700">{workflowData.title}</h1>
        {!workflowData.isMpBrandingOff && (
          <MpBadge />
        )}
        {workflowData.desc && (
          <p className="mx-16 text-sm text-default-500 text-center">{workflowData.desc}</p>
        )}
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <WorkflowRunTriggerInputList
          workflowTitle={workflowData.title}
          triggerInputList={triggerInputList}
          setTriggerInputList={setTriggerInputList}
        />
        {workflowData.isLlmApiKeyInputRequiredBeforeRun === true && credentialList.length > 0 && (
          <CredentialInputList credentialList={credentialList} setCredentialList={setCredentialList} />
        )}
      </CardBody>
      <CardFooter className="flex flex-col gap-4 items-center overflow-visible">
        <Switch
          isSelected={isSuperviseModeEnabled}
          onValueChange={setIsSuperviseModeEnabled}
          size="sm" className="text-sm flex-none"
        >
          Ask for human approval before each step
        </Switch>
        <Button
          onClick={() => void handleCreateWorkflowRun()}
          isLoading={status === 1} spinnerPlacement="start"
          isDisabled={(aiCreditLimit !== null && aiCreditCount >= aiCreditLimit) || triggerInputList.filter(item => item.workflowTriggerInputData.isRequired === true && !item.value.trim()).length > 0 || (workflowData.isLlmApiKeyInputRequiredBeforeRun && credentialList.filter(item => !item.value.trim()).length > 0)}
          variant="shadow" color="primary" fullWidth endContent={<ArrowRightIcon size={16} />}
        >
          Submit
        </Button>
        {(aiCreditLimit !== null && aiCreditCount >= aiCreditLimit) && (
          <p className='text-sm text-danger text-center'>
            Uh-oh! It looks like this account has used up all its AI credits. To keep the workflow going, please upgrade the account.
          </p>
        )}
      </CardFooter>
    </Card>
  )
}