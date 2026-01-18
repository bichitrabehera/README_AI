import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  const { owner, repo, content, message } = await req.json();

  const token = session.accessToken;

  const readmeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
    },
  );

  let sha = undefined;

  if (readmeRes.ok) {
    const data = await readmeRes.json();
    sha = data.sha;
  }

  const commitRes = await fetch(
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

  const result = await commitRes.json();

  console.log("TOKEN:", token?.slice(0, 10));
  console.log("OWNER:", owner);
  console.log("REPO:", repo);
  console.log("MESSAGE:", message);
  console.log("CONTENT LENGTH:", content.length);

  if (!commitRes.ok) {
    return NextResponse.json({ error: result }, { status: 500 });
  }

  return NextResponse.json({ success: true, result });
}
