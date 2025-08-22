"use client";

import { copyToClipboard } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

export const EllipsisBlock = memo(
  ({ errors, title }: { errors: string[]; title: string }) => {
    const [status, setStatus] = useState<"idle" | "copied">("idle");
    const errorRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
      if (status !== "idle") {
        const timer = setTimeout(() => setStatus("idle"), 1500);
        return () => clearTimeout(timer);
      }
    }, [status]);

    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (errorRef.current) {
        const textToCopy = errorRef.current.innerText; // 👈 visible text only
        copyToClipboard(textToCopy);
        setStatus("copied");
      }
    };

    const icons = {
      idle: <Clipboard strokeWidth={2.5} size={16} />,
      copied: (
        <ClipboardCheck
          strokeWidth={2.5}
          className="stroke-green-500 stroke-2"
          size={16}
        />
      ),
    };

    return (
      <div className="relative w-full max-w-5xl rounded-xl p-0.5">
        <div className="rounded-xl p-4">
          <div className="flex items-center justify-between rounded-t-xl border-b border-gray-700 bg-neutral-900 px-4 py-2">
            <div className="flex items-center justify-center gap-2">
              <span className="size-3 rounded-full bg-[#FF5F56]" />
              <span className="size-3 rounded-full bg-[#FFBD2E]" />
              <span className="size-3 rounded-full bg-[#27C93F]" />
            </div>

            <p className="text-sm font-medium text-gray-400">{title}</p>
            <button
              aria-label="Copy errors"
              onClick={handleCopy}
              className="rounded-xl bg-gray-800 p-2 text-gray-100 hover:bg-gray-700 focus:outline-none"
            >
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {icons[status]}
              </motion.div>
            </button>
          </div>
          <pre
            ref={errorRef}
            className="overflow-x-auto rounded-b-xl bg-stone-800 p-4 text-xs text-blue-100"
          >
            {errors.map((e, i) => (
              <pre key={i} dangerouslySetInnerHTML={{ __html: e }} />
            ))}
          </pre>
        </div>
      </div>
    );
  }
);
