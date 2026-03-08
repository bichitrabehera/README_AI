import OpenAI from "openai";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const openai = new OpenAI({
  // baseURL: "http://localhost:12434/v1",
});

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type TreeNode = { [key: string]: TreeNode };

interface RepoSummary {
  language: string;
  framework: string;
  projectType: string;
  packageManager: string;
}

function analyzeRepository(filePaths: string[]): RepoSummary {
  const files = filePaths.map((f) => f.toLowerCase());

  // --- Language ---
  const language = files.some((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
    ? "TypeScript"
    : files.some((f) => f.endsWith(".js") || f.endsWith(".jsx"))
      ? "JavaScript"
      : files.some((f) => f.endsWith(".py"))
        ? "Python"
        : files.some((f) => f.endsWith(".go"))
          ? "Go"
          : files.some((f) => f.endsWith(".rs"))
            ? "Rust"
            : files.some((f) => f.endsWith(".java"))
              ? "Java"
              : "Unknown";

  // --- Framework ---
  const framework = files.some((f) => f.includes("next.config"))
    ? "Next.js"
    : files.some((f) => f.includes("vite.config"))
      ? "Vite + React"
      : files.some((f) => f.includes("nuxt.config"))
        ? "Nuxt.js"
        : files.some((f) => f.includes("svelte.config"))
          ? "SvelteKit"
          : files.some((f) => f.includes("angular.json"))
            ? "Angular"
            : files.some((f) => f.includes("manage.py"))
              ? "Django"
              : files.some(
                    (f) =>
                      f.includes("requirements.txt") || f.includes("app.py"),
                  )
                ? "Flask / FastAPI"
                : files.some((f) => f.endsWith("go.mod"))
                  ? "Go Modules"
                  : files.some((f) => f.includes("cargo.toml"))
                    ? "Cargo (Rust)"
                    : files.some((f) => f.includes("pom.xml"))
                      ? "Maven (Java)"
                      : files.some((f) => f.includes("build.gradle"))
                        ? "Gradle (Java)"
                        : "Unknown";

  // --- Project Type ---
  const projectType = files.some(
    (f) => f.includes("app/") || f.includes("pages/"),
  )
    ? "Web Application"
    : files.some(
          (f) =>
            f.includes("api/") ||
            f.includes("routes/") ||
            f.includes("controllers/"),
        )
      ? "REST API / Backend"
      : files.some((f) => f.includes("cli") || f.includes("cmd/"))
        ? "CLI Tool"
        : files.some(
              (f) =>
                f.includes("lib/") ||
                f.includes("index.ts") ||
                f.includes("index.js"),
            )
          ? "Library / Package"
          : "General Project";

  // --- Package Manager ---
  const packageManager = files.includes("bun.lockb")
    ? "bun"
    : files.includes("pnpm-lock.yaml")
      ? "pnpm"
      : files.includes("yarn.lock")
        ? "yarn"
        : "npm";

  return { language, framework, projectType, packageManager };
}

function generateFileTree(paths: string[]): string {
  const tree: TreeNode = {};

  paths.forEach((path) => {
    const parts = path.split("/");
    let current: TreeNode = tree;
    parts.forEach((part) => {
      if (!current[part]) current[part] = {};
      current = current[part];
    });
  });

  function buildString(node: TreeNode, prefix = ""): string {
    const keys = Object.keys(node).sort();
    let result = "";
    keys.forEach((key, index) => {
      const isLast = index === keys.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childPrefix = isLast ? "    " : "│   ";
      result += `${prefix}${connector}${key}\n`;
      result += buildString(node[key], prefix + childPrefix);
    });
    return result;
  }

  return buildString(tree);
}

export async function POST(req: Request) {
  try {
    const { repo, description } = await req.json();

    if (!repo?.owner?.login || !repo?.name) {
      return NextResponse.json(
        { error: "Invalid repository" },
        { status: 400 },
      );
    }

    const owner: string = repo.owner.login;
    const repoName: string = repo.name;

    // ------------------------------------------------
    // 0. Fetch existing README if present
    // ------------------------------------------------
    let existingReadme: string | null = null;

    try {
      const { data: readmeData } = await octokit.repos.getReadme({
        owner,
        repo: repoName,
      });

      if (readmeData?.content) {
        existingReadme = Buffer.from(readmeData.content, "base64").toString(
          "utf-8",
        );
      }
    } catch {
      // No README exists, continue
    }

    // ------------------------------------------------
    // 1. Fetch repository tree
    // ------------------------------------------------
    let filePaths: string[] = [];

    try {
      const { data: repoData } = await octokit.repos.get({
        owner,
        repo: repoName,
      });

      const defaultBranch = repoData.default_branch ?? "main";

      const { data: treeData } = await octokit.git.getTree({
        owner,
        repo: repoName,
        tree_sha: defaultBranch,
        recursive: "1",
      });

      filePaths = (treeData.tree ?? [])
        .filter((item) => item.type === "blob" && typeof item.path === "string")
        .map((item) => item.path as string);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch repository tree" },
        { status: 500 },
      );
    }

    if (filePaths.length === 0) {
      return NextResponse.json(
        { error: "Repository contains no files" },
        { status: 400 },
      );
    }

    // ------------------------------------------------
    // 2. Analyze repository
    // ------------------------------------------------
    const summary = analyzeRepository(filePaths);

    // ------------------------------------------------
    // 3. Folder structure (Tree view)
    // ------------------------------------------------
    const treeView = generateFileTree(filePaths.slice(0, 100));

    // ------------------------------------------------
    // 4. Build prompt
    // ------------------------------------------------
    const prompt = `
      You are an elite Senior Software Engineer and Technical Writer.
      Your task is to generate a **Resume-Level** README.md for this GitHub repository. 
      This README should be suitable for a portfolio, impressing recruiters and hiring managers.

      **Goal:** Position this project as a high-quality, professional software engineering artifact.

      **Repository Context:**
      - Owner: ${owner}
      - Name: ${repoName}
      - Detected Language: ${summary.language}
      - Detected Framework: ${summary.framework}
      - Project Type: ${summary.projectType}
      - Package Manager: ${summary.packageManager}
      
      **Source Material:**
      - User Provided Description (High Priority): ${description || "None provided"}
      - Existing README (reference): ${existingReadme ? existingReadme.slice(0, 1000) : "None"}
      - File Structure (inference): 
      ${treeView}

      **Strict Guidelines for "Resume-Level" Quality:**
      1.  **Professional Tone:** Confident, technical, and concise. No fluff.
      2.  **Problem-First Approach:** Explain *why* this exists before *how* it works.
      3.  **Visual Appeal:** Use badges, emojis (tastefully), and clear section headers.
      4.  **Architectural Insight:** Infer the architecture from the file tree.

      **Required Structure (in Markdown):**

      # ${repoName} 🚀

      ![GitHub license](https://img.shields.io/github/license/${owner}/${repoName})
      ![GitHub stars](https://img.shields.io/github/stars/${owner}/${repoName})
      ![GitHub issues](https://img.shields.io/github/issues/${owner}/${repoName})

      > *A brief, high-impact tagline summarizing the project.*

      ## 📖 Introduction
      ## ✨ Key Features
      ## 🛠️ Tech Stack
      ## 📂 Project Structure
      ## 🚀 Getting Started

      Use ${summary.packageManager} for install commands.

      ### Prerequisites
      ### Installation
      ### Running Locally

      ## 🤝 Contributing
      ## 📄 License

      ---
      *Generated with ❤️ by Readme.AI*
    `;

    // ------------------------------------------------
    // 5. Generate README
    // ------------------------------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      mode: existingReadme ? "enhanced" : "generated",
      summary,
      fileTree: treeView,
      readme: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
