"use client";

import { useState, useMemo } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Props {
  content: string;
}

/**
 * Normalize AI markdown output so it behaves like GitHub README
 */
function normalizeMarkdown(md: string) {
  if (!md) return "";

  return md
    .replace(/\\n/g, "\n") // fix escaped newlines
    .replace(/\r\n/g, "\n") // windows safety
    .replace(/\n{3,}/g, "\n\n") // prevent huge gaps
    .replace(/\n(#+)/g, "\n\n$1") // spacing before headings
    .replace(/\n```/g, "\n\n```") // spacing before code blocks
    .trim();
}

const ReadmePreview = ({ content }: Props) => {
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => normalizeMarkdown(content), [content]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy");
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/70">
        <p className="text-xs uppercase tracking-wider text-white/40">
          README.md Preview
        </p>

        <button
          onClick={copyToClipboard}
          className="
            text-xs px-3 py-1.5 rounded-md
            border border-white/20
            bg-white/5 hover:bg-white/10
            transition active:scale-[0.97]
          "
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Markdown Preview */}
      <div className="prose prose-invert max-w-none p-6 text-sm overflow-y-auto max-h-[70vh]">
        {formatted ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-semibold border-b border-white/10 pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-6">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold mt-4">{children}</h3>
              ),
              p: ({ children }) => {
                // Prevent <pre> inside <p>
                if (
                  Array.isArray(children) &&
                  children.some(
                    (child: unknown) => {
                      if (typeof child !== "object" || child === null) {
                        return false;
                      }
                      const c = child as {
                        type?: unknown;
                        props?: { node?: { tagName?: string } };
                      };
                      return (
                        c?.type === "pre" || c?.props?.node?.tagName === "pre"
                      );
                    },
                  )
                ) {
                  return <div>{children}</div>;
                }

                return <p>{children}</p>;
              },

              code: ({
                inline,
                children,
                ...props
              }: { inline?: boolean; children?: ReactNode } & HTMLAttributes<
                HTMLElement
              >) =>
                inline ? (
                  <code className="bg-white/10 px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                ) : (
                  <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto">
                    <code {...props}>{children}</code>
                  </pre>
                ),
            }}
          >
            {formatted}
          </ReactMarkdown>
        ) : (
          <p className="text-white/40 italic">
            README preview will appear here…
          </p>
        )}
      </div>
    </div>
  );
};

export default ReadmePreview;
