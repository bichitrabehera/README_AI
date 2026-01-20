// Detect ecosystem/runtime based on dependency files and configuration

import { FileSignals } from "./signals";

export interface EcosystemResult {
  ecosystem: string;
  confidence: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

// Ecosystem is determined primarily by dependency / manifest files
const ecosystemRules: Array<{
  name: string;
  files: string[];
  confidence: number;
}> = [
  { name: "Node.js", files: ["package.json"], confidence: 1.0 },
  {
    name: "Python",
    files: ["requirements.txt", "pyproject.toml", "setup.py"],
    confidence: 1.0,
  },
  { name: "Go", files: ["go.mod"], confidence: 1.0 },
  { name: "Rust", files: ["Cargo.toml"], confidence: 1.0 },
  { name: "Java", files: ["pom.xml", "build.gradle"], confidence: 1.0 },
  { name: "PHP", files: ["composer.json"], confidence: 1.0 },
  { name: "Ruby", files: ["Gemfile"], confidence: 1.0 },
  { name: "Dart", files: ["pubspec.yaml"], confidence: 1.0 },
  { name: "Swift", files: ["Package.swift"], confidence: 1.0 },
];

export function detectEcosystem(signals: FileSignals): EcosystemResult {
  let detectedEcosystem = "Unknown";
  let maxConfidence = 0;

  for (const rule of ecosystemRules) {
    const hasMatch = rule.files.some((file) => signals.configFiles.has(file));

    if (hasMatch && rule.confidence > maxConfidence) {
      detectedEcosystem = rule.name;
      maxConfidence = rule.confidence;
    }
  }

  // Honest fallback
  if (maxConfidence === 0) {
    return {
      ecosystem: "Unknown",
      confidence: 0,
    };
  }

  return {
    ecosystem: detectedEcosystem,
    confidence: clamp(maxConfidence),
  };
}
