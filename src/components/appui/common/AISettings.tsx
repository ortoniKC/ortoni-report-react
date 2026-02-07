"use client";

import { useState, useEffect } from "react";
import { Brain, Key, Save, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function AISettings() {
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [model, setModel] = useState("");

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("ortoni-ai-config");
        if (saved) {
            try {
                const config = JSON.parse(saved);
                setProvider(config.provider || "openai");
                setApiKey(config.apiKey || "");
                setModel(config.model || "");
            } catch (e) {
                console.error("Failed to parse AI config", e);
            }
        }
    }, []);

    const saveConfig = () => {
        const config = { provider, apiKey, model };
        localStorage.setItem("ortoni-ai-config", JSON.stringify(config));
        setOpen(false);
        // Refresh page or trigger context update to let other components know
        window.dispatchEvent(new Event("ortoni-ai-config-updated"));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost"
                    size="icon"
                    className="rounded-full">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span className="sr-only">AI Insights Settings</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                        </div>
                        <DialogTitle>AI Debugger Config</DialogTitle>
                    </div>
                    <DialogDescription>
                        Configure your LLM provider to enable AI-powered root cause analysis and fix suggestions.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-3">
                        <Label htmlFor="provider">AI Provider</Label>
                        <Select value={provider} onValueChange={setProvider}>
                            <SelectTrigger id="provider">
                                <SelectValue placeholder="Select Provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                                <SelectItem value="google">Google (Gemini 2.0 Flash)</SelectItem>
                                <SelectItem value="anthropic">Anthropic (Claude 3.5 Sonnet)</SelectItem>
                                <SelectItem value="ollama">Ollama (Local LLM)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="apiKey" className="flex items-center gap-2">
                            <Key className="h-3.5 w-3.5 text-muted-foreground" />
                            API Key
                        </Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder="sk-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="bg-muted/30"
                        />
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Stored locally in your browser. Never sent to Ortoni servers.
                        </p>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="model">Custom Model (Optional)</Label>
                        <Input
                            id="model"
                            placeholder="e.g. gpt-4-turbo"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="bg-muted/30"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={saveConfig} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                        <Save className="h-4 w-4" />
                        Save Configuration
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
