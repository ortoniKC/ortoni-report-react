"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EllipsisBlock } from "../ui/ellipsis-block";
import { isLocalFile, getAdjustedBaseUrl } from "./utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HtmlViewerDrawerProps {
  fileUrl: string;
  label?: string;
}

export const HtmlViewerDrawer: React.FC<HtmlViewerDrawerProps> = ({
  fileUrl,
  label = "Open Markup",
}) => {
  const [content, setContent] = useState<string>("");
  const disabled = isLocalFile();

  const handleOpen = async () => {
    if (disabled) return;

    try {
      const baseUrl = getAdjustedBaseUrl();
      const normalizedPath = fileUrl.replace(/\\/g, "/");
      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${normalizedPath.replace(
        /^\//,
        ""
      )}`;

      const res = await fetch(fullUrl);
      const text = await res.text();
      setContent(text);
    } catch (err) {
      setContent(
        `<p class="text-red-500 font-semibold">Failed to load content</p>`
      );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Drawer onOpenChange={(open) => open && handleOpen()}>
          <TooltipTrigger asChild>
            <span>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    disabled
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : ""
                  }
                >
                  {label}
                </Button>
              </DrawerTrigger>
            </span>
          </TooltipTrigger>
          {disabled && (
            <TooltipContent>
              Can’t be used in local file. Run{" "}
              <code>npx ortoni-report show-report</code>
            </TooltipContent>
          )}
          {!disabled && (
            <DrawerContent>
              <DrawerHeader className="sr-only">
                <DrawerTitle>{label}</DrawerTitle>
                <DrawerDescription>mark up</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-full w-full border rounded-md p-2">
                <div className="p-4 max-h-[70vh] overflow-y-auto flex justify-center">
                  <EllipsisBlock errors={content} title="Markdown" />
                </div>
              </ScrollArea>
            </DrawerContent>
          )}
        </Drawer>
      </Tooltip>
    </TooltipProvider>
  );
};
