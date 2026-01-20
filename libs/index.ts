// Main entry point for repository analyzer

import { extractSignals } from "./signals";
import { detectLanguage } from "./detectLanguage";
import { detectEcosystem } from "./detectEcosystem";
import { detectFramework } from "./detectFramework";
import { detectProjectType } from "./detectProjectType";
import { buildSummary } from "./buildSummary";
import type { RepositorySummary } from "./buildSummary";

/**
 * Analyze a repository and generate a structured summary
 *
 * @param filePaths - Array of file paths in the repository
 * @param projectRoot - Root directory of the project (for reading dependency files)
 * @returns Structured repository summary with confidence scores
 */
export function analyzeRepository(
  filePaths: string[],
  projectRoot: string = process.cwd()
): RepositorySummary {
  // 1. Extract raw signals
  const signals = extractSignals(filePaths);

  // 2. Language detection
  const languageResult = detectLanguage(signals);

  // 3. Ecosystem detection
  const ecosystemResult = detectEcosystem(signals);

  // 4. Framework detection
  const frameworkResult = detectFramework(signals, projectRoot);

  // 5. Project type detection
  const projectTypeResult = detectProjectType(signals);

  // 6. Build final summary
  return buildSummary(
    signals,
    languageResult,
    ecosystemResult,
    frameworkResult,
    projectTypeResult,
    projectRoot
  );
}

// -------------------------------
// Named exports
// -------------------------------
export { extractSignals } from "./signals";
export { detectLanguage } from "./detectLanguage";
export { detectEcosystem } from "./detectEcosystem";
export { detectFramework } from "./detectFramework";
export { detectProjectType } from "./detectProjectType";
export { buildSummary } from "./buildSummary";

// -------------------------------
// Types
// -------------------------------
export type { RepositorySummary } from "./buildSummary";
export type { FileSignals } from "./signals";
export type { LanguageResult } from "./detectLanguage";
export type { EcosystemResult } from "./detectEcosystem";
export type { FrameworkResult } from "./detectFramework";
export type { ProjectTypeResult } from "./detectProjectType";
