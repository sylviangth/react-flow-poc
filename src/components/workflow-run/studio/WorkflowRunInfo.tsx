import { Chip } from "@nextui-org/react";
import { UserIcon, WorkflowIcon } from "lucide-react";
import { useWorkflowRunContext } from "~/app/_providers/WorkflowRunContextProvider";
import WorkflowRunTriggerInputRecapItem from "../trigger-input/WorkflowRunTriggerInputRecap";

export default function WorkflowRunInfo() {

  const { workflowRunData } = useWorkflowRunContext();

  return (
    <section className='flex flex-col md:flex-row gap-6 items-start px-2'>
      <div className='flex-none w-8 h-8 flex items-center justify-center text-primary-600 bg-background rounded-full'>
        <UserIcon size={16} />
      </div>
      <ul className="w-full text-default-800 flex flex-col gap-2">
        {workflowRunData.WorkflowRunTriggerInput.map((item, idx) => (
          <li key={idx} className="w-full">
            <WorkflowRunTriggerInputRecapItem data={item} />
          </li>
        ))}
        <li className="mt-2 text-sm flex flex-row items-center gap-2">
          <p className="text-default-500">Triggered</p>
          <Chip
            onClick={() => {
              window.open(window.location.href.split('?')[0] || '/', "_blank");
            }}
            variant="flat" color="primary" className="pl-2 cursor-pointer"
            startContent={<WorkflowIcon size={16} className="flex-none" />}
          >
            {workflowRunData.Workflow.title}
          </Chip>
        </li>
      </ul>
    </section>
  )
}