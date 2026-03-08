"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RepoGrid from "@/components/dashboard/RepoGrid";
import { GitHubRepo } from "@/types/github";
import { SearchIcon } from "lucide-react";

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
      <div className="py-6 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 rounded border border-white/10 bg-white/5 px-4 py-2 transition focus-within:border-white/30">
          <SearchIcon size={16} className="text-white/40 shrink-0" />

          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="pb-4 px-4">
          <h1 className="text-xl font-semibold">Projects</h1>

          <p className="mt-4 text-sm text-white/90 bg-red-500/20 inline-block px-3 py-1 rounded-lg">
            You can generate one README per day.
          </p>
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
