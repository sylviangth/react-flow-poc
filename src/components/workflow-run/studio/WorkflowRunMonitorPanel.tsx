import { Button } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";
import { type ReactNode } from "react";

interface WorkflowRunMonitorPanelProps {
  message: ReactNode;
  onApprove: () => void;
}

export default function WorkflowRunMonitorPanel({
  message, onApprove,
}: WorkflowRunMonitorPanelProps) {

  return (
    <section
      className="sticky bottom-0 flex flex-col gap-3"
    >
      <div className="w-full h-full flex items-center gap-3 p-2.5 rounded-2xl shadow-lg shadow-primary/20 border-2 border-primary bg-default-50">
        <section className="w-full flex flex-col items-center justify-center gap-2">
          <div className='pt-2 md:pt-0 w-full flex flex-col md:flex-row items-center gap-3'>
            <div className="w-full flex flex-row items-center justify-between gap-3">
              <p>{message}</p>
              <Button
                onClick={onApprove}
                size="sm" variant='shadow' color="primary"
                endContent={<CheckIcon size={16} className="flex-none" />}
              >
                Approve
              </Button>
            </div>
          </div>
        </section>
      </div>

    </section>
  )
}