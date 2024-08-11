"use client";

import { Button } from "@nextui-org/react";
import { MINDPAL_LANDING_PAGE_URL } from "lib/common-data";
import { ArrowLeftIcon, CircleSlash2Icon } from "lucide-react";

interface ErrorScreenProps {
  heading: string;
  desc: string;
  ctaText?: string;
  ctaOnClick?: () => void;
}

export default function ErrorScreen({ heading, desc, ctaText = "Back to home", ctaOnClick = (() => window.location.href = MINDPAL_LANDING_PAGE_URL) }: ErrorScreenProps) {

  return (
    <div className="w-full h-full px-12 py-8 flex flex-col gap-6 items-center justify-center">
      <CircleSlash2Icon size={40} className="text-danger" />
      <h1 className="text-danger text-2xl font-semibold">{heading}</h1>
      <p className="text-default-500 text-center">{desc}</p>
      <Button
        onClick={ctaOnClick}
        variant="shadow" color="primary"
        startContent={<ArrowLeftIcon size={16} />}
      >
        {ctaText}
      </Button>
    </div>
  )
}