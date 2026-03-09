"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


import type { TestResultItem } from "@/lib/types/OrtoniReportData";
import { useReport } from "@/hooks/use-report-context";
import { SuggestFixMarkdown } from "./SuggestFixMarkdown";

export function SuggestFix({ test, error }: { test: TestResultItem, error: string }) {
    const { reportData } = useReport();
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const getCleanErrorMessage = (htmlError: string) => {
        return htmlError.replace(/<[^>]*>?/gm, '').trim();
    };

    const handleSuggest = async () => {
        setLoading(true);
        setErrorMsg(null);
        setSuggestion(null);

        // Priority 1: From report JSON (userConfig)
        // Priority 2: From localStorage overrides
        const reportConfig = reportData?.data?.userConfig?.ai;
        const savedLocal = localStorage.getItem("ortoni-ai-config");
        let localConfig = null;
        if (savedLocal) {
            try { localConfig = JSON.parse(savedLocal); } catch (e) { /* ignore */ }
        }

        const config = {
            provider: localConfig?.provider || reportConfig?.provider || "openai",
            apiKey: localConfig?.apiKey || reportConfig?.apiKey,
            model: localConfig?.model || reportConfig?.model
        };

        if (!config.apiKey) {
            setErrorMsg("AI Configuration missing. Please configure your API key in the sidebar settings.");
            setLoading(false);
            return;
        }

        try {
            const cleanError = getCleanErrorMessage(error);
            const prompt = `You are an expert Playwright automation engineer.
Analyze the following test failure and suggest a root cause and a fix in Javascript.
Be concise. If there is a clear code fix, provide it in a markdown code block.

TEST CONTEXT:
Title: ${test.title}
Suite: ${test.suiteHierarchy || test.suite || "Unknown"}
Project: ${test.projectName || "Default"}

ERROR:
${cleanError}

Please provide your analysis in Markdown format.`;

            let result = "";

            if (config.provider === "openai") {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${config.apiKey}`
                    },
                    body: JSON.stringify({
                        model: config.model || "gpt-4o",
                        messages: [{ role: "user", content: prompt }]
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                result = data.choices[0].message.content;
            } else if (config.provider === "google") {
                const modelName = config.model || "gemini-2.0-flash";
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                result = data.candidates[0].content.parts[0].text;
            } else if (config.provider === "anthropic") {
                const response = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": config.apiKey,
                        "anthropic-version": "2023-06-01",
                        "dangerously-allow-browser": "true"
                    },
                    body: JSON.stringify({
                        model: config.model || "claude-3-5-sonnet-20240620",
                        max_tokens: 1024,
                        messages: [{ role: "user", content: prompt }]
                    })
                });
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                result = data.content[0].text;
            } else if (config.provider === "ollama") {
                const response = await fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: config.model || "llama3",
                        prompt: prompt,
                        stream: false
                    })
                });
                const data = await response.json();
                result = data.response;
            } else {
                throw new Error("Unsupported provider: " + config.provider);
            }

            setSuggestion(result);
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Failed to get AI suggestion. Check your API key and connection.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!suggestion) return;
        navigator.clipboard.writeText(suggestion);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentProvider = JSON.parse(localStorage.getItem("ortoni-ai-config") || "{}").provider || reportData?.data?.userConfig?.ai?.provider || "AI";

    return (
        <div className="mt-2 text-left">
            {!suggestion && !loading && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSuggest}
                    className="gap-2 border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400 h-8"
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    Suggest Fix with AI
                </Button>
            )}

            {loading && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-dashed border-purple-500/30">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Analyzing failure...</p>
                        <p className="text-xs text-muted-foreground italic">Consulting {currentProvider} for resolution steps.</p>
                    </div>
                </div>
            )}

            {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold mb-1">AI Assistant Error</p>
                        <p>{errorMsg}</p>
                    </div>
                </div>
            )}

            {suggestion && (
                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 space-y-3 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider bg-background/50 border-purple-500/20 text-purple-600">AI Insight</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-bold uppercase tracking-tight">Root Cause & Solution</span>
                    </div>

                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-foreground/80 font-sans">
                        <SuggestFixMarkdown content={suggestion} />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
                        <p className="text-[10px] text-muted-foreground italic">AI-generated content may be incorrect. Verify before applying.</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-purple-500/10"
                            onClick={copyToClipboard}
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
