"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";
import TextGenerateEffect from "../ui/typewriter";
import { Description } from "@radix-ui/react-dialog";

interface MasonryGalleryProps {
  tests: TestResultItem[];
}

interface ScreenshotInfo {
  src: string;
  testName: string;
}

export default function MasonryGallery({ tests }: MasonryGalleryProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] =
    useState<ScreenshotInfo | null>(null);

  const imagesWithTestInfo = useMemo(() => {
    const screenshots: ScreenshotInfo[] = [];
    if (tests && Array.isArray(tests)) {
      tests.forEach((test) => {
        if (test.screenshots && Array.isArray(test.screenshots)) {
          test.screenshots.forEach((screenshot) => {
            screenshots.push({
              src: screenshot,
              testName: test.title || "Unknown Test",
            });
          });
        }
      });
    }
    return screenshots;
  }, [tests]);

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <div className="px-2 sm:px-0">
            <TextGenerateEffect
              words={"Screenshots"}
              className="text-3xl font-bold tracking-tight sm:text-3xl"
            />
          </div>
          <div className="columns-1 gap-4 space-y-4 transition-all sm:columns-2 md:columns-3 lg:columns-4">
            {imagesWithTestInfo.map((imageInfo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelectedScreenshot(imageInfo)}
                className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
              >
                <motion.img
                  src={imageInfo.src}
                  alt={imageInfo.testName}
                  className={`w-full rounded-lg object-cover transition-all duration-300 ease-in-out ${
                    hovered === null
                      ? "blur-0 scale-100"
                      : hovered === index
                        ? "blur-0 scale-105"
                        : "blur-xs"
                  }`}
                  whileHover={{ scale: 1.05 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedScreenshot}
        onOpenChange={() => setSelectedScreenshot(null)}
      >
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <Description className="sr-only">Screenshot Preview</Description>
            <DialogTitle>{selectedScreenshot?.testName}</DialogTitle>
          </DialogHeader>
          {selectedScreenshot && (
            <div className="flex justify-center">
              <img
                src={selectedScreenshot.src}
                alt={selectedScreenshot.testName}
                className="max-h-96 max-w-full rounded-lg object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
