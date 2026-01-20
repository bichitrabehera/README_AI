# Repository Analyzer

A rule-based, deterministic repository analysis tool that generates structured summaries of GitHub repositories without using AI or external APIs.

## Overview

This analyzer examines a repository's file structure and generates a comprehensive summary including:

- **Language**: Primary programming language
- **Ecosystem**: Runtime environment (Node.js, Python, Go, etc.)
- **Framework**: Detected framework (Next.js, React, Django, etc.)
- **Project Type**: Classification (Web App, Backend API, CLI Tool, etc.)
- **Dependencies**: List of project dependencies
- **Entry Point**: Main file to execute
- **Confidence**: Overall confidence score (0-1)

## Architecture

The analyzer uses a multi-stage pipeline:

1. **Signal Extraction** (`signals.ts`)
   - Parse file paths
   - Count file extensions
   - Detect config files
   - Map directory structure

2. **Language Detection** (`detectLanguage.ts`)
   - Frequency analysis of file extensions
   - Ignore non-code files (JSON, MD, etc.)
   - Calculate confidence based on dominance

3. **Ecosystem Detection** (`detectEcosystem.ts`)
   - Match dependency files to ecosystems
   - Node.js → package.json
   - Python → requirements.txt
   - Go → go.mod

4. **Framework Detection** (`detectFramework.ts`)
   - Multi-signal matching (config files, directories, dependencies)
   - Read actual dependency files for verification
   - Weighted confidence scoring

5. **Project Type Detection** (`detectProjectType.ts`)
   - Heuristic-based classification
   - Multiple rules with confidence scores
   - Fallback to "General Software Repository"

6. **Summary Builder** (`buildSummary.ts`)
   - Extract dependencies from files
   - Find likely entry point
   - Calculate weighted confidence

## Usage

```typescript
import { analyzeRepository } from './repo-analyzer';

const filePaths = [
  'package.json',
  'next.config.js',
  'app/page.tsx',
  'app/layout.tsx',
  'public/favicon.ico',
];

const summary = analyzeRepository(filePaths, '/path/to/project');

console.log(JSON.stringify(summary, null, 2));
```

### Output Example

```json
{
  "language": "TypeScript",
  "ecosystem": "Node.js",
  "framework": "Next.js",
  "projectType": "Web Application",
  "dependencies": ["next", "react", "react-dom"],
  "entryPoint": "app/page.tsx",
  "confidence": 0.87
}
```

## How It Works

### No AI Required

All detection is purely rule-based:

- File extension mapping (`.ts` → TypeScript)
- Config file detection (`package.json` → Node.js)
- Directory pattern matching (`app/` → Next.js)
- Dependency parsing (read actual files)

### Confidence Scoring

Each detector returns a confidence score:

- **Language**: Based on file count dominance
- **Ecosystem**: Binary (file exists = 1.0)
- **Framework**: Weighted signals (0-1)
- **Project Type**: Heuristic scoring (0-1)

Final confidence is weighted average.

### Fallback Behavior

When confidence is low:

- Language → "Unknown"
- Ecosystem → "Unknown"
- Framework → null
- Project Type → "General Software Repository"

### Never Hallucinates

The analyzer only reports what it can detect from file signals. If a framework can't be determined with confidence, it returns `null` rather than guessing.

## Supported Technologies

### Languages
TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, C/C++, C#, Ruby, PHP, Swift, Scala, Shell

### Ecosystems
Node.js, Python, Go, Rust, Java, PHP, Ruby, Dart, Swift

### Frameworks
Next.js, React, Vue, Angular, Svelte, Express, NestJS, Django, Flask, FastAPI, Spring Boot, Rails

### Project Types
Web Application, Backend API, CLI Tool, Library, Machine Learning Project, Script/Utility, General Software Repository

## Running Examples

```bash
npx ts-node example.ts
```

This will run multiple test cases demonstrating different repository types.

## Design Principles

1. **Deterministic**: Same input always produces same output
2. **No Network**: Works offline, no API calls
3. **Rule-Based**: Explicit logic, no machine learning
4. **Transparent**: Clear confidence scores
5. **Extensible**: Easy to add new frameworks/languages
6. **Safe**: Never guesses or hallucinates

## Adding New Detections

### New Language

Edit `detectLanguage.ts`:

```typescript
const extensionToLanguage: Record<string, string> = {
  // ... existing
  dart: 'Dart',
};
```

### New Framework

Edit `detectFramework.ts`:

```typescript
const frameworkRules: FrameworkRule[] = [
  // ... existing
  {
    name: 'Remix',
    signals: {
      configFiles: ['remix.config.js'],
      dependencies: ['@remix-run/react'],
    },
    weight: 0.9,
  },
];
```

### New Project Type

Edit `detectProjectType.ts`:

```typescript
{
  name: 'Mobile App',
  check: (signals) => {
    // Custom detection logic
    return confidence;
  },
}
```

## Limitations

- Cannot detect frameworks without clear file signals
- Dependency extraction requires reading actual files
- No semantic code analysis (only file structure)
- Cannot determine framework versions
- May misclassify hybrid projects

## Use Cases

This analyzer is the internal reasoning layer for tools like:

- Automated README generators
- Repository categorization systems
- Project scaffolding tools
- Documentation generators
- Code search engines

No AI needed - just deterministic pattern matching.
