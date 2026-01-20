import OpenAI from "openai";
import { NextResponse } from "next/server";
import { analyzeRepository } from "@/libs";

const openai = new OpenAI({
  apiKey: "local",
  baseURL: "http://localhost:12434/v1",
});

type TreeNode = { [key: string]: TreeNode };
interface GitTreeItem {
  type: "blob" | "tree";
  path: string;
}

function generateFileTree(paths: string[]): string {
  const tree: TreeNode = {};

  paths.forEach((path) => {
    const parts = path.split("/");
    let current: TreeNode = tree;
    parts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
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

    const owner = repo.owner.login;
    const repoName = repo.name;

    // ------------------------------------------------
    // 0. Fetch existing README if present
    // ------------------------------------------------
    let existingReadme: string | null = null;

    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData?.content) {
        existingReadme = Buffer.from(readmeData.content, "base64").toString(
          "utf-8",
        );
      }
    }

    // ------------------------------------------------
    // 1. Fetch repository tree
    // ------------------------------------------------
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`,
    );

    if (!treeRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repository tree" },
        { status: 500 },
      );
    }

    const treeData = await treeRes.json();

    const rawTree: unknown = (treeData as { tree?: unknown }).tree;

    function isGitTreeItem(x: unknown): x is GitTreeItem {
      if (typeof x !== "object" || x === null) return false;
      const obj = x as { type?: unknown; path?: unknown };
      const typeValid =
        obj.type === "blob" || obj.type === "tree";
      const pathValid = typeof obj.path === "string";
      return typeValid && pathValid;
    }

    const treeItems: GitTreeItem[] = Array.isArray(rawTree)
      ? rawTree.filter(isGitTreeItem)
      : [];

    const filePaths: string[] = treeItems
      .filter((item) => item.type === "blob")
      .map((item) => item.path);

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
    // Take up to 100 files to build a representative tree
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
      
      **Source Material:**
      - User Provided Description (High Priority): ${description || "None provided"}
      - Existing README (reference): ${existingReadme ? existingReadme.slice(0, 1000) : "None"}
      - File Structure (inference): 
      ${treeView}

      **Strict Guidelines for "Resume-Level" Quality:**
      1.  **Professional Tone:** Confident, technical, and concise. No fluff.
      2.  **Problem-First Approach:** Explain *why* this exists before *how* it works. If the user provided a description, use it as the core of the introduction.
      3.  **Visual Appeal:** Use badges, emojis (tastefully), and clear section headers.
      4.  **Architectural Insight:** Infer the architecture (e.g., "Next.js App Router," "REST API," "Microservices") from the file tree.

      **Required Structure (in Markdown):**

      # ${repoName} 🚀

      ![GitHub license](https://img.shields.io/github/license/${owner}/${repoName})
      ![GitHub stars](https://img.shields.io/github/stars/${owner}/${repoName})
      ![GitHub issues](https://img.shields.io/github/issues/${owner}/${repoName})

      > *A brief, high-impact tagline summarizing the project.*

      ## 📖 Introduction
      A professional executive summary. What problem does this solve? Who is it for?
      (Infer this from the code structure and file names).

      ## ✨ Key Features
      - **Feature 1**: Description...
      - **Feature 2**: Description...
      - **Feature 3**: Description...
      (Identify these from folder names like 'auth', 'api', 'components', etc.)

      ## 🛠️ Tech Stack
      - **Languages**: ${summary.language}
      - **Frameworks**: ${summary.framework}
      - **Tools**: (Infer tools like Docker, Tailwind, Prisma from file names)

      ## 📂 Project Structure
      \`\`\`bash
      ${treeView.split("\n").slice(0, 15).join("\n")}
      ...
      \`\`\`

      ## 🚀 Getting Started

      **Important:** Generate the "Getting Started" section based *strictly* on the detected language and framework (${summary.language} / ${summary.framework}).
      
      - If Node.js/JS/TS: Show npm install and npm run dev (or yarn/pnpm/bun if lockfiles are present).
      - If Python: Show pip install -r requirements.txt or poetry install.
      - If Go: Show go mod download and go run .
      - If Rust: Show cargo build and cargo run.
      - If Java/Maven/Gradle: Show ./mvnw install or ./gradlew build. 
      - If unknown, provide generic instructions.

      ### Prerequisites
      List prerequisites compatible with the tech stack (e.g., Node.js version, Python version, Docker, etc.).

      ### Installation
      Provide the exact commands to clone and install dependencies.

      ### Running Locally
      Provide the command to start the development server or run the app.

      ## 🤝 Contributing
      Contributions are welcome! Please check out the [issues](https://github.com/${owner}/${repoName}/issues) page.

      ## 📄 License
      Distributed under the MIT License. See \`LICENSE\` for more information.

      ---
      *Generated with ❤️ by Readme.AI*
    `;

    // ------------------------------------------------
    // 5. Generate README
    // ------------------------------------------------
    const completion = await openai.chat.completions.create({
      model: "qwen3-vl:2B-UD-Q4_K_XL",
      temperature: 0.3, // Lower temperature for more consistent formatting
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
