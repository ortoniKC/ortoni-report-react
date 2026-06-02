"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TestTitle({ title }: { title: string }) {
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const checkTruncation = () => {
    if (titleRef.current) {
      setIsTruncated(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  };

  useEffect(() => {
    checkTruncation();
  }, [title]);

  return (
    <Tooltip open={isTruncated ? undefined : false}>
      <TooltipTrigger asChild>
        <motion.h2
          ref={titleRef}
          onMouseEnter={checkTruncation}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-xl font-semibold truncate mb-2 select-text max-w-full cursor-default data-[truncated=true]:cursor-help"
          data-truncated={isTruncated}
        >
          {title}
        </motion.h2>
      </TooltipTrigger>
      <TooltipContent className="max-w-[400px] break-words text-xs">
        {title}
      </TooltipContent>
    </Tooltip>
  );
}
