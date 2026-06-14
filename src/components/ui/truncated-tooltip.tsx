"use client";

import { useRef, useState, useEffect } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TruncatedTooltip({
  text,
  className,
  as = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h2" | "h3" | "h4" | "p";
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const checkOverflow = () => {
    const el = ref.current;
    if (el) {
      // Use scrollWidth > clientWidth to detect if the text is truncated
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  const Tag = as;

  const element = (
    <Tag
      ref={ref as any}
      onMouseEnter={checkOverflow}
      className={cn(className, "truncate", isOverflowing && "cursor-help")}
    >
      {text}
    </Tag>
  );

  if (!isOverflowing) {
    return element;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {element}
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-md break-words">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
