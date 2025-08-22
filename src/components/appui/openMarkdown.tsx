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

interface HtmlViewerDrawerProps {
  fileUrl: string;
  label?: string;
}

export const HtmlViewerDrawer: React.FC<HtmlViewerDrawerProps> = ({
  fileUrl,
  label = "Open Markup",
}) => {
  const [content, setContent] = useState<string>("");

  const handleOpen = async () => {
    try {
      const res = await fetch(fileUrl);
      const text = await res.text();
      setContent(text);
    } catch (err) {
      setContent(
        `<p class="text-red-500 font-semibold">Failed to load content</p>`
      );
    }
  };

  return (
    <Drawer onOpenChange={(open) => open && handleOpen()}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          {label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{label}</DrawerTitle>
          <DrawerDescription>mark up</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-full w-full border rounded-md p-2">
          <EllipsisBlock errors={content} title={"Markdown"} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
