"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface Props {
  content: string;
}

const ReadmePreview = ({ content }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="
        mt-6
        
        border border-white/10
        bg-black/40
        backdrop-blur-xl
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
      "
    >
      {/* Header */}
      <div
        className="
          sticky top-0 z-10
          flex items-center justify-between
          px-4 py-2
          border-b border-white/10
          bg-black/70
          backdrop-blur-xl
        "
      >
        <p className="text-xs uppercase tracking-wider text-white/40">
          README.md Preview
        </p>

        <button
          onClick={copyToClipboard}
          className="
            text-xs
            px-3 py-1.5
            rounded-md
            border border-white/20
            bg-white/5
            hover:bg-white/10
            hover:border-white/30
            transition
            active:scale-[0.97]
          "
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Content */}
      <div
        className="
          prose prose-invert
          max-w-none
          p-6
          text-sm
          overflow-y-auto
          max-h-[65vh]
          scroll-smooth
          border-t border-white/5
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ReadmePreview;
