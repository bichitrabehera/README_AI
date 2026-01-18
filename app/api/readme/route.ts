import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { repo } = await req.json();

  const prompt = `
You are a senior software engineer.

Generate a professional README.md for a GitHub repository.

Repository name: ${repo.name}
Description: ${repo.description}
Primary language: ${repo.language}

Include:
- Project overview
- Features
- Tech stack
- Installation
- Usage
- Screenshots section
- Future improvements
- Contributing section

Return markdown only.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    readme: completion.choices[0].message.content,
  });
}
