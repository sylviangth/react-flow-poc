import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";

interface ReferenceItemProps {
  index: number;
  title: string;
  href: string;
}

export default function ReferenceItem ({ index, title, href } : ReferenceItemProps) {

  const [ hover, setHover ] = useState<boolean>(false);
  const [ domain, setDomain ] = useState<string | null>(null);

  useEffect(() => {
    if (href.startsWith('/')) {
      setDomain(window.location.hostname)
    } else {
      setDomain(new URL(href).hostname)
    }
  }, [])

  const handleOpen = () => {
    window.open(href, "_blank");
  }
  return (
    <>
      <Button 
        as={Button} onClick={(e) => {
          e.preventDefault();
          handleOpen();
        }}
        className="cursor-pointer shadow-none w-full h-full p-3 whitespace-pre-line text-left flex flex-col gap-1 justify-start items-start duration-150 bg-default-100 hover:bg-default-200"
      >
        <div className="flex items-center text-default-600 gap-2">
          <p>{index}</p>
        </div>
        <h3 className={`text-sm wrap line-clamp-3 md:line-clamp-2`}>
          {title}
        </h3>
        <p className="text-xs text-gray-400">
          {domain}
        </p>
      </Button>
    </>
  )
}