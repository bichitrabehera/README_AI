import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session.accessToken) {
    return NextResponse.json({ message: "not authorized" }, { status: 401 });
  }

  const { owner, repo, content, message } = await req.json();

  const token = session.accessToken;

  const readme = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  let sha = undefined;

  if (readme.ok) {
    const data = await readme.json();
    sha = data.sha;
  }

  const commitReadme = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content).toString("base64"),
        sha,
      }),
    },
  );
  if (!commitReadme.ok) {
    const err = await commitReadme.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
