"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { FileText } from "lucide-react";

interface Props {
  content: string;
}

export default function ReadmePreview({ content }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-6 rounded border border-white/10 bg-white/2 overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-black/70">
        <span className="text-xs uppercase tracking-wider text-white/40">
          <FileText className="inline-block w-4 h-4 mr-1" />
          README
        </span>

        <button
          onClick={copy}
          className="text-xs border border-white/20 px-3 py-1 rounded hover:bg-white/10"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div className="markdown-body p-6 text-sm overflow-y-auto max-h-[70vh]">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}