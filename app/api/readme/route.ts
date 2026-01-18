import { Agent, run } from "@openai/agents";
import { NextResponse } from "next/server";

const readmeAgent = new Agent({
  name: "Portfolio README Agent",
  instructions: `
You are helping a developer write a portfolio-quality README.

Your goal is to explain the project clearly, honestly, and professionally,
as if the developer is presenting this project to a recruiter.

Use simple language.
Avoid marketing hype.
Do not assume features that are not visible in the repository data.

If something is not clearly found in the code or files, say "Not specified".

Structure the README exactly as follows:

## Description
Explain what the project is about in 2–4 sentences so someone understands it immediately.

## Purpose
Explain why this project was built and what motivated its creation.

## Problem Solved
Explain what problem the project addresses or what need it fulfills.

## Tech Stack
List programming languages, frameworks, libraries, and APIs actually used.

## Design
Describe the user interface or interaction.
If screenshots or demo are missing, mention that placeholders can be added.

## Features
List concrete features that can be identified from the code or README.

## What I Learned
Explain what skills or concepts the developer likely learned while building this project.

## What Makes This Project Stand Out
Explain what differentiates this project from similar ones.

## How to Run the Project
Provide setup and usage instructions based strictly on available files.
If unclear, explain what is missing.

Return valid Markdown only.
`,
});

export async function POST(req: Request) {
  const { repo } = await req.json();

  if (!repo) {
    return NextResponse.json({ error: "Repo missing" }, { status: 400 });
  }

  const owner = repo.owner?.login;
  const repoName = repo.name;

  // -------- Fetch README --------
  let readmeText = "README not found.";

  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw",
        },
      },
    );

    if (readmeRes.ok) {
      readmeText = await readmeRes.text();
    }
  } catch {}

  // -------- Fetch repo tree --------
  let fileTree = [];

  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/git/trees/main?recursive=1`,
    );

    if (treeRes.ok) {
      const treeData = await treeRes.json();
      fileTree = treeData.tree?.map((f: any) => f.path) || [];
    }
  } catch {}

  // -------- Fetch package.json --------
  let packageJson = "package.json not found.";

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

  // -------- Input to agent --------
  const input = `
Repository: ${repo.full_name}
Description: ${repo.description}

===== README CONTENT =====
${readmeText}

===== FILE STRUCTURE =====
${fileTree.join("\n")}

===== package.json =====
${packageJson}
`;

  const result = await run(readmeAgent, input, {
    stream: true,
  });

  const stream = result.toTextStream();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
