"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RepoGrid from "@/components/dashboard/RepoGrid";
import { GitHubRepo } from "@/types/github";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchRepos = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/repos");
        const data = await res.json();
        setRepos(data);
      } catch (err) {
        console.error("Failed to fetch repos", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [status]);

  if (status === "loading") {
    return <p className="text-white p-6 text-center">Loading session...</p>;
  }

  // Filter repositories based on search
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardHeader username={session?.user?.name} />

      <div className="max-w-6xl mx-auto">
        <div className="py-8 px-4">
          <h1 className="text-2xl font-semibold">Your GitHub Repositories</h1>
          <p className="text-white/50 text-sm">
            {filteredRepos.length} repositories · Select one to generate a
            README
          </p>
          <p className="mt-4 text text-white/90 bg-red-500/20 inline-block px-3 py-1 rounded">
            Note: You can generate one README per day.
          </p>
        </div>

        <div className="px-4 pb-6">
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-white/30"
          />
        </div>

        {loading ? (
          <p className="text-center">Fetching repositories...</p>
        ) : (
          <RepoGrid
            repos={filteredRepos}
            onSelect={(repo) =>
              router.push(`/repo/${repo.owner.login}/${repo.name}`)
            }
          />
        )}
      </div>
    </div>
  );
}
