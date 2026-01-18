"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRepos = async () => {
      setLoading(true);

      const res = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `token ${session.accessToken}`,
        },
      });

      const data = await res.json();
      setRepos(data);
      setLoading(false);
    };

    fetchRepos();
  }, [session]);

  if (status === "loading") {
    return <p className="text-white p-6">Loading session...</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-white/50 text-sm">
            Select a repository to generate README
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 rounded-md bg-red-500/90 hover:bg-red-500 text-white text-sm font-medium transition"
        >
          Logout
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Your GitHub Repositories</h1>

      {loading && <p>Fetching repos...</p>}

      <div className="grid gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() =>
              router.push(`/repo/${repo.owner.login}/${repo.name}`)
            }
            className={`p-4 border rounded-lg cursor-pointer transition
              ${
                selectedRepo?.id === repo.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 hover:bg-white/5"
              }
            `}
          >
            <h2 className="font-medium">{repo.name}</h2>
            <p className="text-sm text-white/60">
              {repo.description || "No description"}
            </p>
            <p className="text-xs text-white/40 mt-1">
              {repo.language || "Unknown"}
            </p>
          </div>
        ))}
      </div>

      {selectedRepo && (
        <div className="mt-8 p-4 border border-white/10 rounded-lg">
          <h2 className="text-lg font-semibold">
            Selected: {selectedRepo.name}
          </h2>
          <p className="text-white/60">
            {selectedRepo.description || "No description"}
          </p>
        </div>
      )}
    </div>
  );
}
