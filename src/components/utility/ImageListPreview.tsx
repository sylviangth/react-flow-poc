import { Image } from "@nextui-org/react";
import { XIcon } from "lucide-react";
import { type ImageUploadProps } from "~/server/main/upload/image";

interface ImageListPreviewProps {
  imageUrlList: ImageUploadProps[];
  setImageUrlList?: (value: ImageUploadProps[]) => void;
  isLarge?: boolean;
}

export default function ImageListPreview({ imageUrlList, setImageUrlList, isLarge = false }: ImageListPreviewProps) {

  return (
    <ul className="flex items-center gap-2">
      {imageUrlList.map((img, idx) => (
        <li key={idx} className="relative">
          {setImageUrlList && (
            <span
              onClick={() => setImageUrlList([...imageUrlList.filter((item, index) => index !== idx)])}
              className="z-20 cursor-pointer absolute -top-1 -right-1 p-0.5 rounded-full bg-danger text-white"
            >
              <XIcon size={12} />
            </span>
          )}
          <div className={`${isLarge ? "h-40 w-40" : "h-20 w-20"} bg-default-100 flex items-center justify-center overflow-hidden rounded-lg`}>
            <Image src={img.url} radius="sm" alt="Image" className="h-full w-auto" />
          </div>
        </li>
      ))}
    </ul>
  )
}