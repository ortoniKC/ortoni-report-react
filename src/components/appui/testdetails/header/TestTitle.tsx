"use client";

import { motion } from "framer-motion";

export function TestTitle({ title }: { title: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="text-xl font-semibold truncate mb-2"
    >
      {title}
    </motion.h2>
  );
}
