"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

interface MasonryGalleryProps {
  tests: TestResultItem[];
}

export default function MasonryGallery({ tests }: MasonryGalleryProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const images = useMemo(() => {
    const screenshots: string[] = [];
    if (tests && Array.isArray(tests)) {
      tests.forEach((test) => {
        if (test.screenshots && Array.isArray(test.screenshots)) {
          screenshots.push(...test.screenshots);
        }
      });
    }
    return screenshots;
  }, [tests]);

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
        <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
          <div className="min-h-screen px-4 py-20 md:px-6">
            <div className="columns-1 gap-4 space-y-4 transition-all sm:columns-2 md:columns-3 lg:columns-4">
              {images.map((src, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
                >
                  <motion.img
                    src={src}
                    alt={`Random ${index}`}
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
      </div>
    </div>
  );
}
