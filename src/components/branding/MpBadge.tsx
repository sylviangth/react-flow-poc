"use client"

import { MINDPAL_LANDING_PAGE_URL } from "lib/common-data";
import { ArrowUpRightIcon } from "lucide-react";

export default function MpBadge() {

  return (
    <p
      onClick={() => window.open(MINDPAL_LANDING_PAGE_URL, "_blank")}
      className='cursor-pointer text-sm text-default-500 flex items-center gap-1.5 hover:opacity-70 duration-150'
    >
      Powered by <span className="text-primary flex items-center gap-1">MindPal <span><ArrowUpRightIcon size={16} /></span></span>
    </p>
  )
}