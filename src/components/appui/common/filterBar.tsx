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
import { X, Search, SlidersHorizontal } from "lucide-react";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";
import { StatusPill } from "./statuspill";

interface FilterBarProps {
  flattened: (TestResultItem & { filePath: string; suite: string })[];
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
    [flattened],
  );

  const tags = useMemo(
    () => Array.from(new Set(flattened.map((t) => t.testTags).flat())),
    [flattened],
  );

  const projects = useMemo(
    () => Array.from(new Set(flattened.map((t) => t.projectName))),
    [flattened],
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

  const hasAnyFilter = status || project || tag || search;

  const clearAllFilters = () => {
    setStatus(null);
    setProject(null);
    setTag(null);
    setSearch("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 items-center rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 dark:from-card/30 dark:to-card/10 p-3.5 shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-muted-foreground mr-1">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground/75" />
        <span className="text-xs font-semibold uppercase tracking-wider hidden md:inline-block">Filters</span>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5">
        <Select onValueChange={(val) => setStatus(val)} value={status ?? ""}>
          <SelectTrigger className="w-[160px] sm:w-[180px] h-9 rounded-xl border-border/40 bg-background/50 hover:bg-background/80 transition-colors shadow-sm text-xs font-medium">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="rounded-lg text-xs">
                <StatusPill status={s} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {status && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-muted border border-border/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            onClick={() => setStatus(null)}
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>

      {/* Project Filter */}
      {projects.length > 1 && (
        <div className="flex items-center gap-1.5">
          <Select
            onValueChange={(val) => setProject(val)}
            value={project ?? ""}
          >
            <SelectTrigger className="w-[140px] sm:w-[160px] h-9 rounded-xl border-border/40 bg-background/50 hover:bg-background/80 transition-colors shadow-sm text-xs font-medium">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {projects.map((p) => (
                <SelectItem key={p} value={p} className="rounded-lg text-xs">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {project && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-muted border border-border/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              onClick={() => setProject(null)}
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 1 && (
        <div className="flex items-center gap-1.5">
          <Select onValueChange={(val) => setTag(val)} value={tag ?? ""}>
            <SelectTrigger className="w-[140px] sm:w-[160px] h-9 rounded-xl border-border/40 bg-background/50 hover:bg-background/80 transition-colors shadow-sm text-xs font-medium">
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {tags.map((p) => (
                <SelectItem key={p} value={p} className="rounded-lg text-xs">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {tag && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-muted border border-border/40 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              onClick={() => setTag(null)}
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </div>
      )}

      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] sm:w-auto">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
        <Input
          placeholder="Search test, suite, or file..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 w-full rounded-xl border-border/40 bg-background/50 hover:bg-background/80 focus:bg-background transition-all shadow-sm text-xs font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Clear All Global Reset Button */}
      {hasAnyFilter && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearAllFilters}
          className="h-9 px-3 text-[11px] font-semibold text-muted-foreground hover:text-foreground bg-muted border border-border/40 rounded-xl shadow-sm transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
        >
          Reset Filters
        </motion.button>
      )}
    </motion.div>
  );
}
