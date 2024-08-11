import { Spinner } from "@nextui-org/react";
import { AsteriskIcon } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";
import ImageListPreview from "~/components/utility/ImageListPreview";
import { ImageUploadProps, uploadMultipleImages } from "~/server/main/upload/image";

interface WorkflowTriggerInputImageListInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  isRequired: boolean;
}

export default function WorkflowTriggerInputImageListInput(props: WorkflowTriggerInputImageListInputProps) {

  const [imageUrlList, setImageUrlList] = React.useState<ImageUploadProps[]>([]);
  React.useEffect(() => {
    props.onValueChange(imageUrlList.length > 0 ? JSON.stringify(imageUrlList) : '');
  }, [imageUrlList])


  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && Array.from(files).length > 0) {
      setIsLoading(true);
      uploadMultipleImages(Array.from(files))
        .then((data) => {
          if (!data) {
            toast.error("Something went wrong. Please try again.");
          }
          setImageUrlList([...imageUrlList, ...data.map(item => ({ s3_file_path: item.s3_file_path, url: item.url }))]);
        })
        .catch((error) => {
          toast.error((error as { message: string }).message);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <p className="text-sm text-default-700 flex items-center gap-0.5">{props.label} {props.isRequired ? <span className="text-danger"><AsteriskIcon size={12} /></span> : "(optional)"}</p>
      <input
        type="file" accept="image/*"
        multiple={true}
        onChange={handleImageChange}
        className="w-full p-2 text-default-700 bg-default-50
          file:mr-4 file:py-1 file:px-2.5
          file:rounded-md file:border-0
          file:bg-default-600 file:text-default-50
          hover:file:bg-default-500 file:duration-150 file:cursor-pointer
          outline-none focus:bg-default-100 border border-default-500 shadow-sm rounded-lg"
      />
      <ImageListPreview
        imageUrlList={imageUrlList}
        setImageUrlList={setImageUrlList}
      />
      {isLoading && (
        <div className="flex items-center gap-2 text-warning">
          <Spinner size="sm" color="warning" />
          <p className="text-xs">Processing the image(s)...</p>
        </div>
      )}
    </div>
  )
}