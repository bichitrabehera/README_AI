// Detect project type using heuristics

import { FileSignals } from "./signals";

export interface ProjectTypeResult {
  projectType: string;
  confidence: number;
}

interface ProjectTypeRule {
  name: string;
  check: (signals: FileSignals) => number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const projectTypeRules: ProjectTypeRule[] = [
  {
    name: "Web Application",
    check: (signals) => {
      let score = 0;

      if (
        signals.extensions.has("html") ||
        signals.extensions.has("tsx") ||
        signals.extensions.has("jsx")
      ) {
        score += 0.4;
      }

      if (
        signals.extensions.has("css") ||
        signals.extensions.has("scss") ||
        signals.extensions.has("sass")
      ) {
        score += 0.2;
      }

      if (
        signals.configFiles.has("next.config.js") ||
        signals.configFiles.has("vite.config.js") ||
        signals.configFiles.has("webpack.config.js")
      ) {
        score += 0.3;
      }

      if (
        signals.directories.has("public") ||
        signals.directories.has("static")
      ) {
        score += 0.1;
      }

      return clamp(score);
    },
  },

  {
    name: "Backend API",
    check: (signals) => {
      let score = 0;

      const backendKeywords = [
        "api",
        "server",
        "routes",
        "controllers",
        "middleware",
        "handlers",
      ];

      const hasBackendStructure = backendKeywords.some((keyword) =>
        Array.from(signals.directories).some((dir) =>
          dir.toLowerCase().includes(keyword),
        ),
      );

      if (hasBackendStructure) score += 0.5;

      const hasFrontend =
        signals.extensions.has("html") ||
        signals.extensions.has("tsx") ||
        signals.extensions.has("jsx");

      if (!hasFrontend) score += 0.3;

      if (
        signals.allFiles.some(
          (file) =>
            file.includes("server") ||
            file.includes("app.py") ||
            file.includes("main.go"),
        )
      ) {
        score += 0.2;
      }

      return clamp(score);
    },
  },

  {
    name: "CLI Tool",
    check: (signals) => {
      let score = 0;

      if (
        signals.allFiles.some(
          (file) =>
            file.includes("cli") ||
            file.includes("cmd") ||
            file.endsWith("main.go") ||
            file.endsWith("__main__.py") ||
            file.includes("bin/"),
        )
      ) {
        score += 0.6;
      }

      if (signals.directories.has("bin") || signals.directories.has("cmd")) {
        score += 0.2;
      }

      const hasWebFiles =
        signals.extensions.has("html") ||
        signals.extensions.has("css") ||
        signals.configFiles.has("next.config.js");

      if (!hasWebFiles) score += 0.2;

      return clamp(score);
    },
  },

  {
    name: "Library",
    check: (signals) => {
      let score = 0;

      if (
        signals.directories.has("lib") ||
        signals.directories.has("src/lib") ||
        signals.directories.has("pkg")
      ) {
        score += 0.4;
      }

      if (signals.hasTests) {
        score += 0.3;
      }

      const hasEntryPoint =
        signals.entryCandidates.length > 0 ||
        signals.allFiles.some((file) => file.match(/main\.|server\.|app\./));

      if (!hasEntryPoint) {
        score += 0.3;
      }

      return clamp(score);
    },
  },

  {
    name: "Machine Learning Project",
    check: (signals) => {
      let score = 0;

      if (signals.extensions.has("ipynb")) score += 0.4;

      const mlDirs = ["models", "data", "notebooks", "training", "datasets"];
      if (
        mlDirs.some((dir) =>
          Array.from(signals.directories).some((d) => d.includes(dir)),
        )
      ) {
        score += 0.3;
      }

      if (signals.extensions.has("py")) score += 0.2;

      if (
        signals.configFiles.has("requirements.txt") ||
        signals.configFiles.has("pyproject.toml")
      ) {
        score += 0.1;
      }

      return clamp(score);
    },
  },

  {
    name: "Script / Utility",
    check: (signals) => {
      let score = 0;

      if (signals.allFiles.length < 10) score += 0.4;

      if (
        signals.extensions.has("sh") ||
        signals.extensions.has("bash") ||
        signals.extensions.has("py")
      ) {
        score += 0.3;
      }

      if (signals.directories.size < 3) score += 0.3;

      return clamp(score);
    },
  },
];

export function detectProjectType(signals: FileSignals): ProjectTypeResult {
  let maxConfidence = 0;
  let detectedType = "General Software Repository";

  for (const rule of projectTypeRules) {
    const confidence = rule.check(signals);

    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      detectedType = rule.name;
    }
  }

  if (maxConfidence < 0.5) {
    return {
      projectType: "General Software Repository",
      confidence: 0.35,
    };
  }

  return {
    projectType: detectedType,
    confidence: maxConfidence,
  };
}
