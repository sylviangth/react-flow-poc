import { Button, Input, Spinner } from "@nextui-org/react";
import { AlertTriangleIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { getTriggerInputContext } from "~/server/main/get-trigger-input-context";
import { isValidUrl } from "~/utils/helpers";

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

  const [url, setUrl] = useState<string>("");

  const [status, setStatus] = useState<number>(0);
  // 0: Not started, 1: Loading, 2: Success, 3: Failed

  const handleSubmitUrl = () => {
    if (!url || !url.trim()) { return; }
    if (!isValidUrl(url)) {
      toast.error("Invalid URL!");
      return;
    }
    setStatus(1);
    getTriggerInputContext({
      fileList: [],
      urlList: [url],
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
      <Input
        value={url} onValueChange={setUrl}
        label={label + (!isRequired ? " (optional)" : "")} placeholder="Paste an URL here..."
        isRequired={isRequired}
        fullWidth labelPlacement="outside"
      />
      {status === 1 ? (
        <div className="flex items-center gap-2 text-warning">
          <Spinner size="sm" color="warning" />
          <p className="text-xs">Reading the URL...</p>
        </div>
      ) : status === 2 ? (
        <div className="flex items-center gap-2 text-success">
          <CheckIcon size={16} className="text-success" />
          <p className="text-xs">Successfully learned the URL.</p>
        </div>
      ) : status === 3 ? (
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangleIcon size={16} className="text-danger" />
          <p className="text-xs">Something went wrong while we were trying to read the URL. Please try again.</p>
        </div>
      ) : url.trim() && (
        <Button
          onClick={handleSubmitUrl}
          variant="flat" color="primary"
        >
          Start reading URL
        </Button>
      )}
    </div>
  )
}