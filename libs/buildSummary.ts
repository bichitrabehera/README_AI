// Build final repository summary from all detections

import { FileSignals } from "./signals";
import { LanguageResult } from "./detectLanguage";
import { EcosystemResult } from "./detectEcosystem";
import { FrameworkResult } from "./detectFramework";
import { ProjectTypeResult } from "./detectProjectType";
import * as fs from "fs";
import * as path from "path";

export interface RepositorySummary {
  language: string;
  ecosystem: string;
  framework: string | null;
  projectType: string;
  dependencies: string[];
  entryPoint: string | null;
  confidence: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/* ----------------------------------
   Dependency extraction
----------------------------------- */

function extractDependencies(dependencyFilePath: string): string[] {
  try {
    const content = fs.readFileSync(dependencyFilePath, "utf-8");

    if (dependencyFilePath.endsWith("package.json")) {
      const pkg = JSON.parse(content);
      return Array.from(
        new Set([
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.devDependencies || {}),
        ])
      );
    }

    if (dependencyFilePath.endsWith("requirements.txt")) {
      return content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"))
        .map((l) => l.split(/[<>=!]/)[0].trim());
    }

    if (dependencyFilePath.endsWith("pyproject.toml")) {
      const deps: string[] = [];
      const lines = content.split("\n");
      let active = false;

      for (const line of lines) {
        if (line.match(/\[.*dependencies.*\]/i)) {
          active = true;
          continue;
        }
        if (active && line.startsWith("[")) break;

        if (active && line.includes("=")) {
          deps.push(line.split("=")[0].trim().replace(/"/g, ""));
        }
      }

      return deps;
    }

    if (dependencyFilePath.endsWith("go.mod")) {
      return content
        .split("\n")
        .filter((l) => l.trim() && !l.startsWith("//"))
        .map((l) => l.split(/\s+/)[0])
        .filter((l) => l.includes("/"));
    }

    if (dependencyFilePath.endsWith("Cargo.toml")) {
      const deps: string[] = [];
      const lines = content.split("\n");
      let active = false;

      for (const line of lines) {
        if (line.trim() === "[dependencies]") {
          active = true;
          continue;
        }
        if (active && line.startsWith("[")) break;

        if (active && line.includes("=")) {
          deps.push(line.split("=")[0].trim());
        }
      }

      return deps;
    }

    return [];
  } catch {
    return [];
  }
}

/* ----------------------------------
   Entry point detection
----------------------------------- */

function findEntryPoint(
  signals: FileSignals,
  language: string,
  framework: string | null
): string | null {
  const files = signals.allFiles;

  if (framework === "Next.js") {
    const nextEntries = [
      "app/page.tsx",
      "pages/index.tsx",
      "pages/index.js",
    ];
    return files.find((f) =>
      nextEntries.some((e) => f.endsWith(e))
    ) || null;
  }

  if (framework === "React") {
    const reactEntries = [
      "src/index.tsx",
      "src/index.jsx",
      "src/index.js",
    ];
    return files.find((f) =>
      reactEntries.some((e) => f.endsWith(e))
    ) || null;
  }

  if (framework === "Vue") {
    return (
      files.find((f) => f.endsWith("src/main.ts")) ||
      files.find((f) => f.endsWith("src/main.js")) ||
      files.find((f) => f.endsWith("src/App.vue")) ||
      null
    );
  }

  if (language === "Python") {
    return (
      files.find((f) =>
        ["main.py", "app.py", "__main__.py", "manage.py"].some((e) =>
          f.endsWith(e)
        )
      ) || null
    );
  }

  if (language === "Go") {
    return files.find((f) => f.endsWith("main.go")) || null;
  }

  if (language === "Rust") {
    return (
      files.find((f) => f.endsWith("src/main.rs")) ||
      files.find((f) => f.endsWith("src/lib.rs")) ||
      null
    );
  }

  if (language === "Java") {
    return (
      files.find((f) =>
        f.endsWith("Application.java") || f.endsWith("Main.java")
      ) || null
    );
  }

  return (
    files.find((f) =>
      ["index.ts", "index.js", "index.html"].some((e) =>
        f.endsWith(e)
      )
    ) || null
  );
}

/* ----------------------------------
   Final summary builder
----------------------------------- */

export function buildSummary(
  signals: FileSignals,
  languageResult: LanguageResult,
  ecosystemResult: EcosystemResult,
  frameworkResult: FrameworkResult,
  projectTypeResult: ProjectTypeResult,
  projectRoot: string
): RepositorySummary {
  let dependencies: string[] = [];

  if (signals.dependencyFiles.length > 0) {
    const depFile = signals.dependencyFiles[0];
    dependencies = extractDependencies(
      path.join(projectRoot, depFile)
    );
  }

  const entryPoint = findEntryPoint(
    signals,
    languageResult.language,
    frameworkResult.framework
  );

  const confidence = clamp(
    languageResult.confidence * 0.25 +
      ecosystemResult.confidence * 0.2 +
      frameworkResult.confidence * 0.25 +
      projectTypeResult.confidence * 0.3
  );

  return {
    language: languageResult.language,
    ecosystem: ecosystemResult.ecosystem,
    framework: frameworkResult.framework,
    projectType: projectTypeResult.projectType,
    dependencies,
    entryPoint,
    confidence: Number(confidence.toFixed(2)),
  };
}
