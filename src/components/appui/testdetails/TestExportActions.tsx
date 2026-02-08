"use client";

import { useState } from "react";
import { Share2, Check, Copy, Slack, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TestResultItem } from "@/lib/types/OrtoniReportData";

export function TestExportActions({ test }: { test: TestResultItem }) {
    const [copied, setCopied] = useState(false);

    const getCleanErrorMessage = (htmlError: string) => {
        // Basic HTML tag removal for markdown
        return htmlError
            .replace(/<[^>]*>?/gm, '')
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
    };

    const copyToClipboard = (format: 'slack' | 'jira' | 'link') => {
        const reportUrl = window.location.href;

        let text = "";

        if (format === 'link') {
            text = reportUrl;
        } else {
            const errorMsg = test.errors.length > 0 ? getCleanErrorMessage(test.errors[0]) : "No errors logged.";

            if (format === 'slack') {
                text = `*Test Failure Summary*\n` +
                    `*Test:* ${test.title}\n` +
                    `*Status:* ${test.status.toUpperCase()}\n` +
                    `*Suite:* ${test.suiteHierarchy}\n` +
                    `*Error:* \`\`\`${errorMsg.slice(0, 500)}${errorMsg.length > 500 ? '...' : ''}\`\`\`\n` +
                    `*View Report:* <${reportUrl}|Click here to view>`;
            } else if (format === 'jira') {
                text = `h3. Test Failure Summary\n` +
                    `*Test:* ${test.title}\n` +
                    `*Status:* {color:red}${test.status.toUpperCase()}{color}\n` +
                    `*Suite:* ${test.suiteHierarchy}\n` +
                    `*Error:* \n {code:javascript}\n${errorMsg.slice(0, 1000)}\n{code}\n` +
                    `*View Report:* [Link|${reportUrl}]`;
            }
        }

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8 px-2 lg:px-3">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
                    <span className="hidden lg:inline">Export</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Copy Summary</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => copyToClipboard('slack')} className="gap-2 cursor-pointer">
                    <Slack className="h-4 w-4" />
                    <span>Copy for Slack</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard('jira')} className="gap-2 cursor-pointer">
                    <MessageSquareText className="h-4 w-4" />
                    <span>Copy for Jira / Markdown</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => copyToClipboard('link')} className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4" />
                    <span>Copy Report Link</span>
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="gap-2 cursor-pointer"
                >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open in New Tab</span>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
