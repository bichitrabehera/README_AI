"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

const ReadmePreview = ({ content }: Props) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="mt-8 border border-white/10 overflow-hidden">

      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <p className="text-sm text-white/60">README.md preview</p>

        <button
          onClick={copyToClipboard}
          className="text-sm px-3 py-1 border border-white/20 hover:bg-white/10"
        >
          Copy
        </button>
      </div>

      {/* markdown preview */}
      <div className="prose prose-invert max-w-none p-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ReadmePreview;
