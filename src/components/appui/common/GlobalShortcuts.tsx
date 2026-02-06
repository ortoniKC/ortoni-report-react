"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/theme-provider";

export function GlobalShortcuts() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement ||
                (e.target as HTMLElement).isContentEditable
            ) {
                return;
            }

            // 'T' key to toggle theme
            if (e.key.toLowerCase() === "t") {
                setTheme(theme === "light" ? "dark" : "light");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [theme, setTheme]);

    return null;
}
