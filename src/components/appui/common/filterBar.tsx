"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { TestStatus } from "@/lib/types/OrtoniReportData";
import { StatusPill } from "./utils";

interface FilterBarProps {
  flattened: {
    testId: string;
    title: string;
    suite: string;
    filePath: string;
    projectName: string;
    status: TestStatus;
    duration: number;
    testTags: string[];
    key: string;
  }[];
  onFilter: (filtered: FilterBarProps["flattened"]) => void;
}

export function FilterBar({ flattened, onFilter }: FilterBarProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Memoize unique values for dropdowns
  const statuses = useMemo(
    () => Array.from(new Set(flattened.map((t) => t.status))),
    [flattened]
  );

  const tags = useMemo(
    () => Array.from(new Set(flattened.map((t) => t.testTags).flat())),
    [flattened]
  );

  const projects = useMemo(
    () => Array.from(new Set(flattened.map((t) => t.projectName))),
    [flattened]
  );

  const filtered = useMemo(() => {
    return flattened.filter((t) => {
      const matchesStatus = status ? t.status === status : true;
      const matchesProject = project ? t.projectName === project : true;
      const matchesSearch =
        search.length > 0
          ? [t.title, t.filePath, t.suite]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase())
          : true;
      const matchesTag = tag ? t.testTags.includes(tag) : true;

      return matchesStatus && matchesProject && matchesSearch && matchesTag;
    });
  }, [flattened, status, project, search, tag]);

  // Send filtered data back using useEffect
  useEffect(() => {
    onFilter(filtered);
  }, [filtered, onFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 rounded-xl border bg-muted/40 p-3 shadow-sm"
    >
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Select onValueChange={(val) => setStatus(val)} value={status ?? ""}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                <StatusPill status={s} />
                {/* <Badge
                  className={cn(
                    "rounded-full px-2 py-1 text-xs",
                    statusVariant(s).className
                  )}
                >
                  {statusVariant(s).label}
                </Badge> */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {status && (
          <X
            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => setStatus(null)}
          />
        )}
      </div>

      {/* Project Filter */}
      {projects.length > 1 && (
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(val) => setProject(val)}
            value={project ?? ""}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter Project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {project && (
            <X
              className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => setProject(null)}
            />
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 1 && (
        <div className="flex items-center gap-2">
          <Select onValueChange={(val) => setTag(val)} value={tag ?? ""}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter Tags" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tag && (
            <X
              className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
              onClick={() => setTag(null)}
            />
          )}
        </div>
      )}

      {/* Search Input */}
      <Input
        placeholder="Search test, suite, or file..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-[280px]"
      />
    </motion.div>
  );
}
