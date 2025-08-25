"use client";

import { motion } from "framer-motion";
import { LucideInfo } from "lucide-react";
import { AnnotationItem } from "./AnnotationItem";
import type { Annotations } from "@/lib/types/OrtoniReportData";

export function TestAnnotations({
  annotations,
}: {
  annotations?: Annotations[];
}) {
  if (!Array.isArray(annotations) || annotations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <h4 className="font-medium mb-3 flex items-center gap-2">
        <LucideInfo className="h-4 w-4" />
        Annotations
      </h4>

      <div className="flex-1 space-y-3">
        {annotations.map((annotation, index) => (
          <AnnotationItem
            key={index}
            type={annotation.type}
            description={annotation.description}
          />
        ))}
      </div>
    </motion.section>
  );
}
