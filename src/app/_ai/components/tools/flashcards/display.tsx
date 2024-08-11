"use client";

import { Button, Card, Chip, Pagination } from "@nextui-org/react";
import { FlipHorizontalIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { FlashcardProps } from ".";

interface FlashcardsDisplayProps {
  flashcardList: FlashcardProps[];
}
export default function FlashcardsDisplay({
  flashcardList,
}: FlashcardsDisplayProps) {

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFront, setIsFront] = useState<boolean>(true);
  useEffect(() => {
    setIsFront(true);
  }, [currentPage])

  return (
    <div className="w-full px-4 flex flex-col items-center gap-4">
      <Card className="p-8 w-full flex flex-col items-center justify-center gap-8 bg-default-50 border border-default-300 shadow-primary/40">
        <Chip variant="flat" color="default">
          {isFront ? "Front" : "Back"}
        </Chip>
        <p className={`${isFront ? "font-bold" : ""} text-center text-xl`}>
          {isFront ? flashcardList[currentPage - 1]?.frontContent : flashcardList[currentPage - 1]?.backContent}
        </p>
        <Button
          onClick={() => setIsFront(!isFront)}
          variant="solid" color="primary" startContent={<FlipHorizontalIcon size={16} />}
        >
          Flip
        </Button>
      </Card>
      <div className="flex items-center gap-2">
        <Pagination
          loop showControls color="primary" className="z-0"
          page={currentPage} onChange={setCurrentPage} total={flashcardList.length}
        />
      </div>
    </div>
  )
}