// Extract raw signals from repository file tree

export interface FileSignals {
  extensions: Map<string, number>;
  configFiles: Set<string>;
  directories: Set<string>;
  dependencyFiles: string[];
  entryCandidates: string[];
  hasTests: boolean;
  hasReadme: boolean;
  allFiles: string[];
}

export function extractSignals(filePaths: string[]): FileSignals {
  const extensions = new Map<string, number>();
  const configFiles = new Set<string>();
  const directories = new Set<string>();
  const dependencyFiles: string[] = [];
  const entryCandidates: string[] = [];

  let hasTests = false;
  let hasReadme = false;

  const knownConfigFiles = new Set([
    "package.json",
    "tsconfig.json",
    "requirements.txt",
    "pyproject.toml",
    "go.mod",
    "Cargo.toml",
    "pom.xml",
    "build.gradle",
    "composer.json",
    "Gemfile",
    "next.config.js",
    "next.config.ts",
    "vite.config.js",
    "vite.config.ts",
    "webpack.config.js",
    "rollup.config.js",
    "manage.py",
    "setup.py",
    "Dockerfile",
    "docker-compose.yml",
    ".eslintrc.js",
    ".prettierrc",
    "jest.config.js",
    "tailwind.config.js",
  ]);

  const dependencyFileNames = new Set([
    "package.json",
    "requirements.txt",
    "pyproject.toml",
    "go.mod",
    "Cargo.toml",
    "pom.xml",
    "build.gradle",
    "composer.json",
    "Gemfile",
  ]);

  const entryFilePatterns = [
    /^index\.(js|ts)$/,
    /^main\.py$/,
    /^app\.py$/,
    /^server\.(js|ts)$/,
    /^cli\.(js|ts)$/,
  ];

  for (const filePath of filePaths) {
    const parts = filePath.split("/");

    // ---------------------------
    // Directory structure
    // ---------------------------
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i++) {
        directories.add(parts.slice(0, i + 1).join("/"));
      }
    }

    const fileName = parts[parts.length - 1];

    // ---------------------------
    // README detection
    // ---------------------------
    if (fileName.toLowerCase() === "readme.md") {
      hasReadme = true;
    }

    // ---------------------------
    // Test detection
    // ---------------------------
    if (
      filePath.includes("__tests__") ||
      filePath.includes("/test") ||
      filePath.includes("/tests")
    ) {
      hasTests = true;
    }

    // ---------------------------
    // Config files
    // ---------------------------
    if (knownConfigFiles.has(fileName)) {
      configFiles.add(fileName);
    }

    // ---------------------------
    // Dependency files
    // ---------------------------
    if (dependencyFileNames.has(fileName)) {
      dependencyFiles.push(filePath);
    }

    // ---------------------------
    // Entry point candidates
    // ---------------------------
    if (entryFilePatterns.some((pattern) => pattern.test(fileName))) {
      entryCandidates.push(filePath);
    }

    // ---------------------------
    // File extensions
    // ---------------------------
    const extMatch = fileName.match(/\.([^.]+)$/);
    if (extMatch) {
      const ext = extMatch[1].toLowerCase();
      extensions.set(ext, (extensions.get(ext) || 0) + 1);
    }
  }

  return {
    extensions,
    configFiles,
    directories,
    dependencyFiles,
    entryCandidates,
    hasTests,
    hasReadme,
    allFiles: filePaths,
  };
}
