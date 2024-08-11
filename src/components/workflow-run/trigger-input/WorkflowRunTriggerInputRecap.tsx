import { Input, Textarea } from "@nextui-org/react";
import { WorkflowTriggerInputType } from "@prisma/client";
import React from "react";
import { ExtendedWorkflowRunTriggerInput } from "~/app/_providers/WorkflowRunContextProvider";
import ImageListPreview from "~/components/utility/ImageListPreview";
import { TriggerInputContextResponse } from "~/server/main/get-trigger-input-context";
import { getDocumentUrl } from "~/server/main/get/doc-view-url";
import { ImageUploadProps } from "~/server/main/upload/image";

export default function WorkflowRunTriggerInputRecapItem({ data }: { data: ExtendedWorkflowRunTriggerInput }) {
  const [finalImgUrlList, setFinalImgUrlList] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (data.WorkflowTriggerInput.type === WorkflowTriggerInputType.IMAGES) {
      const transformUrls = async () => {
        const imgUrlList = (JSON.parse(data.value) as ImageUploadProps[]).filter(i => !!i.s3_file_path).map((item) => item.s3_file_path!).flat();
        if (imgUrlList && imgUrlList.length > 0) {
          const result = await Promise.all(
            imgUrlList.map(async (item) => {
              if (item.startsWith("mindpal_copilot/image/")) {
                const url = await getDocumentUrl(item);
                return url.url;
              } else {
                return item;
              }
            })
          );
          setFinalImgUrlList(result);
        }
      };
      void transformUrls();
    }
  }, [data.value]);
  switch (data.WorkflowTriggerInput.type) {
    case WorkflowTriggerInputType.FILE: {
      const fileName = (JSON.parse(data.value) as TriggerInputContextResponse).metadata[0]!.document_title;
      return (
        <Input
          value={fileName}
          label={data.WorkflowTriggerInput.name || "Unknown field"}
          fullWidth isReadOnly labelPlacement="outside"
        />
      )
    }
    case WorkflowTriggerInputType.URL: {
      const url = (JSON.parse(data.value) as TriggerInputContextResponse).metadata[0]!.url;
      return (
        <Input
          value={url}
          label={data.WorkflowTriggerInput.name || "Unknown field"}
          fullWidth isReadOnly labelPlacement="outside"
        />
      )
    }
    case WorkflowTriggerInputType.IMAGES: {
      return (
        <div className="w-full flex flex-col gap-2">
          <p className="text-sm text-default-500 flex items-center gap-0.5">{data.WorkflowTriggerInput.name || "Unknown field"}</p>
          {(finalImgUrlList.length > 0) && (
            <ImageListPreview
              imageUrlList={finalImgUrlList.map(item => ({ s3_file_path: null, url: item }))}
              isLarge={true}
            />
          )}
        </div>
      )
    }
    default: {
      return (
        <Textarea
          value={data.value}
          label={data.WorkflowTriggerInput.name || "Unknown field"}
          fullWidth isReadOnly labelPlacement="outside"
          rows={1} minRows={1}
        />
      )
    }
  }
}