import { Spinner } from "@nextui-org/react";
import { AlertTriangleIcon, AsteriskIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { getTriggerInputContext } from "~/server/main/get-trigger-input-context";

interface WorkflowTriggerInputFileInputProps {
  label: string;
  query: string;
  value: string;
  onValueChange: (value: string) => void;
  isRequired: boolean;
}

export default function WorkflowTriggerInputFileInput({
  label, query, onValueChange, isRequired,
}: WorkflowTriggerInputFileInputProps) {

  const [status, setStatus] = useState<number>(0);
  // 0: Not started, 1: Loading, 2: Success, 3: Failed

  const handleSubmitFileList = (fileList: File[]) => {
    setStatus(1);
    getTriggerInputContext({
      fileList: fileList,
      urlList: [],
      queryText: query,
      openAiApiKey: "none",
      chunkLimit: 15,
    })
      .then((data) => {
        onValueChange(JSON.stringify(data));
        setStatus(2);
      })
      .catch((error) => {
        toast.error((error as { message: string }).message);
        setStatus(3);
      })
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-default-700 flex items-center gap-0.5">{label} {isRequired ? <span className="text-danger"><AsteriskIcon size={12} /></span> : "(optional)"}</p>
      <input
        type="file"
        multiple={false}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) {
            const fileSize = files[0]!.size / 1024 / 1024; // in MiB
            if (fileSize > 25) {
              toast.info('Your file is too powerful. Please choose a file that is no bigger than 25 MB.');
              return;
            } else {
              handleSubmitFileList(files);
            }
          }
        }}
        className="w-full p-2 text-default-700 bg-default-50
          file:mr-4 file:py-1 file:px-2.5
          file:rounded-md file:border-0
          file:bg-default-600 file:text-default-50
          hover:file:bg-default-500 file:duration-150 file:cursor-pointer
          outline-none focus:bg-default-100 border border-default-500 shadow-sm rounded-lg"
      />
      {status === 1 ? (
        <div className="flex items-center gap-2 text-warning">
          <Spinner size="sm" color="warning" />
          <p className="text-xs">Reading the file...</p>
        </div>
      ) : status === 2 ? (
        <div className="flex items-center gap-2 text-success">
          <CheckIcon size={16} className="text-success" />
          <p className="text-xs">Successfully learned the file.</p>
        </div>
      ) : status === 3 ? (
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangleIcon size={16} className="text-danger" />
          <p className="text-xs">Something went wrong while we were trying to read the file. Please try again.</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}