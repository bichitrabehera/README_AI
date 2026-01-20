// Detect primary programming language using file extension frequency

import { FileSignals } from "./signals";

export interface LanguageResult {
  language: string;
  confidence: number;
}

const extensionToLanguage: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  jsx: "JavaScript",
  py: "Python",
  go: "Go",
  rs: "Rust",
  java: "Java",
  kt: "Kotlin",
  c: "C",
  cpp: "C++",
  cc: "C++",
  cxx: "C++",
  h: "C/C++",
  hpp: "C++",
  cs: "C#",
  rb: "Ruby",
  php: "PHP",
  swift: "Swift",
  scala: "Scala",
  sh: "Shell",
  bash: "Shell",
};

const ignoreExtensions = new Set([
  "json",
  "md",
  "txt",
  "yaml",
  "yml",
  "lock",
  "gitignore",
  "env",
  "log",
  "svg",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "ico",
  "woff",
  "woff2",
  "ttf",
  "eot",
]);

export function detectLanguage(signals: FileSignals): LanguageResult {
  const languageCounts = new Map<string, number>();
  let totalRelevantFiles = 0;

  for (const [ext, count] of signals.extensions.entries()) {
    if (ignoreExtensions.has(ext)) continue;

    const language = extensionToLanguage[ext];
    if (!language) continue;

    languageCounts.set(language, (languageCounts.get(language) || 0) + count);
    totalRelevantFiles += count;
  }

  if (totalRelevantFiles === 0) {
    return {
      language: "Unknown",
      confidence: 0,
    };
  }

  let dominantLanguage = "Unknown";
  let maxCount = 0;

  for (const [language, count] of languageCounts.entries()) {
    if (count > maxCount) {
      dominantLanguage = language;
      maxCount = count;
    }
  }

  const rawConfidence = maxCount / totalRelevantFiles;

  // soften confidence so mixed-language repos don't look overconfident
  const confidence =
    rawConfidence > 0.85
      ? 0.95
      : rawConfidence > 0.65
      ? 0.8
      : rawConfidence > 0.45
      ? 0.65
      : 0.45;

  return {
    language: dominantLanguage,
    confidence,
  };
}
