"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export function VideoDialog({ src, label }: { src: string; label: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-md">
          <PlayCircle className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <motion.video
          src={src}
          controls
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-md w-full max-h-[70vh]"
        />
      </DialogContent>
    </Dialog>
  );
}
