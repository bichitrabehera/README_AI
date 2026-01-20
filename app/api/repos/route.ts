import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

interface GitHubRepo {
  name: string;
  owner: {
    login: string;
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let page = 1;
  const repos: GitHubRepo[] = [];

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) break;

    repos.push(
      ...data.map((repo: GitHubRepo) => ({
        name: repo.name,
        owner: {
          login: repo.owner.login,
        },
      })),
    );

    page++;
  }

  return NextResponse.json(repos);
}
