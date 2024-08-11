import { Spinner } from "@nextui-org/react";

interface LoadingScreenProps {
  desc: string;
}

export default function LoadingScreen({ desc }: LoadingScreenProps) {

  return (
    <div className="w-full h-full px-12 py-8 flex flex-col gap-6 items-center justify-center">
      <Spinner />
      <p className="text-default-500 text-center">{desc}</p>
    </div>
  )
}