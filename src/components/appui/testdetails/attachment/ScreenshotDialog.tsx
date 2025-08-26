"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { DialogDescription } from "@radix-ui/react-dialog";

export function ScreenshotDialog({
  src,
  label,
}: {
  src: string;
  label: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-md">
          <ImageIcon className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
          w-[95vw] max-w-[95vw]
          md:max-w-[90vw] lg:max-w-[80vw]
          xl:max-w-[1280px]
          h-[80vh] p-0 z-[100]
        "
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            This is a screenshot of the test result
          </DialogDescription>
        </DialogHeader>
        <motion.img
          src={src}
          alt={label}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-md max-h-[80vh] mx-auto object-contain p-4"
        />
      </DialogContent>
    </Dialog>
  );
}
