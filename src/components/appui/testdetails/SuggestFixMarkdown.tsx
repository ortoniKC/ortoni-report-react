import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SuggestFixMarkdownProps {
    content: string;
}

export function SuggestFixMarkdown({ content }: SuggestFixMarkdownProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                        <div className="relative my-4 group">
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500" />
                            <pre className="relative rounded-lg bg-zinc-950 p-4 overflow-x-auto border border-white/10 shadow-2xl">
                                <code
                                    className="text-[13px] font-mono leading-relaxed text-zinc-100 block"
                                    {...props}
                                >
                                    {children}
                                </code>
                            </pre>
                        </div>
                    ) : (
                        <code
                            className="px-1.5 py-0.5 rounded bg-purple-500/10 font-mono text-purple-600 dark:text-purple-400 font-medium"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
