import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: "local",
  baseURL: "http://localhost:12434/v1",
});

export async function POST(req: Request) {
  const { repo } = await req.json();

  if (!repo) {
    return NextResponse.json({ error: "Repo missing" }, { status: 400 });
  }

  const owner = repo.owner?.login;
  const repoName = repo.name;

  // ---------------- FILE TREE ----------------
  let fileTree: string[] = [];

  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`,
    );

    if (treeRes.ok) {
      const treeData = await treeRes.json();
      fileTree = treeData.tree?.map((f: { path: string }) => f.path) || [];
    }
  } catch {}

  const importantFiles = fileTree
    .filter(
      (f) =>
        f.endsWith("package.json") ||
        f.endsWith("index.js") ||
        f.includes("src"),
    )
    .slice(0, 20);

  // ---------------- package.json ----------------
  let packageJson = "Not specified.";

  try {
    const pkgRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/package.json`,
      {
        headers: {
          Accept: "application/vnd.github.raw",
        },
      },
    );

    if (pkgRes.ok) {
      packageJson = await pkgRes.text();
    }
  } catch {}

  // ---------------- PROMPT ----------------
  const prompt = `
    Generate a README.md in Markdown.

    Write new content only.
    Do not repeat the input.
    Do not ask questions.

    If information is missing, write "Not specified".

    Use this structure exactly:

    ## Description
    ## Purpose
    ## Problem Solved
    ## Tech Stack
    ## Design
    ## Features
    ## What I Learned
    ## How to Run the Project

    Repository: ${repo.full_name}
    Description: ${repo.description}

    Important files:
    ${importantFiles.join("\n")}

    package.json:
    ${packageJson}
    `;

  // ---------------- AI ----------------
  const completion = await openai.chat.completions.create({
    model: "ai/smollm2:latest",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    readme: completion.choices[0].message.content,
  });
}
