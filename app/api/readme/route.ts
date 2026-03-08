import OpenAI from "openai";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { checkRateLimit, recordUsage } from "@/middlewares/rateLimit";
import { analyzeRepository } from "@/libs/analyzeRepository";
import { generateFileTree } from "@/libs/generateFileTree";

const openai = new OpenAI({
  // baseURL: "http://localhost:12434/v1",
});

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function POST(req: Request) {
  try {
    const rateLimitResult = await checkRateLimit();
    if (rateLimitResult instanceof NextResponse) return rateLimitResult;

    const userId = rateLimitResult;

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
  You are an expert Technical Writer and Senior Software Engineer specializing in open-source documentation.
  Your task is to generate a professional, developer-friendly README.md for a GitHub repository.

  **Repository Context:**
  - Owner: ${owner}
  - Repository Name: ${repoName}
  - Primary Language: ${summary.language}
  - Framework/Library: ${summary.framework}
  - Project Type: ${summary.projectType}
  - Package Manager: ${summary.packageManager}

  **Source Material:**
  - User Description (highest priority): ${description || "None provided"}
  - Existing README (for reference only): ${existingReadme ? existingReadme.slice(0, 1000) : "None"}
  - File Tree (use to infer architecture, features, and scripts):
  ${treeView}

  ---

  **Your Writing Principles:**
  - Be concise and scannable — developers skim READMEs, not read them.
  - Lead with value: explain *what* and *why* before *how*.
  - Use active voice and present tense.
  - Infer tech stack, scripts, and architecture intelligently from the file tree.
  - Only include sections that are relevant and non-empty. Skip sections you cannot fill meaningfully.
  - Use tasteful emojis in headers for visual hierarchy (not in body text).
  - Badges must use real shield.io URLs relevant to the repo.

  ---

  **README Structure to Follow:**

  # ${repoName}

  <!-- Badges row — include only applicable ones -->
  ![License](https://img.shields.io/github/license/${owner}/${repoName})
  ![Stars](https://img.shields.io/github/stars/${owner}/${repoName}?style=social)
  ![Issues](https://img.shields.io/github/issues/${owner}/${repoName})
  ![Last Commit](https://img.shields.io/github/last-commit/${owner}/${repoName})
  <!-- Add language/framework badge if detectable -->

  > **One-line tagline.** What it does and who it's for — max 20 words.

  ---

  ## 📌 Overview
  2–4 sentences. What problem does this solve? Who is it for? What makes it notable?
  Avoid marketing fluff. Be direct and technical.

  ## ✨ Features
  - Bullet list of 4–8 concrete, specific features.
  - Infer from file structure if not provided.
  - Focus on user/developer value, not implementation details.

  ## 🛠️ Tech Stack
  | Category | Technology |
  |----------|------------|
  | Language | ... |
  | Framework | ... |
  | ... | ... |
  Only include rows you can confidently fill.

  ## 📁 Project Structure
  \`\`\`
  Paste a trimmed, annotated version of the file tree.
  Add inline comments (# ...) to explain key directories/files.
  Keep it under 20 lines — omit node_modules, .git, build artifacts.
  \`\`\`

  ## 🚀 Getting Started

  ### Prerequisites
  - List runtime versions, tools, or accounts required.
  - Example: Node.js >= 18, a PostgreSQL database, an OpenAI API key.

  ### Installation
  \`\`\`bash
  git clone https://github.com/${owner}/${repoName}.git
  cd ${repoName}
  ${summary.packageManager} install
  \`\`\`

  ### Configuration
  If env variables are needed, show a .env.example block:
  \`\`\`env
  # Example — infer key names from file tree if possible
  API_KEY=your_key_here
  DATABASE_URL=your_db_url
  \`\`\`
  Skip this section entirely if no configuration is needed.

  ### Running the Project
  \`\`\`bash
  # Development
  ${summary.packageManager} run dev

  # Production build
  ${summary.packageManager} run build
  ${summary.packageManager} start
  \`\`\`
  Adjust commands based on what you detect in the file tree (e.g., Makefile, scripts/, Dockerfile).

  ## 🧪 Testing
  \`\`\`bash
  ${summary.packageManager} test
  \`\`\`
  Include only if test files or a test script are detected in the file tree.

  ## 🤝 Contributing
  1. Fork the repository
  2. Create a feature branch: \`git checkout -b feat/your-feature\`
  3. Commit with conventional commits: \`git commit -m "feat: add X"\`
  4. Push and open a Pull Request

  ## 📄 License
  Distributed under the [LICENSE NAME](./LICENSE) license.

  ---
  *Generated by [Readme.AI](https://github.com/${owner}/${repoName})*

  ---

  **Final rules:**
  - Output raw Markdown only. No explanations, no code fences wrapping the whole output.
  - Do not invent features, dependencies, or scripts you cannot infer from the provided context.
  - If a section cannot be meaningfully filled, omit it entirely rather than leaving placeholder text.
  - Ensure all code blocks specify the correct language for syntax highlighting.
`;

    // ------------------------------------------------
    // 5. Generate README
    // ------------------------------------------------
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    await recordUsage(userId);

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
