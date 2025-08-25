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
import { EllipsisBlock } from "../../ui/ellipsis-block";
import { isLocalFile, getAdjustedBaseUrl } from "../common/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Steps } from "@/lib/types/OrtoniReportData";

interface HtmlViewerDrawerProps {
  fileUrl: string;
  steps: Steps[];
  errors: string[];
  label?: string;
}

export const HtmlViewerDrawer: React.FC<HtmlViewerDrawerProps> = ({
  fileUrl,
  steps,
  errors,
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
      const pageSnapshot = `<pre class="whitespace-pre-wrap">${text}</pre>`;

      const instructions =
        `<h4>Instructions</h4><ul class="list-disc list-inside"><li>Following Playwright test failed.</li><li>Explain why, be concise, respect Playwright best practices.</li><li>Provide a snippet of code with the fix, if possible.</li></ul>`.trim();

      // build errors HTML
      const errorsHtml =
        errors.length > 0
          ? `<h4>Error Details</h4>${errors
              .map((e) => `<pre class="whitespace-pre-wrap">${e}</pre>`)
              .join("")}`
          : "";

      const stepsHtml = steps
        .filter((step) => step.snippet?.trim())
        .map(
          (step: Steps) => `
        <div class="text-xs">
          <pre class="whitespace-pre-wrap">${step.snippet ?? ""}</pre>
          ${step.location ? `<em>Location: ${step.location}</em>` : ""}
        </div>`
        )
        .join("\n");

      // merge everything
      const merged = `${instructions}\n${stepsHtml.trim()}\n${errorsHtml.trim()}\n${pageSnapshot}`;

      setContent(merged);
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
                <DrawerDescription>markup, steps, errors</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-full w-full border rounded-md p-2">
                <div className="p-4 max-h-[70vh] overflow-y-auto flex justify-center">
                  <EllipsisBlock errors={content} title="Markup" />
                </div>
              </ScrollArea>
            </DrawerContent>
          )}
        </Drawer>
      </Tooltip>
    </TooltipProvider>
  );
};
