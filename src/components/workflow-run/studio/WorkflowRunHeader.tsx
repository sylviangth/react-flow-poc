import { Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@nextui-org/react";
import saveAs from "file-saver";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useWorkflowRunContext } from "~/app/_providers/WorkflowRunContextProvider";
import MpBadge from "~/components/branding/MpBadge";
import { api } from "~/utils/api";

export default function WorkflowRunHeader() {

  const pathname = usePathname();

  const { workflowRunId, workflowRunData } = useWorkflowRunContext();

  // EXPORT
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const exportPdf = api.workflowRun.exportPdf.useMutation({
    onMutate: () => {
      setIsExporting(true);
    },
    onSuccess: (data) => {
      if (workflowRunData) {
        if (data) {
          saveAs(data, `${workflowRunData.title}.pdf`);
        } else {
          toast.error("Couldn't export to PDF. Please try again.");
        }
      }
    },
    onError: (error) => {
      toast.error((error as { message: string }).message);
    },
    onSettled: () => {
      setIsExporting(false);
    }
  })
  const exportDocx = api.workflowRun.exportDocx.useMutation({
    onMutate: () => {
      setIsExporting(true);
    },
    onSuccess: (data) => {
      if (workflowRunData) {
        if (data) {
          saveAs(data, `${workflowRunData.title}.docx`);
        } else {
          toast.error("Couldn't export to DOCX. Please try again.");
        }
      }
    },
    onError: (error) => {
      toast.error((error as { message: string }).message);
    },
    onSettled: () => {
      setIsExporting(false);
    }
  })
  const exportOptions = [
    {
      display: "Export to PDF",
      onClick: () => {
        if (!workflowRunId) { return; }
        exportPdf.mutate({ workflowRunId: workflowRunId });
      },
    },
    {
      display: "Export to DOCX",
      onClick: () => {
        if (!workflowRunId) { return; }
        exportDocx.mutate({ workflowRunId: workflowRunId });
      },
    },
  ];

  return (
    <section className="w-full px-6 py-4 flex flex-row items-center justify-between gap-2 md:gap-4 shadow-lg shadow-background/40 bg-default-50">
      <div className="w-full flex flex-col items-start gap-1">
        <h1 className="text-xl font-bold text-center md:text-left text-default-700">
          {workflowRunData?.title}
        </h1>
        {!workflowRunData?.Workflow?.isMpBrandingOff && (
          <MpBadge />
        )}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          as={Link} isExternal href={pathname}
          size="sm" variant="light" color="primary"
          startContent={<RefreshCwIcon size={16} />}
        >
          Try again
        </Button>
        <ButtonGroup>
          <Dropdown showArrow offset={10}>
            <DropdownTrigger>
              <Button
                isLoading={isExporting} spinnerPlacement="end"
                size="sm" variant="light" color="primary"
                startContent={<DownloadIcon size={16} />}
              >
                Export
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Export Options">
              {exportOptions.map((option, idx) => (
                <DropdownItem
                  key={idx}
                  onClick={option.onClick}
                >
                  {option.display}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </ButtonGroup>
      </div>
    </section>
  )
}