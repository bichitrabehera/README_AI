"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RepoGrid from "@/components/dashboard/RepoGrid";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-black text-white px-6 py-3">
      <div className="max-w-6xl mx-auto">

        <DashboardHeader username={session?.user?.name} />

        <div className="py-8">
          <h1 className="text-2xl font-semibold">
            Your GitHub Repositories
          </h1>
          <p className="text-white/50 text-sm">
            Select a repository to generate README
          </p>
        </div>

        {loading ? (
          <p>Fetching repositories...</p>
        ) : (
          <RepoGrid
            repos={repos}
            onSelect={(repo) =>
              router.push(`/repo/${repo.owner.login}/${repo.name}`)
            }
          />
        )}
      </div>
    </div>
  );
}
