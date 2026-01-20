// Detect framework using file patterns and dependency analysis

import { FileSignals } from "./signals";
import * as fs from "fs";
import * as path from "path";

export interface FrameworkResult {
  framework: string | null;
  confidence: number;
}

interface FrameworkRule {
  name: string;
  signals: {
    configFiles?: string[];
    directoryPatterns?: string[];
    filePatterns?: string[];
    dependencies?: string[];
  };
  weight: number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

const frameworkRules: FrameworkRule[] = [
  // -----------------------
  // JavaScript / TypeScript
  // -----------------------
  {
    name: "Next.js",
    signals: {
      configFiles: ["next.config.js", "next.config.ts"],
      directoryPatterns: ["app", "pages"],
      filePatterns: [
        "app/page.tsx",
        "app/layout.tsx",
        "pages/_app.tsx",
        "pages/index.tsx",
      ],
      dependencies: ["next"],
    },
    weight: 0.95,
  },
  {
    name: "React",
    signals: {
      dependencies: ["react"],
      filePatterns: ["src/App.tsx", "src/App.jsx"],
    },
    weight: 0.8,
  },
  {
    name: "Vue",
    signals: {
      dependencies: ["vue"],
      filePatterns: ["src/App.vue"],
      configFiles: ["vue.config.js"],
    },
    weight: 0.85,
  },
  {
    name: "Angular",
    signals: {
      dependencies: ["@angular/core"],
      configFiles: ["angular.json"],
    },
    weight: 0.95,
  },
  {
    name: "Svelte",
    signals: {
      dependencies: ["svelte"],
      configFiles: ["svelte.config.js"],
    },
    weight: 0.8,
  },

  // -----------------------
  // Backend frameworks
  // -----------------------
  {
    name: "Express",
    signals: {
      dependencies: ["express"],
    },
    weight: 0.7,
  },
  {
    name: "NestJS",
    signals: {
      dependencies: ["@nestjs/core"],
      configFiles: ["nest-cli.json"],
    },
    weight: 0.9,
  },

  // -----------------------
  // Python
  // -----------------------
  {
    name: "Django",
    signals: {
      filePatterns: ["manage.py"],
      dependencies: ["django"],
    },
    weight: 0.95,
  },
  {
    name: "Flask",
    signals: {
      dependencies: ["flask"],
    },
    weight: 0.75,
  },
  {
    name: "FastAPI",
    signals: {
      dependencies: ["fastapi"],
    },
    weight: 0.85,
  },

  // -----------------------
  // Other
  // -----------------------
  {
    name: "Spring Boot",
    signals: {
      dependencies: ["spring-boot"],
    },
    weight: 0.9,
  },
  {
    name: "Rails",
    signals: {
      dependencies: ["rails"],
      filePatterns: ["config/routes.rb"],
    },
    weight: 0.9,
  },
];

function checkDependencies(
  dependencyFilePath: string,
  dependencies: string[]
): boolean {
  try {
    const content = fs.readFileSync(dependencyFilePath, "utf-8");

    if (dependencyFilePath.endsWith("package.json")) {
      const pkg = JSON.parse(content);
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };
      return dependencies.some((dep) => dep in allDeps);
    }

    return dependencies.some((dep) =>
      content.toLowerCase().includes(dep.toLowerCase())
    );
  } catch {
    return false;
  }
}

export function detectFramework(
  signals: FileSignals,
  projectRoot: string
): FrameworkResult {
  let maxConfidence = 0;
  let detectedFramework: string | null = null;

  for (const rule of frameworkRules) {
    let score = 0;
    let checks = 0;

    if (rule.signals.configFiles) {
      checks++;
      if (
        rule.signals.configFiles.some((file) =>
          signals.configFiles.has(file)
        )
      ) {
        score += 1;
      }
    }

    if (rule.signals.directoryPatterns) {
      checks++;
      if (
        rule.signals.directoryPatterns.some((pattern) =>
          Array.from(signals.directories).some((dir) =>
            dir.includes(pattern)
          )
        )
      ) {
        score += 1;
      }
    }

    if (rule.signals.filePatterns) {
      checks++;
      if (
        rule.signals.filePatterns.some((pattern) =>
          signals.allFiles.some((file) =>
            file.includes(pattern)
          )
        )
      ) {
        score += 1;
      }
    }

    if (
      rule.signals.dependencies &&
      signals.dependencyFiles.length > 0
    ) {
      checks++;
      if (
        signals.dependencyFiles.some((depFile) =>
          checkDependencies(
            path.join(projectRoot, depFile),
            rule.signals.dependencies!
          )
        )
      ) {
        score += 1;
      }
    }

    if (checks > 0) {
      const confidence = clamp(
        (score / checks) * rule.weight
      );

      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        detectedFramework = rule.name;
      }
    }
  }

  if (maxConfidence < 0.4) {
    return {
      framework: null,
      confidence: 0,
    };
  }

  return {
    framework: detectedFramework,
    confidence: maxConfidence,
  };
}
