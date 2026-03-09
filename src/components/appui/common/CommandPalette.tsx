"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Terminal, FileText, LayoutDashboard, BarChart3, ScanEye, Image as ImageIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useReport } from "@/hooks/use-report-context";
import { ensureArray } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { reportData } = useReport();
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const flattenedTests = useMemo(() => {
        if (!reportData) return [];
        const results: TestResultItem[] = [];
        Object.entries(reportData.data.testResult.tests ?? {}).forEach(([filePath, suites]) => {
            Object.entries(suites ?? {}).forEach(([suiteName, suiteData]) => {
                const testArray = ensureArray(suiteData) as TestResultItem[];
                testArray.forEach((t) => results.push({ ...t, suite: suiteName, filePath }));
            });
        });
        return results;
    }, [reportData]);

    const filteredItems = useMemo(() => {
        if (query.trim() === "") return [];
        const q = query.toLowerCase();

        // Pages
        const pages = [
            { id: 'p1', title: 'Dashboard', subtitle: "", icon: LayoutDashboard, action: () => navigate('/dashboard'), category: 'Navigation' },
            { id: 'p2', title: 'Tests', subtitle: "", icon: FileText, action: () => navigate('/tests'), category: 'Navigation' },
            { id: 'p3', title: 'Glance', subtitle: "", icon: ScanEye, action: () => navigate('/glance'), category: 'Navigation' },
            { id: 'p4', title: 'Analytics', subtitle: "", icon: BarChart3, action: () => navigate('/analytics'), category: 'Navigation' },
            { id: 'p5', title: 'Screenshots', subtitle: "", icon: ImageIcon, action: () => navigate('/screenshots'), category: 'Navigation' },
        ].filter(p => p.title.toLowerCase().includes(q));

        // Tests
        const tests = flattenedTests
            .filter(t => t.title.toLowerCase().includes(q) || t.filePath.toLowerCase().includes(q))
            .slice(0, 10)
            .map(t => ({
                id: t.key,
                title: t.title,
                subtitle: t.filePath,
                icon: Terminal,
                action: () => {
                    navigate(`/tests?id=${t.key}`);
                    setOpen(false);
                },
                category: 'Tests'
            }));

        return [...pages, ...tests];
    }, [query, flattenedTests, navigate]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredItems.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
            } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
                e.preventDefault();
                filteredItems[selectedIndex].action();
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, filteredItems, selectedIndex]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);



    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setQuery("");
        }}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl">
                <DialogHeader className="p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tests, files, or navigation..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-none focus-visible:ring-0 text-lg p-0 h-auto bg-transparent shadow-none"
                            autoFocus
                        />
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                    {query === "" && (
                        <div className="p-4 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">Type to search for tests or pages</p>
                            <div className="flex justify-center gap-2">
                                <Badge variant="secondary" className="text-[10px]">Tests</Badge>
                                <Badge variant="secondary" className="text-[10px]">Files</Badge>
                                <Badge variant="secondary" className="text-[10px]">Navigation</Badge>
                            </div>
                        </div>
                    )}

                    {filteredItems.length > 0 && (
                        <div className="space-y-4 pb-2">
                            {['Navigation', 'Tests'].map(category => {
                                const categoryItems = filteredItems.filter(i => i.category === category);
                                if (categoryItems.length === 0) return null;

                                return (
                                    <div key={category}>
                                        <h3 className="px-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            {category}
                                        </h3>
                                        <div className="grid gap-1">
                                            {categoryItems.map((item) => {
                                                const globalIdx = filteredItems.findIndex(i => i.id === item.id);
                                                const isSelected = globalIdx === selectedIndex;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => {
                                                            item.action();
                                                            setOpen(false);
                                                        }}
                                                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                        className={cn(
                                                            "flex items-center gap-3 w-full p-2.5 rounded-lg text-left transition-colors group",
                                                            isSelected ? "bg-muted" : "hover:bg-muted/50"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "p-2 rounded-md border border-transparent transition-colors",
                                                            isSelected ? "bg-background border-border" : "bg-muted group-hover:bg-background group-hover:border-border"
                                                        )}>
                                                            <item.icon className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium truncate">{item.title}</div>
                                                            {item.subtitle && (
                                                                <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                                                            )}
                                                        </div>
                                                        <div className={cn(
                                                            "text-[10px] text-muted-foreground transition-opacity whitespace-nowrap",
                                                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                        )}>
                                                            {isSelected ? "Press Enter" : "Jump to item"}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {query !== "" && filteredItems.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-sm text-muted-foreground">No matches found for "{query}"</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t bg-muted/30 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <kbd className="border bg-background px-1 rounded font-mono font-normal">↑↓</kbd>
                            Navigate
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <kbd className="border bg-background px-1 rounded font-mono font-normal">Enter</kbd>
                            Select
                        </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground italic">
                        Powered by Ortoni Report
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Badge({ children, className, variant = "default" }: any) {
    return (
        <span className={cn(
            "px-1.5 py-0.5 rounded-full text-[10px] font-medium border",
            variant === "default" && "bg-primary text-primary-foreground",
            variant === "secondary" && "bg-muted text-muted-foreground border-border",
            className
        )}>
            {children}
        </span>
    );
}
